import { colorConsole } from '../../utils/colorConsole';
import { addNewRoom, getUserById } from '../dataBase';
import WebSocket from 'ws';
import { updateRooms } from './updateRoom';

export const createNewRoom = (
  socket: WebSocket,
  clientMap: Map<WebSocket, number>,
) => {
  const userId = clientMap.get(socket);
  if (userId) {
    const user = getUserById(userId);
    if (user) {
      addNewRoom(user);
      updateRooms(socket);
      colorConsole.green(`The room with id "${userId}" has been created`);
    } else {
      colorConsole.red(`The user with id "${userId}" is not found`);
    }
  } else {
    colorConsole.red(
      `Failed to identify user for the given WebSocket connection.`,
    );
  }
};
