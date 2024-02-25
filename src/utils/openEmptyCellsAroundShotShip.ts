import { ownShip } from '../types/types';

export const openAdjacentCells = (
  board: ownShip[][],
  x: number,
  y: number,
  shotPartsCount: number,
  isHorizontal: boolean,
) => {
  const emptyCells: { x: number; y: number }[] = [];

  for (let i = -1; i <= 1; i += 2) {
    for (let j = -1; j <= 1; j += 2) {
      const emptyCell = openCellIfEmpty(board, x + i, y + j);
      if (emptyCell) {
        emptyCells.push(emptyCell);
      }
    }
  }
  if (shotPartsCount > 1) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (
          (isHorizontal && j === 0 && i !== 0) ||
          (!isHorizontal && i === 0 && j !== 0)
        ) {
          const emptyCell = openCellIfEmpty(board, x + i, y + j);
          if (emptyCell) {
            emptyCells.push(emptyCell);
          }
        }
      }
    }
  }
  return emptyCells;
};

const openCellIfEmpty = (board: ownShip[][], x: number, y: number) => {
  if (x >= 0 && x < board.length && y >= 0 && y < board[0].length) {
    const cell = board[y][x];
    if (cell.type === 'empty' && !cell.isHit) {
      cell.isHit = true;
      return { x, y };
    }
  }
};
