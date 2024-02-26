import { gameData } from '../../dataBase/gameDB';
import WebSocket from 'ws';
import { colorConsole } from '../../utils/colorConsole';
import { finishGame } from './finishGame';
import { roomData } from '../../dataBase/roomDB';
import { updateRooms } from '../userMessages/updateRoom';
import { getRandomElement } from '../../utils/getRandomElement';

export const botAttack = (
  gameId: number,
  clientMap: Map<WebSocket, number>,
) => {
  const emptyCells = gameData.getEmptyCells(gameId, 2);
  const indexPlayer = 2;

  if (!emptyCells || emptyCells.length === 0) {
    console.log('No empty cells available for attack.');
    return;
  }

  const randomCell = getRandomElement(emptyCells);
  const { x, y } = randomCell;

  const resultAttack = gameData.getAttackResult(gameId, indexPlayer, x, y);
  const game = gameData.getGameById(gameId);
  let isWin = false;
  if (resultAttack && game) {
    let requestStatus: 'miss' | 'shot' | 'killed' =
      resultAttack === 'empty' ? 'miss' : 'shot';
    const responses: {
      type: string;
      data: string;
      id: number;
    }[] = [];

    if (requestStatus === 'shot') {
      const killedShip = gameData.checkKilledShip(gameId, indexPlayer, x, y);
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
        const hitCells = gameData.openEmptyCellsAroundSunkShip(
          gameId,
          indexPlayer,
          killedShip,
        );
        if (hitCells) {
          for (const cell of hitCells) {
            const response = createResponse(
              indexPlayer,
              'miss',
              cell.x,
              cell.y,
            );
            responses.push(response);
          }
        }
        isWin = gameData.checkFinishGame(gameId, indexPlayer);
      } else {
        const response = createResponse(indexPlayer, requestStatus, x, y);
        responses.push(response);
        const emptyCells = gameData.openEmptyCellsAroundShotShip(
          gameId,
          indexPlayer,
          x,
          y,
        );
        emptyCells?.forEach((cell) => {
          const newResponse = createResponse(
            indexPlayer,
            'miss',
            cell.x,
            cell.y,
          );
          responses.push(newResponse);
        });
      }
    } else {
      colorConsole.magenta(
        `Player ${indexPlayer} fired at (${x}, ${y}) and missed.`,
      );
      const response = createResponse(indexPlayer, requestStatus, x, y);
      responses.push(response);
    }

    if (isWin) {
      clientMap.forEach((userIndex, playerSocket) => {
        if (userIndex === game.player1.userId) {
          finishGame(indexPlayer, playerSocket, gameId);
        }
      });
      gameData.deleteGame(game.gameId);
      roomData.deleteRoom(game.gameId);
      updateRooms(clientMap);
    }
    return responses;
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
