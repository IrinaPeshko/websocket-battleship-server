import { shipType } from '../types/types';

export const attackResult = (ownBoard: shipType[][], x: number, y: number) => {
  return ownBoard[y][x];
};
