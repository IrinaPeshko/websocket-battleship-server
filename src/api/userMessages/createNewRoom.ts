import { colorConsole } from '../../utils/colorConsole';
import WebSocket from 'ws';
import { updateRooms } from './updateRoom';
import { userData } from '../../dataBase/userDB';
import { roomData } from '../../dataBase/roomDB';

export const createNewRoom = (
  socket: WebSocket,
  clientMap: Map<WebSocket, number>,
) => {
  const userId = clientMap.get(socket);
  if (userId) {
    const user = userData.getUserById(userId);
    if (user) {
      const isCreated = roomData.addNewRoom(user);
      if (isCreated) {
        updateRooms(clientMap);
        colorConsole.green(`The room with id "${userId}" has been created`);
      }
    } else {
      colorConsole.red(`The user with id "${userId}" is not found`);
    }
  } else {
    colorConsole.red(
      `Failed to identify user for the given WebSocket connection.`,
    );
  }
};
