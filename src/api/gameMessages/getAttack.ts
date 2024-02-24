import { gameData } from '../../dataBase/gameDB';
import WebSocket from 'ws';
import { colorConsole } from '../../utils/colorConsole';

export const getAttack = (
  data: string | object,
  clientMap: Map<WebSocket, number>,
) => {
  const { gameId, x, y, indexPlayer } = JSON.parse(data.toString());
  const isPlayerTern = gameData.checkTurn(gameId, indexPlayer);
  if (isPlayerTern) {
    const resultAttack = gameData.getAttackResult(gameId, indexPlayer, x, y);
    const game = gameData.getGameById(gameId);
    if (resultAttack && game) {
      let requestStatus: 'miss' | 'shot' | 'killed' =
        resultAttack === 'empty' ? 'miss' : 'shot';
      const responses: {
        type: string;
        data: string;
        id: number;
      }[] = [];
      if (requestStatus === 'shot') {
        const killedShip = gameData.hitsCount(gameId, indexPlayer, x, y);
        if (killedShip) {
          requestStatus = 'killed';
          for (const partShip of killedShip) {
            const response = createResponse(
              indexPlayer,
              requestStatus,
              partShip.x,
              partShip.y,
            );
            responses.push(response);
          }
        } else {
          const response = createResponse(indexPlayer, requestStatus, x, y);
          responses.push(response);
        }
      } else {
        colorConsole.magenta(
          `Player ${indexPlayer} fired at (${x}, ${y}) and missed.`,
        );
        const response = createResponse(indexPlayer, requestStatus, x, y);
        responses.push(response);
      }

      clientMap.forEach((playerIndex, playerSocket) => {
        if (
          playerIndex === game.player1.userId ||
          playerIndex === game.player2.userId
        ) {
          responses.forEach((response) => {
            playerSocket.send(JSON.stringify(response));
          });
        }
      });
    }
  }
};

const createResponse = (
  indexPlayer: number,
  requestStatus: 'miss' | 'shot' | 'killed',
  x: number,
  y: number,
) => {
  return {
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
};
