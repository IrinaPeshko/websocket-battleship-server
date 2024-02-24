import { ownShip } from '../types/types';

export const attackResult = (ownBoard: ownShip[][], x: number, y: number) => {
  return ownBoard[y][x].type;
};
