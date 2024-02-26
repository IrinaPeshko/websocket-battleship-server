import { ownShip } from '../types/types';

export const attackResult = (ownBoard: ownShip[][], x: number, y: number) => {
  if (ownBoard[y][x].isHit) {
    return null;
  }
  return ownBoard[y][x].type;
};
