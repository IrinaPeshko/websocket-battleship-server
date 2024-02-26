import WebSocket from 'ws';
import { roomData } from '../../dataBase/roomDB';
import { colorConsole } from '../../utils/colorConsole';
import { gameData } from '../../dataBase/gameDB';
import { sendCreateGame } from '../../utils/sendResponses';

export const createGame = (
  roomId: number,
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
          sendCreateGame(roomId, 1, socket);
        } else {
          sendCreateGame(roomId, 2, socket);
        }
      }
    }
  });

  const rival = players.find((player) => player.index !== roomId);
  if (rival) {
    gameData.createGame(roomId, roomId, rival.index);
    colorConsole.green(`The game with id "${roomId}" has been created.`);
  } else {
    colorConsole.red(`The rival in the game with id "${roomId}" is not found`);
  }
};
