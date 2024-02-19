import WebSocket from 'ws';
import { addToRoom, getPlayers, getUserById } from '../dataBase';
import { colorConsole } from '../../utils/colorConsole';
import { updateRooms } from './updateRoom';

export const addUserToRoom = (
  socket: WebSocket,
  data: string | object,
  clientMap: Map<WebSocket, number>,
) => {
  const userId = clientMap.get(socket);
  if (userId) {
    const user = getUserById(userId);
    if (!user) {
      colorConsole.red(
        `Failed to identify user for the given WebSocket connection.`,
      );
      return;
    }
    const { indexRoom } = JSON.parse(data.toString());
    const isAdded = addToRoom(user, indexRoom);
    if (isAdded) {
      updateRooms(clientMap);
    }
    createGame(indexRoom, userId, clientMap);
  }
};

const createGame = (
  roomId: number,
  userID: number,
  clientMap: Map<WebSocket, number>,
) => {
  const data = JSON.stringify({
    idGame: roomId,
    idPlayer: userID,
  });
  const response = {
    type: 'create_game',
    data,
    id: 0,
  };

  const players = getPlayers(roomId);
  if (!players) {
    colorConsole.red(`Room with ID "${roomId}" is empty`);
    return;
  }

  players.forEach((player) => {
    for (const [socket, userId] of clientMap.entries()) {
      if (userId === player.index) {
        socket.send(JSON.stringify(response));
      }
    }
  });
  colorConsole.green(
    `The players with id "${players[0].index}" and "${players[1].index}" have started the game with id "${roomId}"`,
  );
};
