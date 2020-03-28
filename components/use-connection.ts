import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

export const useConnection = (roleAssign: string) => {
  const [connection, setConnection] = useState<SocketIOClient.Socket>();
  const [loading, setLoading] = useState(true);
  const [rejected, setRejected] = useState(false);
  const [gameIsRunning, setGameIsRunning] = useState(false);

  useEffect(() => {
    // const conn = io('http://192.168.1.15:4001/');
    // const conn = io('http://localhost:4001/');
    const conn = io('https://nightcyclemedia.com/');
    setConnection(conn);
    setLoading(false);

    conn.on('rejected', () => {
      setRejected(true);
    });

    conn.on('game-running', (running: boolean) => {
      setGameIsRunning(running);
    });

    conn.emit('request-game-running', { role: roleAssign });

    return () => {
      conn.close();
    };
  }, []);

  useEffect(() => {
    if (connection !== undefined) {
      connection.emit('start-game', { role: roleAssign });
    }
  }, [connection]);

  return { io: connection!, loading, rejected, gameIsRunning };
};
