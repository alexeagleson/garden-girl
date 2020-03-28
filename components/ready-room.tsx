import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { PlayerProperties } from 'server/utility/types';

export const ReadyRoomWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  font-family: 'Montserrat', Georgia, 'Times New Roman', Times, serif;
  background-color: #67722c;
  color: #eeeeee;
  height: 100vh;

  .playerlist {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  /* * {
    border: 1px solid red;
  } */
  p {
    display: flex;
    align-self: center;
    justify-content: center;
    background-color: #f6ca8a;
    border-color: #290d13;
    border-radius: 20px;
    border-width: 15px;
    border-style: ridge;
    color: #000000;
    padding: 30px;
    width: 50%;
    font-size: 50px;
    font-family: 'Pacifico', cursive, Georgia, 'Times New Roman', Times, serif;
  }

  h1,
  h2,
  h3 {
    display: flex;
    direction: row;
    justify-content: space-around;
  }
`;

const ButtonWrapper = styled.div`
  justify-content: center;
  display: flex;
`;

export const FancyButton = styled.button`
  background-color: #F6CA8A;
  padding: 5px;
  font-family: 'Pacifico', cursive, Georgia, 'Times New Roman', Times, serif;
  color: #781514;
  border-style: ridge;
  border-width: 5px;
  border-radius: 10px;
  border-color: #f6ca8a;
  /* margin-top: 50px; */

`;

export const ReadyRoom = (props: { listOfPlayers: PlayerProperties[] }) => {
  return (
    <>
      <ReadyRoomWrapper>
        <p>Garden Girl</p>
        <h2>Waiting for all players to be ready</h2>
        <h3>Current connected players: {props.listOfPlayers.length}</h3>
        <ul className="playerlist">
          {props.listOfPlayers.map((pl, index) => {
            return (
              <li key={index}>
                {pl.name}: {pl.handle && `(${pl.handle})`}{' '}
                {pl.ready ? 'Ready' : 'Not Ready'}
              </li>
            );
          })}
        </ul>
        <ButtonWrapper>
          <FancyButton style = {{ marginTop: '50px', fontSize: '1.5rem'}}>Press A to Start</FancyButton>
        </ButtonWrapper>
      </ReadyRoomWrapper>
    </>
  );
};
