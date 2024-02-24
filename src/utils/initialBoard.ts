import { ownShip } from '../types/types';

export const initializeBoard = (size: number): 'empty'[][] => {
  return Array.from({ length: size }, () => Array(size).fill('empty'));
};

export const initializeOwnBoard = (size: number): ownShip[][] => {
  return Array.from({ length: size }, () =>
    Array(size).fill({
      type: 'empty',
      isHit: false,
    }),
  );
};
