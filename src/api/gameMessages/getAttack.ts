import { gameData } from '../../dataBase/gameDB';
import WebSocket from 'ws';

export const getAttack = (
  data: string | object,
  clientMap: Map<WebSocket, number>,
) => {
  const { gameId, x, y, indexPlayer } = JSON.parse(data.toString());
  const resultAttack = gameData.getAttackResult(gameId, indexPlayer, x, y);
  const requestStatus = resultAttack === 'empty' ? 'miss' : 'shot';
  const game = gameData.getGameById(gameId);
  if (resultAttack && game) {
    const response = {
      type: 'attack',
      data: JSON.stringify({
        position: {
          x: x,
          y: y,
        },
        currentPlayer: indexPlayer,
        status: requestStatus,
      }),
      id: 0,
    };

    clientMap.forEach((playerIndex, playerSocket) => {
      if (
        playerIndex === game.player1.userId ||
        playerIndex === game.player2.userId
      ) {
        playerSocket.send(JSON.stringify(response));
      }
    });
  }
};
