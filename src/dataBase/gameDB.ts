import { IGame, IShip, ownShip } from '../types/types';
import { colorConsole } from '../utils/colorConsole';
import { fillOwnBoard } from '../utils/fillOwnBoard';
import { attackResult } from '../utils/getAttackResult';
import { initializeOwnBoard } from '../utils/initialBoard';
import { openAdjacentCells } from '../utils/openEmptyCellsAroundShotShip';

class GameData {
  private gameDB: IGame[] = [];

  constructor() {
    this.gameDB = [];
  }

  private getGames = () => this.gameDB;

  public getGameById = (gameId: number) => {
    const games = this.getGames();
    return games.find((game) => game.gameId === gameId);
  };

  public getGameWithPlayer = (userId: number) => {
    const games = this.getGames();
    const game = games.find(
      (game) =>
        game.player1.userId === userId || game.player2.userId === userId,
    );
    return game;
  };

  public createGame = (gameId: number, user1Id: number, user2Id: number) => {
    const games = this.getGames();
    const game: IGame = {
      gameId: gameId,
      current: 1,
      player1: {
        userId: user1Id,
        playerId: 1,
        killedShipsCount: 0,
        ownBoard: initializeOwnBoard(10),
      },
      player2: {
        userId: user2Id,
        playerId: 2,
        killedShipsCount: 0,
        ownBoard: initializeOwnBoard(10),
      },
    };
    games.push(game);
  };

  public deleteGame = (gameId: number) => {
    const games = this.getGames();
    const gameIndex = games.findIndex((game) => game.gameId === gameId);
    if (gameIndex !== -1) {
      games.splice(gameIndex, 1);
      colorConsole.yellow(`Game with id ${gameId} has been deleted.`);
    }
  };

  public addShips = (gameId: number, playerId: 1 | 2, ships: IShip[]) => {
    const games = this.getGames();
    const currentGameIndex = games.findIndex((game) => game.gameId === gameId);
    if (currentGameIndex === -1) {
      colorConsole.red(`The game with id ${gameId} is not found.`);
      return null;
    }
    const player = playerId === 1 ? 'player1' : 'player2';
    games[currentGameIndex][player].ships = ships;
    fillOwnBoard(ships, games[currentGameIndex][player].ownBoard);
    colorConsole.green(
      `The player with index "${playerId} in the game "${gameId}" added ships`,
    );
    return games[currentGameIndex];
  };

  public getAttackResult = (
    gameId: number,
    indexPlayer: number,
    x: number,
    y: number,
  ) => {
    const games = this.getGames();
    const gameIndex = games.findIndex((game) => game.gameId === gameId);
    if (gameIndex === -1) {
      colorConsole.red(`The game with id "${gameId}" is not found`);
      return null;
    }
    const player = indexPlayer === 1 ? 'player2' : 'player1';
    const result = attackResult(games[gameIndex][player].ownBoard, x, y);
    if (!result) {
      colorConsole.yellow(
        `Player ${indexPlayer} in game ${gameId} has already attacked cell (${x}, ${y}). No action taken.`,
      );
      return null;
    }
    games[gameIndex][player].ownBoard[y][x].isHit = true;
    const currentShip = games[gameIndex][player].ownBoard[y][x].currentShip;
    if (currentShip) {
      const currentPart = currentShip.shipParts.find((shipPart) => {
        return shipPart.x === x && shipPart.y === y;
      });
      if (currentPart) {
        currentPart.isShot = true;
      }
    }
    return result;
  };

  public checkTurn = (gameId: number, playerId: number) => {
    const game = this.getGameById(gameId);
    if (!game) {
      colorConsole.red(`Game with ID ${gameId} not found.`);
      return false;
    }

    const currentPlayer = game.current;
    if (currentPlayer !== playerId) {
      colorConsole.yellow(
        `It's not player ${playerId}'s turn in game ${gameId}. Please wait for your turn.`,
      );
      return false;
    }
    return true;
  };

  public changeTurn = (gameId: number, nextPlayer: 1 | 2) => {
    const game = this.getGameById(gameId);
    if (!game) {
      colorConsole.red(`Game with ID ${gameId} not found.`);
      return false;
    }
    game.current = nextPlayer;
  };

  public checkKilledShip = (
    gameId: number,
    indexPlayer: number,
    x: number,
    y: number,
  ) => {
    const game = this.getGameById(gameId);
    const player = indexPlayer === 1 ? 'player2' : 'player1';
    if (!game) {
      colorConsole.red(`The game with id "${gameId}" is not found`);
      return null;
    }
    const currentCell = game[player].ownBoard[y][x];
    if (currentCell.currentShip) {
      currentCell.currentShip.hits += 1;

      console.log(`Hits on ship: ${currentCell.currentShip.hits}`);

      if (currentCell.currentShip.hits === currentCell.currentShip.length) {
        colorConsole.magenta(
          `Ship with length ${currentCell.currentShip.length} has been sunk!`,
        );
        const player = indexPlayer === 1 ? 'player1' : 'player2';
        game[player].killedShipsCount += 1;
        return currentCell.currentShip.shipParts;
      } else {
        colorConsole.magenta(
          `Hit at (${x}, ${y})! Ship damaged but still afloat.`,
        );
      }
    } else {
      console.log('No ship at this cell or cell already hit');
      return null;
    }
  };

  public checkFinishGame = (
    gameId: number,
    indexPlayer: number,
    shipCount: number = 10,
  ) => {
    const game = this.getGameById(gameId);
    if (!game) {
      colorConsole.red(`The game with id "${gameId}" is not found`);
      return false;
    }
    const player = indexPlayer === 1 ? 'player1' : 'player2';
    const killedShip = game[player].killedShipsCount;
    if (killedShip === shipCount) {
      return true;
    } else {
      return false;
    }
  };

  public openEmptyCellsAroundSunkShip = (
    gameId: number,
    indexPlayer: number,
    sunkShipParts: { x: number; y: number }[],
  ) => {
    const game = this.getGameById(gameId);
    if (!game) {
      colorConsole.red(`The game with id "${gameId}" is not found`);
      return;
    }

    const player = indexPlayer === 1 ? 'player2' : 'player1';
    const board = game[player].ownBoard;
    const result: { x: number; y: number }[] = [];
    sunkShipParts.forEach((part) => {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const x = part.x + i;
          const y = part.y + j;

          if (x >= 0 && x < board.length && y >= 0 && y < board[0].length) {
            const cell = board[y][x];
            if (cell.type === 'empty' && !cell.isHit) {
              cell.isHit = true;
              result.push({ x, y });
            }
          }
        }
      }
    });
    return result;
  };

  public openEmptyCellsAroundShotShip = (
    gameId: number,
    indexPlayer: number,
    x: number,
    y: number,
  ) => {
    const game = this.getGameById(gameId);
    if (!game) {
      colorConsole.red(`The game with id "${gameId}" is not found`);
      return;
    }
    const player = indexPlayer === 1 ? 'player2' : 'player1';
    const ship = game[player].ownBoard[y][x].currentShip;
    const partToOpen: {
      isShot: boolean;
      i: number;
      x: number;
      y: number;
    }[] = [];

    if (!ship) {
      return;
    }

    const isHorizontal = ship.direction;
    const currentPart = ship.shipParts.find(
      (part) => part.x === x && part.y === y,
    );
    if (!currentPart) {
      return;
    }
    const currentPartIndex = currentPart.i;
    const emptyCells: { x: number; y: number }[] = [];
    partToOpen.push(currentPart);
    const prevPart = ship.shipParts.find(
      (part) => part.i === currentPartIndex - 1,
    );
    const nextPart = ship.shipParts.find(
      (part) => part.i === currentPartIndex + 1,
    );
    if (prevPart?.isShot) {
      partToOpen.push(prevPart);
    }
    if (nextPart?.isShot) {
      partToOpen.push(nextPart);
    }

    partToOpen.forEach((part) => {
      const result = openAdjacentCells(
        game[player].ownBoard,
        part.x,
        part.y,
        partToOpen.length,
        isHorizontal,
      );
      emptyCells.push(...result);
    });
    return emptyCells;
  };

  public getEmptyCells = (gameId: number, indexPlayer: number) => {
    const game = this.getGameById(gameId);
    if (!game) {
      colorConsole.red(`The game with id "${gameId}" is not found`);
      return;
    }
    const player = indexPlayer === 1 ? 'player2' : 'player1';
    const emptyCells: ownShip[] = [];
    for (const row of game[player].ownBoard) {
      const result = row.filter((cell) => !cell.isHit);
      emptyCells.push(...result);
    }
    return emptyCells;
  };
}

export const gameData = new GameData();
