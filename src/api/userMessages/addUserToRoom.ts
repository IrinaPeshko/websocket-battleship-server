import WebSocket from 'ws';
import { colorConsole } from '../../utils/colorConsole';
import { updateRooms } from './updateRoom';
import { userData } from '../../dataBase/userDB';
import { roomData } from '../../dataBase/roomDB';
import { createGame } from '../gameMessages/createGame';

export const addUserToRoom = (
  socket: WebSocket,
  data: string | object,
  clientMap: Map<WebSocket, number>,
) => {
  const userId = clientMap.get(socket);
  if (userId) {
    const user = userData.getUserById(userId);

    if (!user) {
      colorConsole.red(
        `Failed to identify user for the given WebSocket connection.`,
      );
      return;
    }
    const { indexRoom } = JSON.parse(data.toString());
    const addedRoomIndex = roomData.addToRoom(user, indexRoom, clientMap);
    if (addedRoomIndex) {
      createGame(addedRoomIndex, userId, clientMap);
      updateRooms(clientMap);
    }
  }
};
