import WebSocket from 'ws';
import { gameData } from '../../dataBase/gameDB';
import { IShip } from '../../types/types';

export const addShips = (
  data: string | object,
  clientMap: Map<WebSocket, number>,
) => {
  const { gameId, ships, indexPlayer } = JSON.parse(data.toString());
  const game = gameData.addShips(gameId, indexPlayer, ships);
  if (game?.player1.ships && game.player2.ships) {
    clientMap.forEach((playerIndex, playerSocket) => {
      if (playerIndex === game.player1.userId && game.player1.ships) {
        sendShips(1, game.player1.ships, playerSocket);
        sendTurn(playerSocket);
      } else if (playerIndex === game.player2.userId && game.player2.ships) {
        sendShips(2, game.player2.ships, playerSocket);
        sendTurn(playerSocket);
      }
    });
  }
};

const sendShips = (playerId: number, ships: IShip[], socket: WebSocket) => {
  const data = {
    ships,
    currentPlayerIndex: playerId,
  };

  const response = {
    type: 'start_game',
    data: JSON.stringify(data),
    id: 0,
  };

  socket.send(JSON.stringify(response));
};

const sendTurn = (socket: WebSocket) => {
  const response = {
    type: 'turn',
    data: JSON.stringify({ currentPlayer: 1 }),
    id: 0,
  };
  socket.send(JSON.stringify(response));
};
