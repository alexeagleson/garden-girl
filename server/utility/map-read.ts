import {
  MapCoords,
  GameMap,
  PermittedDirection,
  Bomb,
  ExtendedSocket,
  Powerup
} from './types';
import { keyFromCoords, getCoords, sameCoords } from './helpers';

export const surroundedByEmpties = (coords: MapCoords, map: GameMap) => {
  const up = { x: coords.x, y: coords.y - 1 };
  const down = { x: coords.x, y: coords.y + 1 };
  const left = { x: coords.x - 1, y: coords.y };
  const right = { x: coords.x + 1, y: coords.y };
  const upleft = { x: coords.x - 1, y: coords.y - 1 };
  const upright = { x: coords.x + 1, y: coords.y - 1 };
  const downleft = { x: coords.x - 1, y: coords.y + 1 };
  const downright = { x: coords.x + 1, y: coords.y + 1 };

  if (map.coords?.[keyFromCoords(coords)] === 1) return false;
  if (map.coords?.[keyFromCoords(up)] === 1) return false;
  if (map.coords?.[keyFromCoords(down)] === 1) return false;
  if (map.coords?.[keyFromCoords(left)] === 1) return false;
  if (map.coords?.[keyFromCoords(right)] === 1) return false;
  if (map.coords?.[keyFromCoords(upleft)] === 1) return false;
  if (map.coords?.[keyFromCoords(upright)] === 1) return false;
  if (map.coords?.[keyFromCoords(downleft)] === 1) return false;
  if (map.coords?.[keyFromCoords(downright)] === 1) return false;

  return true;
};

export const hasPowerup = (coords: MapCoords, powerups: Powerup[]) => {
  const powerupFound = powerups.find(p => sameCoords(coords, p));
  if (powerupFound) {
    return powerupFound.type;
  }
  return false;
};

export const isBlocked = (
  coords: MapCoords,
  map: GameMap,
  bombs: Bomb[]
  // dir: PermittedDirection
) => {
  // if (dir === 'up') {
  // const up = { x: coords.x, y: coords.y - 1 };
  if (map.coords?.[keyFromCoords(coords)] === 1) return 'bush';
  if (map.coords?.[keyFromCoords(coords)] === 2) return 'rock';
  const bombBlocked = bombs.find(b => sameCoords(coords, b));
  if (bombBlocked) return 'bomb';
  // }

  // if (dir === 'down') {
  //   const down = { x: coords.x, y: coords.y + 1 };
  //   if (map.coords?.[keyFromCoords(down)] === 1) return 'bush';
  //   if (map.coords?.[keyFromCoords(down)] === 2) return 'rock';
  //   const bombBlocked = bombs.find(b => b.x === down.x && b.y === down.y);
  //   if (bombBlocked) return 'bomb';
  // }

  // if (dir === 'left') {
  //   const left = { x: coords.x - 1, y: coords.y };
  //   if (map.coords?.[keyFromCoords(left)] === 1) return 'bush';
  //   if (map.coords?.[keyFromCoords(left)] === 2) return 'rock';
  //   const bombBlocked = bombs.find(b => b.x === left.x && b.y === left.y);
  //   if (bombBlocked) return 'bomb';
  // }

  // if (dir === 'right') {
  //   const right = { x: coords.x + 1, y: coords.y };
  //   if (map.coords?.[keyFromCoords(right)] === 1) return 'bush';
  //   if (map.coords?.[keyFromCoords(right)] === 2) return 'rock';
  //   const bombBlocked = bombs.find(b => b.x === right.x && b.y === right.y);
  //   if (bombBlocked) return 'bomb';
  // }

  return false;
};
