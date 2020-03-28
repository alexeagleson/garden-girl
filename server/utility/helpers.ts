import { MapCoords, ExtendedSocket, PlayerName } from './types';

export const up = (c: MapCoords) => ({ x: c.x, y: c.y - 1 });
export const down = (c: MapCoords) => ({ x: c.x, y: c.y + 1 });
export const left = (c: MapCoords) => ({ x: c.x - 1, y: c.y });
export const right = (c: MapCoords) => ({ x: c.x + 1, y: c.y });

export const coordsFromDir = {
  up,
  down,
  left,
  right
};

export const getCoords = (coords: string) => {
  const splitCoords = coords.split(',');
  const x = splitCoords?.[0];
  const y = splitCoords?.[1];
  if (x === undefined || y === undefined) {
    console.error('Coords ' + coords + ' are invalid.');
    return { x: 0, y: 0 } as MapCoords;
  }
  return { x: parseInt(x, 0), y: parseInt(y, 0) } as MapCoords;
};

export const keyFromCoords = (coords: MapCoords) => `${coords.x},${coords.y}`;

export const isNotDisplay = (sock: ExtendedSocket) => {
  if (sock.properties.role === 'display') return false;
  return true;
};

export const isDisplay = (sock: ExtendedSocket) => {
  if (sock.properties.role === 'display') return true;
  return false;
};

export const isCurrentlyPlayingPlayer = (sock: ExtendedSocket) => {
  if (sock.properties.role !== 'display' && sock.properties.currentlyPlaying) return true;
  return false;
};

export const playerNames: PlayerName[] = ['p1', 'p2', 'p3', 'p4', 'p5'];

export const nextAvailablePlayerName = (players: ExtendedSocket[]) => {
  return playerNames.find(name => {
    return !players.some(sock => sock.properties.name === name);
  });
};

export const sameCoords = (a: MapCoords, b: MapCoords) => {
  if (a.x === b.x && a.y === b.y) return true;
  return false;
};
