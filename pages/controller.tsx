import React, { useRef, useEffect, useState } from 'react';
import ControllerInterface from '../components/controller-interface';
import { useConnection } from '../components/use-connection';
import { Loading } from '../components/loading';
import { PlayerProperties } from '../server/utility/types';
import { MainStyle } from '../components/main-style';
import { PageHead } from '../components/page-head';

const Controller = () => {
  const { io, loading, rejected } = useConnection('controller');

  const [myPlayer, setMyPlayer] = useState<PlayerProperties>();

  const [gameOver, setGameOver] = useState('');

  useEffect(() => {
    if (!loading) {
      io.on('here-is-your-player', (player: PlayerProperties) => {
        setMyPlayer(player);
      });

      io.on('game-over', (winner: string) => {
        setGameOver(winner);
      });

      io.emit('get-my-player');
    }
  }, [loading]);

  if (loading) {
    return <Loading />;
  }

  if (rejected) {
    return <h1>Too many players. Please try again later.</h1>;
  }

  return (
    <>
      <PageHead />
      <MainStyle />
      <ControllerInterface
        playerSocket={io}
        player={myPlayer}
        gameOver={gameOver}
      />
    </>
  );
};

export default Controller;
