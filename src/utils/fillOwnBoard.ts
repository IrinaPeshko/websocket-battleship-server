import { IShip, shipType } from '../types/types';

export const fillOwnBoard = (ships: IShip[], board: shipType[][]) => {
  for (const ship of ships) {
    const { position, direction, length } = ship;
    const { x, y } = position;
    for (let i = 0; i < length; i++) {
      if (direction) {
        board[y + i][x] = ship.type;
      } else {
        board[y][x + i] = ship.type;
      }
    }
  }
};
