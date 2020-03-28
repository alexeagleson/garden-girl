import React from 'react';
import styled from 'styled-components';
import { ReadyRoomWrapper, FancyButton } from './ready-room';

const Button = styled.button`
  width: 200px;
  height: 50px;

  margin-bottom: 10px;
  border-style: ridge;
  border-width: 5px;
  border-radius: 10px;
  border-color: #f6ca8a;
  background-color: #f6ca8a;

  :hover {
    cursor: pointer;
    opacity: 0.85;
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 50px;

  div {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    margin: 0 25px;
  }

  img {
    width: 50px;
    height: auto;
  }

  label {
    font-size: 14px;
    margin-top: 10px;
  }
`;

const TextWrapper = styled.div`
  width: 70%;

  * {
    margin: 15px 0;
  }
`;

const MainText = styled.h1`
  color: #f6ca8a;
  font-size: 16px;
  line-height: 1.5;
  text-align: center;
  margin-bottom: 50px;
`;

const SubText = styled.h1`
  font-size: 14px;
  line-height: 1.5;
  text-align: center;
`;

export const HomePage = () => {
  return (
    <ReadyRoomWrapper
      style={{ justifyContent: 'flex-start', alignItems: 'center' }}
    >
      <p>GARDEN GIRL</p>
      <TextWrapper>
        <MainText>
          Garden Girl is a 2-5 player multiplayer "Bomberman Clone" written as a
          replacement project for the cancelled PTBO Game Jam 05. Completed in 7
          days from Saturday March 14th to Saturday March 21st.{' '}
        </MainText>
        <SubText>To play the game:</SubText>
        <SubText>
          1. Open the "Display Screen" on your computer. The display screen is
          only for watching the game, not playing.{' '}
        </SubText>
        <SubText>
          2. Open the "Controller" on your phone (or another tab, but it's
          better on mobile)
        </SubText>
        <SubText style={{ marginBottom: '50px'}}>
          3. Press the "A" button on your controller screen to mark yourself
          ready.  You need at least 2 players to start a game.
        </SubText>
      </TextWrapper>

      <Button
        onClick={() => {
          window.open('/screen', '_blank');
        }}
      >
        Open Display Screen
      </Button>
      <Button
        onClick={() => {
          window.open('/controller', '_blank');
        }}
      >
        Open Controller
      </Button>

      <TextWrapper>
        <SubText>
          Developed by Alex & Jodie, with sprites and art assets provided by
          James & Ishi.
        </SubText>
      </TextWrapper>

      <h4>
        Repository available{' '}
        <a
          style={{ color: 'unset' }}
          href="https://bitbucket.org/nightcyclemedia/ptbo-game-jam-2020/"
          title="Project Repository"
        >
          here
        </a>
        .
      </h4>

      <LogoWrapper>
        <div>
          <a id="TypeScript" href="https://www.typescriptlang.org/">
            <img
              src="https://cdn.svgporn.com/logos/typescript-icon.svg"
              alt="TypeScript"
              title="TypeScript"
            />
          </a>
          <label htmlFor="TypeScript">TypeScript</label>
        </div>

        <div>
          <a id="react" href="https://reactjs.org/">
            <img
              src="https://cdn.svgporn.com/logos/react.svg"
              alt="React"
              title="React"
            />
          </a>
          <label htmlFor="react">React</label>
        </div>

        <div>
          <a id="nextjs" href="https://nextjs.org/">
            <img
              src="https://cdn.svgporn.com/logos/nextjs.svg"
              alt="Next.js"
              title="Next.js"
            />
          </a>
          <label htmlFor="nextjs">Next.js</label>
        </div>

        <div>
          <a id="socketio" href="https://socket.io/">
            <img
              src="https://cdn.svgporn.com/logos/socket.io.svg"
              alt="Socket.io"
              title="Socket.io"
            />
          </a>
          <label htmlFor="socketio">Socket.io</label>
        </div>

        <div>
          <a id="pixijs" href="https://www.pixijs.com/">
            <img
              src="https://images.opencollective.com/pixijs/f97b489/logo/256.png"
              alt="PixiJS"
              title="PixiJS"
            />
          </a>
          <label htmlFor="pixijs">PixiJS</label>
        </div>
      </LogoWrapper>
    </ReadyRoomWrapper>
  );
};
