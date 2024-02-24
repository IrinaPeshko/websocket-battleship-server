import { IShip, ownShip } from '../types/types';

export const fillOwnBoard = (ships: IShip[], board: ownShip[][]) => {
  for (const ship of ships) {
    const currentShip = createShipParts(ship);
    const { position, direction, length } = ship;
    const { x, y } = position;
    for (let i = 0; i < length; i++) {
      if (direction) {
        board[y + i][x] = {
          type: ship.type,
          isHit: false,
          currentShip,
        };
      } else {
        board[y][x + i] = {
          type: ship.type,
          isHit: false,
          currentShip,
        };
      }
    }
  }
};

const createShipParts = (ship: IShip) => {
  const { length, direction, position } = ship;
  const shipParts = [];
  for (let i = 0; i < length; i++) {
    if (direction) {
      const shipPart = {
        isShot: false,
        i,
        x: position.x,
        y: position.y + i,
      };
      shipParts.push(shipPart);
    } else {
      const shipPart = {
        isShot: false,
        i,
        x: position.x + i,
        y: position.y,
      };
      shipParts.push(shipPart);
    }
  }
  return {
    hits: 0,
    length,
    shipParts,
  };
};
