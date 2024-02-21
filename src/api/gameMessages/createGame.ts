import WebSocket from 'ws';
import { roomData } from '../../dataBase/roomDB';
import { colorConsole } from '../../utils/colorConsole';
import { gameData } from '../../dataBase/gameDB';

export const createGame = (
  roomId: number,
  userId: number,
  clientMap: Map<WebSocket, number>,
) => {
  const players = roomData.getPlayers(roomId);
  if (!players) {
    colorConsole.red(`Room with id "${roomId}" is empty`);
    return;
  }

  players.forEach((player) => {
    for (const [socket, userId] of clientMap.entries()) {
      if (userId === player.index) {
        if (userId === roomId) {
          const response = createResponse(roomId, 1);
          socket.send(JSON.stringify(response));
        } else {
          const response = createResponse(roomId, 2);
          socket.send(JSON.stringify(response));
        }
      }
    }
  });

  const rival = players.find((player) => player.index !== roomId);
  if (rival) {
    gameData.createGame(roomId, roomId, rival.index);
    colorConsole.green(`The game with id "${roomId}" has been created.`);
    colorConsole.green(
      `The players with id "${players[0].index}" and "${players[1].index}" have started the game with id "${roomId}".`,
    );
  } else {
    colorConsole.red(`The rival in the game with id "${roomId}" is not found`);
  }
};

const createResponse = (roomId: number, userId: number) => {
  const data = JSON.stringify({
    idGame: roomId,
    idPlayer: userId,
  });
  const response = {
    type: 'create_game',
    data,
    id: 0,
  };

  return response;
};
