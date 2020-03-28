import React, { useEffect } from 'react';
import * as PIXI from 'pixi.js';
import { getCoordsClient } from './display';
import {
  PlayerProperties,
  GameMap,
  Bomb,
  Fire,
  Powerup
} from 'server/utility/types';
import { Sprite } from 'react-pixi-fiber';

const spriteLocations = [
  [0, 0, 32, 32],
  [32, 0, 32, 32],
  [64, 0, 32, 32]
];

const characterLocations = [0, 0, 0, 0, 0].map((t, index) => [
  [index * 32, 0, 32, 32],
  [index * 32, 32, 32, 32],
  [index * 32, 64, 32, 32],
  [index * 32, 96, 32, 32]
]);

const bombTiles = spriteLocations.map(
  loc =>
    new PIXI.Texture(
      (PIXI.Texture.from('/bomb_tilesheet.png') as unknown) as PIXI.BaseTexture,
      new PIXI.Rectangle(...loc)
    )
);

const characterTileMaps = {
  p1: characterLocations[0].map(
    loc =>
      new PIXI.Texture(
        (PIXI.Texture.from(
          '/gg_characters.png'
        ) as unknown) as PIXI.BaseTexture,
        new PIXI.Rectangle(...loc)
      )
  ),
  p2: characterLocations[1].map(
    loc =>
      new PIXI.Texture(
        (PIXI.Texture.from(
          '/gg_characters.png'
        ) as unknown) as PIXI.BaseTexture,
        new PIXI.Rectangle(...loc)
      )
  ),
  p3: characterLocations[2].map(
    loc =>
      new PIXI.Texture(
        (PIXI.Texture.from(
          '/gg_characters.png'
        ) as unknown) as PIXI.BaseTexture,
        new PIXI.Rectangle(...loc)
      )
  ),
  p4: characterLocations[3].map(
    loc =>
      new PIXI.Texture(
        (PIXI.Texture.from(
          '/gg_characters.png'
        ) as unknown) as PIXI.BaseTexture,
        new PIXI.Rectangle(...loc)
      )
  ),
  p5: characterLocations[4].map(
    loc =>
      new PIXI.Texture(
        (PIXI.Texture.from(
          '/gg_characters.png'
        ) as unknown) as PIXI.BaseTexture,
        new PIXI.Rectangle(...loc)
      )
  )
};

const orientationMap = {
  down: 2,
  up: 0,
  right: 1,
  left: 3
};

const rock = PIXI.Texture.from('/rock.png');
const bush = PIXI.Texture.from('/bush.png');
const player = PIXI.Texture.from('/player.png');
const dirt = PIXI.Texture.from('/dirt.png');
const bomb = PIXI.Texture.from('/bomb.png');
const fire = PIXI.Texture.from('/fire.png');
const red_bomb = PIXI.Texture.from('/red_bomb.png');

const powerupSprites = {
  MORE_FIRE: PIXI.Texture.from('/MORE_FIRE.png'),
  MORE_BOMBS: PIXI.Texture.from('/MORE_BOMBS.png'),
  SUPER_FIRE: PIXI.Texture.from('/SUPER_FIRE.png')
};

export const MapRenderer = (props: { gameMap: GameMap }) => {
  return (
    <>
      {Object.keys(props.gameMap.coords).map((mapKey, index) => {
        const mapCoords = getCoordsClient(mapKey);

        if (!mapCoords) return null;

        return (
          <Sprite
            key={index}
            texture={
              props.gameMap.coords[mapKey] === 0
                ? dirt
                : props.gameMap.coords[mapKey] === 1
                ? bush
                : rock
            }
            rotation={0}
            x={mapCoords.x * 32}
            y={mapCoords.y * 32}
            scale={{ x: 1, y: 1 }}
          />
        );
      })}
    </>
  );
};

export const AnimatedSpriteRenderer = (props: {
  players: PlayerProperties[];
  currSpriteNumber: number;
}) => {
  return (
    <>
      {props.players.map((p, index) => {
        const playerCoords = getCoordsClient(p.position);
        if (!playerCoords) return;

        return (
          <Sprite
            key={index}
            texture={
              (characterTileMaps as any)[p.name][orientationMap[p.orientation]]
            }
            rotation={0}
            x={playerCoords.x * 32}
            y={playerCoords.y * 32}
            scale={{ x: 1, y: 1 }}
          />
        );
      })}
    </>
  );
};

export const AnimatedBombRenderer = (props: {
  bombs: Bomb[];
  currSpriteNumber: number;
}) => {
  return (
    <>
      {props.bombs.map((b, index) => {
        return (
          <Sprite
            key={index}
            texture={
              b.countdown === 1 ? red_bomb : bombTiles[props.currSpriteNumber]
            }
            rotation={0}
            x={b.x * 32}
            y={b.y * 32}
            scale={{ x: 1, y: 1 }}
          />
        );
      })}
    </>
  );
};

export const AnimatedFireRenderer = (props: {
  fire: Fire[];
  currSpriteNumber: number;
}) => {
  return (
    <>
      {props.fire.map((f, index) => {
        return (
          <Sprite
            key={index}
            texture={fire}
            rotation={0}
            x={f.x * 32}
            y={f.y * 32}
            scale={{ x: 1, y: 1 }}
          />
        );
      })}
    </>
  );
};

export const PowerupRenderer = (props: { powerups: Powerup[] }) => {
  return (
    <>
      {props.powerups.map((pow, index) => {
        return (
          <Sprite
            key={index}
            texture={powerupSprites[pow.type]}
            rotation={0}
            x={pow.x * 32}
            y={pow.y * 32}
            scale={{ x: 1, y: 1 }}
          />
        );
      })}
    </>
  );
};
