import socketIo from 'socket.io';

export interface MapCoords {
  x: number;
  y: number;
}
export interface GameMap {
  coords: { [key: string]: number };
  _height: number;
  _width: number;
}

export interface Bomb extends MapCoords {
  countdown: number;
  power: number;
  superFire: boolean;
  setBy: string;
}

export interface Fire extends MapCoords {
  countdown: number;
  distance: number;
}

export interface ActiveFire {
  tile: MapCoords;
  dir: PermittedDirection | null;
  remainingPower: number;
}

type PowerupType = 'MORE_BOMBS' | 'MORE_FIRE' | 'SUPER_FIRE';

export interface Powerup extends MapCoords {
  type: PowerupType;
}

export type PermittedDirection = 'up' | 'down' | 'left' | 'right';

export type PlayerName = 'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'non-player';

export interface PlayerProperties {
  name: PlayerName;
  role: string;
  position: string;
  ready: boolean;
  numBombs: number;
  numFire: number;
  superFire: boolean;
  handle: string;
  orientation: PermittedDirection;
  currentlyPlaying: boolean;
}

export interface ExtendedSocket extends socketIo.Socket {
  properties: PlayerProperties;
}

export interface Banter{
  banterInput: string;
  playerName: string;
  handle: string;
}