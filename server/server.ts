'use strict';

require('dotenv').config();
import express from 'express';
import next from 'next';
import { Pool } from 'pg';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import socketIo from 'socket.io';
import http from 'http';
import * as ROT from 'rot-js';
import {
  PermittedDirection,
  ExtendedSocket,
  GameMap,
  Bomb,
  Fire,
  MapCoords,
  Banter,
  Powerup,
  PlayerProperties,
  ActiveFire
} from './utility/types';
import {
  isNotDisplay,
  getCoords,
  keyFromCoords,
  nextAvailablePlayerName,
  up,
  down,
  left,
  right,
  sameCoords,
  coordsFromDir,
  isCurrentlyPlayingPlayer
} from './utility/helpers';
import { emitAllPlayerData } from './utility/socket-emitters';
import { isBlocked, hasPowerup } from './utility/map-read';
import { placeWalls, placeRocks, carveCorners } from './utility/map-update';

const port = 4001;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const pool = new Pool();

const generateMap = () => {
  const map = new ROT.Map.Arena(19, 19);
  const newGameMap = { coords: {} } as GameMap;

  const userCallback = (x: any, y: any, value: any) => {
    newGameMap.coords[`${x},${y}`] = value;
  };

  map.create(userCallback);
  newGameMap._height = map._height;
  newGameMap._width = map._height;

  placeWalls(newGameMap);
  placeRocks(newGameMap);
  carveCorners(newGameMap);

  return newGameMap;
};

const generateStartingPosition = (map: GameMap) => {
  const newStartingPositions = {
    p1: `${1},${1}`,
    p2: `${map._width - 2},${map._height - 2}`,
    p3: `${map._width - 2},${1}`,
    p4: `${1},${map._height - 2}`,
    p5: `${Math.floor(map._width / 2)},${Math.floor(map._width / 2)}`,
    'non-player': 'none'
  };

  return newStartingPositions;
};

let gameMap = generateMap();
let startingPositions = generateStartingPosition(gameMap);

const defaultPlayerProperties = (): PlayerProperties => ({
  name: 'non-player',
  role: 'default',
  position: 'none',
  ready: false,
  numBombs: 1,
  numFire: 1,
  superFire: false,
  handle: '',
  orientation: 'down',
  currentlyPlaying: false
});
const GAME_TIME_LIMIT = 600;

let peopleWhoAreConnected: ExtendedSocket[] = [];
let gameRunning = false;
let bombs: Bomb[] = [];
let fire: Fire[] = [];
let powerups: Powerup[] = [];
let bombsAllowed = false;
let maxTime = GAME_TIME_LIMIT;

const handleFire = (activeFire: ActiveFire, superFire: boolean) => {
  const blockingObject = isBlocked(activeFire.tile, gameMap, bombs);
  if (blockingObject !== 'bush') {
    fire.push({
      x: activeFire.tile.x,
      y: activeFire.tile.y,
      countdown: 2,
      distance: activeFire.remainingPower
    });
    gameMap.coords[keyFromCoords(activeFire.tile)] = 0;

    const playersHit = peopleWhoAreConnected
      .filter(isNotDisplay)
      .filter(p =>
        sameCoords(getCoords(p.properties.position), activeFire.tile)
      );

    if (playersHit.length > 0) {
      peopleWhoAreConnected = peopleWhoAreConnected.filter(sock => {
        if (playersHit.find(p => p.id === sock.id)) {
          sock.emit('game-over', 'You died.');
          return false;
        }
        return true;
      });
    }

    const bombHit = bombs.find(possibleChainBomb =>
      sameCoords(possibleChainBomb, activeFire.tile)
    );

    if (bombHit && bombHit.countdown > 1) bombHit.countdown = 1;

    if (blockingObject === 'rock') {
      const rando = Math.random();
      if (rando < 0.12) {
        powerups.push({ ...activeFire.tile, type: 'MORE_FIRE' });
      } else if (rando < 0.24) {
        powerups.push({ ...activeFire.tile, type: 'MORE_BOMBS' });
      } else if (rando < 0.28) {
        powerups.push({ ...activeFire.tile, type: 'SUPER_FIRE' });
      }
    }

    if (
      (blockingObject !== 'rock' || superFire) &&
      activeFire.dir !== null &&
      activeFire.remainingPower > 1
    ) {
      handleFire(
        {
          tile: coordsFromDir[activeFire.dir](activeFire.tile),
          remainingPower: activeFire.remainingPower - 1,
          dir: activeFire.dir
        },
        superFire
      );
    }
  }
};

const resetGame = (gameEndText: string) => {
  gameMap = generateMap();
  startingPositions = generateStartingPosition(gameMap);
  gameRunning = false;
  bombs = [];
  fire = [];
  powerups = [];
  bombsAllowed = false;
  maxTime = GAME_TIME_LIMIT;

  peopleWhoAreConnected.filter(isNotDisplay).forEach(pl => {
    pl.emit('game-over', gameEndText);
    setTimeout(() => pl.disconnect(), 1000);
  });
  peopleWhoAreConnected = peopleWhoAreConnected.filter(isNotDisplay);
};

app.prepare().then(() => {
  const expressHandler = express();
  const server = http.createServer(expressHandler);
  expressHandler.use(
    cors({
      origin(origin: any, callback: any) {
        callback(null, true);
      }
    })
  );
  expressHandler.use(cookieParser());
  expressHandler.use(express.json());
  expressHandler.use(express.urlencoded({ extended: false }));

  const io = socketIo(server);

  const emitEverythingToEveryone = () => {
    io.emit('updated-bombs', bombs);
    io.emit('updated-powerups', powerups);
    io.emit('updated-fire', fire);
    io.emit('updated-map', gameMap);
    io.emit('updated-powerups', powerups);
    io.emit('game-running', gameRunning);
    io.emit('winner', gameRunning);
    emitAllPlayerData(io, peopleWhoAreConnected);
  };

  const acquirePowerup = (coords: MapCoords, player: ExtendedSocket) => {
    const pickedUpPowerup = hasPowerup(coords, powerups);
    if (pickedUpPowerup) {
      if (pickedUpPowerup === 'MORE_FIRE') {
        player.properties.numFire = player.properties.numFire + 1;
      } else if (pickedUpPowerup === 'MORE_BOMBS') {
        player.properties.numBombs = player.properties.numBombs + 1;
      } else if (pickedUpPowerup === 'SUPER_FIRE') {
        player.properties.superFire = true;
      }
      const powerupLength = powerups.length;
      powerups = powerups.filter(p => {
        if (sameCoords(p, coords)) return false;
        return true;
      });

      if (powerupLength !== powerups.length) {
        io.emit('updated-powerups', powerups);
      }
      return true;
    }
    return false;
  };

  setInterval(() => {
    if (!gameRunning) return false;

    maxTime--;
    const numBombs = bombs.length;
    const numFire = fire.length;
    const numPowerups = powerups.length;

    if (maxTime <= 10) {
      io.emit('banter-to-all-players', {
        banterInput: '' + maxTime,
        playerName: 'Game',
        handle: ''
      });
    }

    if (maxTime <= 0) {
      resetGame('Game over, time has run out.');
      emitEverythingToEveryone();
    }

    let rerenderBombs = false;
    if (numBombs == 0 && numFire === 0) return;

    const numPlayers = peopleWhoAreConnected.filter(isNotDisplay).length;

    bombs.forEach(b => {
      b.countdown -= 1;
      if (b.countdown === 1) rerenderBombs = true;
      const startingFireDistance = b.power;

      const surroundingTiles: ActiveFire[] = [
        { tile: b, dir: null, remainingPower: startingFireDistance },
        { tile: up(b), dir: 'up', remainingPower: startingFireDistance },
        { tile: down(b), dir: 'down', remainingPower: startingFireDistance },
        { tile: left(b), dir: 'left', remainingPower: startingFireDistance },
        { tile: right(b), dir: 'right', remainingPower: startingFireDistance }
      ];

      if (b.countdown <= 0) {
        surroundingTiles.forEach(fire => handleFire(fire, b.superFire));
      }
    });

    fire.forEach(f => {
      f.countdown -= 1;
    });

    bombs = bombs.filter(b => {
      if (b.countdown <= 0) return false;
      return true;
    });

    fire = fire.filter(f => {
      if (f.countdown <= 0) return false;
      return true;
    });

    if (rerenderBombs || numBombs !== bombs.length) {
      io.emit('updated-bombs', bombs);
    }

    if (numPowerups !== powerups.length) {
      io.emit('updated-powerups', powerups);
    }

    if (numFire !== fire.length) {
      io.emit('updated-fire', fire);
      io.emit('updated-map', gameMap);
    }

    // io.emit('updated-bombs', bombs);
    // io.emit('updated-fire', fire);
    io.emit('updated-powerups', powerups);

    const newNumPlayers = peopleWhoAreConnected.filter(isCurrentlyPlayingPlayer)
      .length;

    if (numPlayers !== newNumPlayers) {
      emitAllPlayerData(io, peopleWhoAreConnected);
      if (newNumPlayers < 2) {
        const winner = peopleWhoAreConnected.filter(
          isCurrentlyPlayingPlayer
        )?.[0];
        setTimeout(() => {
          resetGame(
            'Game over. ' +
              (winner?.properties.handle ||
                winner?.properties.name ||
                'somebody') +
              ' wins!'
          );
          emitEverythingToEveryone();
        }, 3000);
      }
    }
  }, 500);

  io.on('connection', (playerSocket: ExtendedSocket) => {
    if (peopleWhoAreConnected.find(sock => sock.id === playerSocket.id)) {
      // player is already connected, doesnt need to connect again, do nothing
      return;
    }

    playerSocket.properties = defaultPlayerProperties();

    playerSocket.on('start-game', playload => {
      const assignedName = nextAvailablePlayerName(peopleWhoAreConnected);

      if (playload.role !== 'display' && gameRunning === true) {
        playerSocket.emit(
          'game-over',
          'Game is currently running.  Please try again later.'
        );
        setTimeout(() => playerSocket.disconnect(), 1000);
        return;
      }

      if (
        !assignedName ||
        peopleWhoAreConnected.filter(isNotDisplay).length === 5
      ) {
        console.log('TOO MANY DANG PLAYERS ALREADY');
        io.to(playerSocket.id).emit('rejected');
        setTimeout(() => playerSocket.disconnect(), 1000);
        return;
      }
      playerSocket.properties.role = playload.role;

      if (playload.role === 'display') {
        playerSocket.properties.name = 'non-player';
      } else if (playload.role === 'controller') {
        playerSocket.properties.name = assignedName;
        playerSocket.properties.position = startingPositions[assignedName];
      }

      peopleWhoAreConnected.push(playerSocket);

      peopleWhoAreConnected.map((aWebSocket, index) => {
        console.log(
          '#' +
            (index + 1) +
            ' ' +
            aWebSocket.properties.name +
            ': ' +
            aWebSocket.properties.role
        );
      });
      console.log('\n');

      emitAllPlayerData(io, peopleWhoAreConnected);
    });

    playerSocket.on('request-updated-map', () => {
      playerSocket.emit('updated-map', gameMap);
    });

    playerSocket.on('request-game-running', () => {
      playerSocket.emit('game-running', gameRunning);
    });

    playerSocket.on('request-updated-players', () => {
      emitAllPlayerData(io, peopleWhoAreConnected);
    });

    playerSocket.on('request-updated-powerups', () => {
      playerSocket.emit('updated-powerups', powerups);
    });

    playerSocket.on('set-handle', (handle: string) => {
      playerSocket.properties.handle = handle;
      emitAllPlayerData(io, peopleWhoAreConnected);
    });

    playerSocket.on('get-my-player', () => {
      playerSocket.emit(
        'here-is-your-player',
        peopleWhoAreConnected.find(pl => pl.id === playerSocket.id)?.properties
      );
    });

    playerSocket.on('banter', banterReceived => {
      const banterToSend: Banter = {
        banterInput: banterReceived,
        playerName: playerSocket.properties.name,
        handle: playerSocket.properties.handle
      };
      io.emit('banter-to-all-players', banterToSend);
    });

    playerSocket.on('move', (direction: PermittedDirection) => {
      const playerPositionObject = getCoords(playerSocket.properties.position);

      if (!playerPositionObject) return;

      if (direction === 'up') {
        if (isBlocked(up(playerPositionObject), gameMap, bombs)) return;
        acquirePowerup(up(playerPositionObject), playerSocket);
        playerPositionObject.y = playerPositionObject.y - 1;
        playerSocket.properties.orientation = direction;
      }
      if (direction === 'down') {
        if (isBlocked(down(playerPositionObject), gameMap, bombs)) return;
        acquirePowerup(down(playerPositionObject), playerSocket);
        playerPositionObject.y = playerPositionObject.y + 1;
        playerSocket.properties.orientation = direction;
      }
      if (direction === 'left') {
        if (isBlocked(left(playerPositionObject), gameMap, bombs)) return;
        acquirePowerup(left(playerPositionObject), playerSocket);
        playerPositionObject.x = playerPositionObject.x - 1;
        playerSocket.properties.orientation = direction;
      }

      if (direction === 'right') {
        if (isBlocked(right(playerPositionObject), gameMap, bombs)) return;
        acquirePowerup(right(playerPositionObject), playerSocket);
        playerPositionObject.x = playerPositionObject.x + 1;
        playerSocket.properties.orientation = direction;
      }

      playerSocket.properties.position = keyFromCoords(playerPositionObject);

      emitAllPlayerData(io, peopleWhoAreConnected);
    });

    playerSocket.on('ready', (readyValue: boolean) => {
      if (!gameRunning) {
        playerSocket.properties.ready = readyValue;

        if (
          peopleWhoAreConnected.filter(isNotDisplay).length >= 2 &&
          !peopleWhoAreConnected
            .filter(isNotDisplay)
            .some(p => p.properties.ready === false)
        ) {
          gameRunning = true;
          bombsAllowed = false;
          peopleWhoAreConnected
            .filter(isNotDisplay)
            .forEach(p => (p.properties.currentlyPlaying = true));
          io.emit('game-running', gameRunning);
          io.emit('banter-to-all-players', {
            banterInput: 'Get ready...',
            playerName: 'Game',
            handle: ''
          });
          io.emit('banter-to-all-players', {
            banterInput: '5 minute limit',
            playerName: 'Game',
            handle: ''
          });
          setTimeout(() => {
            io.emit('banter-to-all-players', {
              banterInput: '3...',
              playerName: 'Game',
              handle: ''
            });
          }, 7000);
          setTimeout(() => {
            io.emit('banter-to-all-players', {
              banterInput: '2...',
              playerName: 'Game',
              handle: ''
            });
          }, 8000);

          setTimeout(() => {
            io.emit('banter-to-all-players', {
              banterInput: '1...',
              playerName: 'Game',
              handle: ''
            });
          }, 9000);

          setTimeout(() => {
            io.emit('banter-to-all-players', {
              banterInput: 'GO!!!!!',
              playerName: 'Game',
              handle: ''
            });

            bombsAllowed = true;
          }, 10000);
        }

        emitAllPlayerData(io, peopleWhoAreConnected);
        io.emit('updated-bombs', bombs);
      }
    });

    playerSocket.on('drop-bomb', () => {
      if (gameRunning && bombsAllowed) {
        const myActiveBombs = bombs.filter(
          bom => bom.setBy === playerSocket.id
        );
        if (myActiveBombs.length >= playerSocket.properties.numBombs) return;

        const newBomb: Bomb = {
          ...getCoords(playerSocket.properties.position),
          countdown: 10,
          power: playerSocket.properties.numFire,
          superFire: playerSocket.properties.superFire,
          setBy: playerSocket.id
        };
        bombs.push(newBomb);
      }
      io.emit('updated-bombs', bombs);
    });

    playerSocket.on('request-updated-bombs', () => {
      io.emit('updated-bombs', bombs);
    });

    playerSocket.on('request-updated-fire', () => {
      io.emit('updated-fire', fire);
    });

    playerSocket.on('disconnect', () => {
      console.log(playerSocket.properties.name + ' disconnected.');

      peopleWhoAreConnected = peopleWhoAreConnected.filter(aWebSocket => {
        if (playerSocket.id === aWebSocket.id) return false;
        return true;
      });

      // if (peopleWhoAreConnected.filter(isNotDisplay).length < 2) {
      //   peopleWhoAreConnected.forEach(p => {
      //     p.properties.ready = false;
      //   });
      //   gameRunning = false;
      //   io.emit('game-running', gameRunning);
      // }

      if (
        gameRunning &&
        peopleWhoAreConnected.filter(isCurrentlyPlayingPlayer).length < 2
      ) {
        resetGame(
          'Game over.  Too many players have disconnected.  Please refresh.'
        );
        emitEverythingToEveryone();
      }

      emitAllPlayerData(io, peopleWhoAreConnected);
    });
  });

  expressHandler.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, () => {
    // if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });

  // pool.end();
});
