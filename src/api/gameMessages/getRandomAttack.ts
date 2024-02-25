import { gameData } from '../../dataBase/gameDB';
import { getAttack } from './getAttack';
import WebSocket from 'ws';

export const getRandomAttack = (
  data: string | object,
  clientMap: Map<WebSocket, number>,
) => {
  const { gameId, indexPlayer } = JSON.parse(data.toString());
  const emptyCells = gameData.getEmptyCells(gameId, indexPlayer);

  if (!emptyCells || emptyCells.length === 0) {
    console.log('No empty cells available for attack.');
    return;
  }

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const randomCell = emptyCells[randomIndex];
  const dataToAttack = JSON.stringify({
    gameId,
    x: randomCell.x,
    y: randomCell.y,
    indexPlayer,
  });

  console.log('Random cell chosen for attack:', {
    x: randomCell.x,
    y: randomCell.y,
  });
  getAttack(dataToAttack, clientMap);
};
