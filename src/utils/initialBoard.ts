import { ownShip } from '../types/types';

export const initializeOwnBoard = (size: number): ownShip[][] => {
  return Array.from({ length: size }, (_, y) =>
    Array.from({ length: size }, (_, x) => ({
      type: 'empty',
      isHit: false,
      x,
      y,
    })),
  );
};
