import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { PlayerProperties } from 'server/utility/types';
import { FancyButton } from './ready-room';

/* -------------- MAIN --------------- */

const TitleCard = styled.div`
  display: flex;
  align-self: center;
  font-family: "Pacifico", cursive, Georgia, "Times New Roman", Times, serif;
  justify-content: center;
  background-color: #f6ca8a;
  /* margin-top: 20px; */
  padding: 5px, 15px;
  margin-top: 20px;
  border-color: #290d13;
  border-radius: 10px;
  border-width: 8px;
  border-style: ridge;
  color: #000000;
  width: 25%;
  min-width: 150px;
  font-size: 20px;
`;

const DirectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  font-family: "Montserrat", Georgia, "Times New Roman", Times, serif;
  justify-content: space-around;
  padding: 2em;
  width: 50%;
  box-sizing: border-box;
`;

const BanterWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  box-sizing: border-box;
`;

const ActionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  font-family: "Montserrat", Georgia, "Times New Roman", Times, serif;
  padding: 2em;
  justify-content: center;
  width: 50%;
  box-sizing: border-box;
`;
const Text = styled.div`
  display: flex;
  font-family: "Montserrat", Georgia, "Times New Roman", Times, serif;
  justify-content: center;
  color: black;
  font-size: 30px;
  width: 100%;
  /* padding-top: 20px; */
  box-sizing: border-box;

  button {
    font-size: 1rem;
  }

  input {
    font-size: 1rem;
  }

  @media only screen and (max-width: 600px) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

const ControllerWrapper = styled.div`
  display: flex;
  justify-content: center;
  font-family: "Montserrat", Georgia, "Times New Roman", Times, serif;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  height: 85vh;
  /* align-content: space-around; */
  align-items: space-around;
  background-color: #67722c;
  color: #f6ca8a;

  /* * {
    border: 1px solid red;
  } */

  /* -------------- ClassNames --------------- */

  .direction {
    background-color: #b7c859;
    border-color: #ffffff;
    border-radius: 50%;
    font-family: "Montserrat", Georgia, "Times New Roman", Times, serif;
    font-weight: bold;
    color: #290d13;
    height: 60px;
    width: 60px;
    box-shadow: 5px 5px #2b2f11;
  }

  .actionbutton {
    background-color: #8e4558;
    border-color: #edb4b3;
    border-radius: 50%;
    font-family: "Montserrat", Georgia, "Times New Roman", Times, serif;
    font-weight: bold;
    color: #290d13;
    height: 75px;
    width: 75px;
    box-shadow: 5px 5px #290d13;
  }

  .updown {
    align-self: auto;
  }

  .sides {
  }

  .actioncontainer {
  }
  /*
  .banter {
    height: 35px;

    background-color: #f6ca8a;

    color: #781514;
    border-style: ridge;
    border-width: 5px;
    border-radius: 10px;
    border-color: #f6ca8a;
  } */
`;
/* -------------- CONTAINERS --------------- */

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

/* -------------- BUTTON TYPES --------------- */

const Button = styled.button`
  /* :hover{
    opacity: 0.75;
  } */
`;

/* -------------- BODY --------------- */

const ControllerInterface = (props: {
  playerSocket: SocketIOClient.Socket;
  gameOver: string;
  player?: PlayerProperties;
}) => {
  const [banterText, setBanterText] = useState('');
  const [handle, setHandle] = useState('');
  return (
    <>
      <ControllerWrapper>
        <TitleCard>Garden Girl</TitleCard>
        {props.gameOver ? (
          <Text
            style={{ margin: '0 20px', color: 'white', textAlign: 'center' }}
          >
            {props.gameOver}
          </Text>
        ) : (
          <>
            <Text>
              <form>
                <span
                  style={{
                    fontSize: '16px',
                    color: 'white',
                    marginRight: '10px'
                  }}
                >
                  Handle:
                </span>

                <input
                  type="text"
                  style={{ maxWidth: '125px' }}
                  value={handle}
                  onChange={inputField => {
                    setHandle(inputField.target.value);
                    props.playerSocket.emit(
                      'set-handle',
                      inputField.target.value
                    );
                  }}
                />
              </form>
              <form>
                <input
                  style={{ marginLeft: '20px', minWidth: '225px' }}
                  type="text"
                  value={banterText}
                  onChange={inputField => {
                    setBanterText(inputField.target.value);
                  }}
                />
                <FancyButton
                  style={{ marginLeft: '10px' }}
                  type="submit"
                  onClick={e => {
                    e.preventDefault();
                    props.playerSocket.emit('banter', banterText);
                    setBanterText('');
                  }}
                >
                  Banter!
                </FancyButton>
              </form>
            </Text>

            <DirectionWrapper>
              <ButtonContainer className="updown">
                <Button
                  onClick={() => {
                    props.playerSocket.emit('move', 'up');
                  }}
                  className="direction"
                >
                  U
                </Button>
              </ButtonContainer>

              <ButtonContainer className="sides">
                <Button
                  onClick={() => {
                    props.playerSocket.emit('move', 'left');
                  }}
                  className="direction"
                >
                  L
                </Button>
                <Button
                  onClick={() => {
                    props.playerSocket.emit('move', 'right');
                  }}
                  className="direction"
                >
                  R
                </Button>
              </ButtonContainer>

              <ButtonContainer className="updown">
                <Button
                  onClick={() => {
                    props.playerSocket.emit('move', 'down');
                  }}
                  className="direction"
                >
                  D
                </Button>
              </ButtonContainer>
            </DirectionWrapper>

            <ActionWrapper>
              <ButtonContainer className="actioncontainer">
                <Button
                  onClick={() => {
                    props.playerSocket.emit('get-my-player');
                  }}
                  className="actionbutton"
                  style={
                    props.player?.ready
                      ? {
                          backgroundColor: '#491d26',
                          boxShadow: '5px 5px #290d13',
                          color: '#ffffff'
                        }
                      : {}
                  }
                >
                  B
                </Button>
                <Button
                  onClick={() => {
                    props.playerSocket.emit('drop-bomb');
                    props.playerSocket.emit('ready', true);
                    props.playerSocket.emit('get-my-player');
                  }}
                  className="actionbutton"
                  style={
                    props.player?.ready
                      ? {
                          backgroundColor: '#491d26',
                          boxShadow: '5px 5px #290d13',
                          color: '#ffffff'
                        }
                      : {}
                  }
                >
                  A
                </Button>
              </ButtonContainer>
            </ActionWrapper>
          </>
        )}
      </ControllerWrapper>
    </>
  );
};

// acomment/ part 2
export default ControllerInterface;
