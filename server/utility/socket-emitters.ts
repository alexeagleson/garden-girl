import socketIo from 'socket.io';
import { ExtendedSocket } from './types';
import { isNotDisplay } from './helpers';

export const emitAllPlayerData = (
  ioServer: socketIo.Server,
  listOfConnections: ExtendedSocket[]
) => {
  ioServer.emit(
    'updated-players',
    listOfConnections.filter(isNotDisplay).map(element => {
      return element.properties;
    })
  );
};

