import WebSocket, { Server } from 'ws';
import { IMessage } from '../types/types';
import { colorConsole } from '../utils/colorConsole';
import { handleMessage } from '../api/handleMessages';
import { userData } from '../dataBase/userDB';
import { roomData } from '../dataBase/roomDB';
import { updateRooms } from '../api/userMessages/updateRoom';
import { gameData } from '../dataBase/gameDB';
import { finishGame } from '../api/gameMessages/finishGame';
import { updateWinners } from '../api/userMessages/updateWinners';

export const startWebSocket = () => {
  const PORT = 3000;
  const wss = new Server({ port: PORT }, () => {
    colorConsole.green('WebSocket server started on ws://127.0.0.1:3000');
  });
  const clientMap = new Map<WebSocket, number>();
  wss.on('connection', (socket: WebSocket) => {
    colorConsole.blue(`New client connected`);

    socket.on('message', (messageData: WebSocket.RawData) => {
      const message: IMessage = JSON.parse(messageData.toString());
      console.log('Parsed message from client:', message);

      const { type, data } = message;

      handleMessage(socket, type, data, clientMap);
    });

    socket.on('close', () => {
      const userIndex = clientMap.get(socket);
      if (userIndex !== undefined) {
        const game = gameData.getGameWithPlayer(userIndex);
        if (game) {
          const player1Index = game.player1.userId;
          const winner =
            player1Index === userIndex
              ? game.player2.playerId
              : game.player1.playerId;
          const winnerId =
            player1Index === userIndex
              ? game.player2.userId
              : game.player1.userId;

          clientMap.forEach((playerIndex, playerSocket) => {
            if (
              playerIndex === game.player1.userId ||
              playerIndex === game.player2.userId
            ) {
              finishGame(winner, playerSocket, game.gameId);
            }
          });
          userData.addNewWinner(winnerId);
          updateWinners(clientMap);
          gameData.deleteGame(game.gameId);
          roomData.deleteRoom(game.gameId);
        }
        userData.deleteUser(userIndex);
        roomData.deleteRoom(userIndex);
        updateRooms(clientMap);
        clientMap.delete(socket);
      }
      colorConsole.blue(`Client with index ${userIndex} disconnected`);
    });
  });
};
