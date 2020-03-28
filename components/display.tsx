import React, { useEffect, createRef, useState, useRef } from 'react';
import * as PIXI from 'pixi.js';
import { Stage } from 'react-pixi-fiber';
import { SCALE_MODES } from 'pixi.js';
import { useConnection } from './use-connection';
import { Loading } from './loading';
import { ReadyRoom } from './ready-room';
import {
  GameMap,
  PlayerProperties,
  Bomb,
  Fire,
  Banter,
  Powerup
} from '../server/utility/types';
import styled from 'styled-components';
import {
  MapRenderer,
  AnimatedSpriteRenderer,
  AnimatedBombRenderer,
  AnimatedFireRenderer,
  PowerupRenderer
} from './sprite-renderers';
import { PageHead } from './page-head';

const BanterBoard = styled.div`
  background-color: #decaa8;
  padding: 5px;
  font-size: 12px;
  font-family: "Montserrat", Georgia, "Times New Roman", Times, serif;
  height: calc(608px + 16px);
  width: 288px;
  color: black;
  border-color: #781514;
  border-radius: 10px;
  border-width: 8px;
  border-style: ridge;
  box-sizing: border-box;
`;

const GameWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: calc(608px + 288px + 16px);
  justify-content: center;

  canvas {
    box-sizing: border-box;
    border-color: #781514;
    border-radius: 10px;
    border-width: 8px;
    border-style: ridge;
  }

  .playername {
    font-family: "Montserrat", Georgia, "Times New Roman", Times, serif;
    font-weight: bold;
    color: black;
  }
`;

const IconLegend = styled.div`
  display: flex;
  direction: row;
  justify-content: center;
  background-color: #f6ca8a;
  padding: 20px;
  box-sizing: border-box;
  border-color: #781514;
  border-radius: 10px;
  border-width: 8px;
  border-style: ridge;
  width: 100%;
  height: 100px;

  p {
    font-family: "Montserrat", Georgia, "Times New Roman", Times, serif;
    font-weight: bold;
    font-size: 16px;
    color: black;
    padding-right: 25px;
  }

  .legendpic {
    width: 32px;
    height: 32px;
    padding-right: 5px;
    padding-top: 5px;
  }
`;

const PlayerSpeak = styled.span`
  color: white;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000,
    1px 1px 0 #000;

  position: absolute;
  z-index: 9999;
`;

export const getCoordsClient = (coords: string) => {
  const splitCoords = coords.split(',');
  const x = splitCoords?.[0];
  const y = splitCoords?.[1];
  // if (x === undefined || y === undefined) {
  //   alert('something is wrong');
  //   return console.error('Coords ' + coords + ' are invalid.');
  // }
  return { x: parseInt(x, 0), y: parseInt(y, 0) };
};

PIXI.settings.SCALE_MODE = SCALE_MODES.NEAREST;

const DynamicComponent = () => {
  const [gameMap, setGameMap] = useState<GameMap>();
  const [players, setPlayers] = useState<PlayerProperties[]>([]);
  const [bombs, setBombs] = useState<Bomb[]>([]);
  const [fire, setFire] = useState<Fire[]>([]);
  const [powerups, setPowerups] = useState<Powerup[]>([]);
  const [gameTicker, setGameTicker] = useState(0);
  const [banter, setBanter] = useState<Banter[]>([]);
  const [mostRecentBanter, setMostRecentBanter] = useState<
    Banter | undefined
  >();

  const { io, loading, gameIsRunning } = useConnection('display');

  useEffect(() => {
    if (!loading) {
      io.on('updated-players', (players: PlayerProperties[]) => {
        setPlayers(players);
      });

      io.on('updated-map', (map: GameMap) => {
        setGameMap(map);
      });

      io.on('updated-bombs', (bombs: Bomb[]) => {
        setBombs([...bombs]);
      });

      io.on('updated-fire', (fire: Fire[]) => {
        setFire([...fire]);
      });

      io.on('updated-powerups', (powerups: Powerup[]) => {
        setPowerups([...powerups]);
      });

      io.on('banter-to-all-players', (someBanter: Banter) => {
        setBanter(oldBanter => [
          ...(oldBanter.length > 10 ? [] : oldBanter),
          someBanter
        ]);
        setMostRecentBanter(someBanter);
        setTimeout(() => setMostRecentBanter(undefined), 5000);
      });

      io.emit('request-updated-map');
      io.emit('request-updated-players');
      io.emit('request-updated-bombs');
      io.emit('request-updated-fire');
      io.emit('request-updated-powerups');

      const interval = setInterval(() => {
        setGameTicker(prev => prev + 1);
      }, 250);

      return () => clearInterval(interval);
    }
  }, [loading]);

  if (loading) return <Loading loadingWhat={'the connection.'} />;
  if (!gameMap) {
    return (
      <Loading
        loadingWhat={
          // 'the game map.  If it\'s stuck here check your localhost IP.',
          'Loading....'
        }
      />
    );
  }
  if (!gameIsRunning) {
    return <ReadyRoom listOfPlayers={players}></ReadyRoom>;
  }

  const mostRecentSpeaker = players.find(
    p => p.name === mostRecentBanter?.playerName
  );

  return (
    <GameWrapper>
      <Stage
        options={{
          backgroundColor: 0x10bb99,
          height: gameMap._height * 32,
          width: gameMap._width * 32
        }}
      >
        <>
          <MapRenderer gameMap={gameMap} />
          <AnimatedSpriteRenderer
            players={players}
            currSpriteNumber={gameTicker % 3}
          />
          <AnimatedBombRenderer
            bombs={bombs}
            currSpriteNumber={gameTicker % 3}
          />
          <AnimatedFireRenderer fire={fire} currSpriteNumber={gameTicker % 3} />
          <PowerupRenderer powerups={powerups} />
        </>
      </Stage>

      {mostRecentBanter && mostRecentSpeaker && (
        <PlayerSpeak
          style={{
            left: `${getCoordsClient(mostRecentSpeaker.position)?.x * 32 -
              16}px`,
            top: `${getCoordsClient(mostRecentSpeaker.position)?.y * 32 - 16}px`
          }}
        >
          {mostRecentBanter.handle || mostRecentBanter.playerName}:{' '}
          {mostRecentBanter.banterInput}
        </PlayerSpeak>
      )}

      <BanterBoard>
        {banter.map(bObject => (
          <p className="playername">
            {bObject.handle || bObject.playerName}: {bObject.banterInput}{' '}
          </p>
        ))}
      </BanterBoard>

      <IconLegend>
        <img
          className="legendpic"
          src="MORE_BOMBS.png"
          alt="picture of 3 bombs"
        />
        <p>Drop More Bombs</p>
        <img
          className="legendpic"
          src="more_fire.png"
          alt="picture of a bomb with a plus sign"
        />
        <p>Bigger Blasts</p>
        <img
          className="legendpic"
          src="SUPER_FIRE.png"
          alt="picture of an explosion"
        />
        <p>Blast Through Rocks</p>
      </IconLegend>
    </GameWrapper>
  );
};

export default DynamicComponent;
