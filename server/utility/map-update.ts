import { GameMap } from './types';
import { surroundedByEmpties } from './map-read';
import { getCoords } from './helpers';

export const carveCorners = (map: GameMap) => {
  let x = 1;
  let y = 1;
  if (map.coords?.[`${x},${y}`]) map.coords[`${x},${y}`] = 0;
  if (map.coords?.[`${x + 1},${y}`]) map.coords[`${x + 1},${y}`] = 0;
  if (map.coords?.[`${x},${y + 1}`]) map.coords[`${x},${y + 1}`] = 0;
  if (map.coords?.[`${x + 2},${y}`]) map.coords[`${x + 2},${y}`] = 0;
  if (map.coords?.[`${x},${y + 2}`]) map.coords[`${x},${y + 2}`] = 0;

  x = map._width - 2;
  y = 1;
  if (map.coords?.[`${x},${y}`]) map.coords[`${x},${y}`] = 0;
  if (map.coords?.[`${x - 1},${y}`]) map.coords[`${x - 1},${y}`] = 0;
  if (map.coords?.[`${x},${y + 1}`]) map.coords[`${x},${y + 1}`] = 0;
  if (map.coords?.[`${x - 2},${y}`]) map.coords[`${x - 2},${y}`] = 0;
  if (map.coords?.[`${x},${y + 2}`]) map.coords[`${x},${y + 2}`] = 0;

  x = 1;
  y = map._height - 2;
  if (map.coords?.[`${x},${y}`]) map.coords[`${x},${y}`] = 0;
  if (map.coords?.[`${x + 1},${y}`]) map.coords[`${x + 1},${y}`] = 0;
  if (map.coords?.[`${x},${y - 1}`]) map.coords[`${x},${y - 1}`] = 0;
  if (map.coords?.[`${x + 2},${y}`]) map.coords[`${x + 2},${y}`] = 0;
  if (map.coords?.[`${x},${y - 2}`]) map.coords[`${x},${y - 2}`] = 0;

  x = map._width - 2;
  y = map._height - 2;
  if (map.coords?.[`${x},${y}`]) map.coords[`${x},${y}`] = 0;
  if (map.coords?.[`${x - 1},${y}`]) map.coords[`${x - 1},${y}`] = 0;
  if (map.coords?.[`${x},${y - 1}`]) map.coords[`${x},${y - 1}`] = 0;
  if (map.coords?.[`${x - 2},${y}`]) map.coords[`${x - 2},${y}`] = 0;
  if (map.coords?.[`${x},${y - 2}`]) map.coords[`${x},${y - 2}`] = 0;

  x = Math.floor(map._width / 2);
  y = Math.floor(map._height / 2);
  if (map.coords?.[`${x},${y}`]) map.coords[`${x},${y}`] = 0;
  if (map.coords?.[`${x - 1},${y}`]) map.coords[`${x - 1},${y}`] = 0;
  if (map.coords?.[`${x},${y - 1}`]) map.coords[`${x},${y - 1}`] = 0;
  if (map.coords?.[`${x - 2},${y}`]) map.coords[`${x - 2},${y}`] = 0;
  if (map.coords?.[`${x},${y - 2}`]) map.coords[`${x},${y - 2}`] = 0;
  if (map.coords?.[`${x + 1},${y}`]) map.coords[`${x + 1},${y}`] = 0;
  if (map.coords?.[`${x},${y + 1}`]) map.coords[`${x},${y + 1}`] = 0;
  if (map.coords?.[`${x + 2},${y}`]) map.coords[`${x + 2},${y}`] = 0;
  if (map.coords?.[`${x},${y + 2}`]) map.coords[`${x},${y + 2}`] = 0;
};

export const placeWalls = (map: GameMap) => {
  Object.keys(map.coords).forEach(mapKey => {
    const mapCoords = getCoords(mapKey);
    if (!mapCoords) return;

    if (surroundedByEmpties(mapCoords, map)) {
      map.coords[mapKey] = 1;
    }
  });
};

export const placeRocks = (map: GameMap) => {
  Object.keys(map.coords).forEach(mapKey => {
    const mapCoords = getCoords(mapKey);
    if (!mapCoords) return;
    if (map.coords[mapKey] === 1) return;

    if (Math.random() > 0.3) map.coords[mapKey] = 2;
  });
};
