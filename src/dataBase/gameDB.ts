import { IGame, IShip } from '../types/types';
import { colorConsole } from '../utils/colorConsole';
import { fillOwnBoard } from '../utils/fillOwnBoard';
import { attackResult } from '../utils/getAttackResult';
import { initializeBoard, initializeOwnBoard } from '../utils/initialBoard';

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
        enemyBoard: initializeBoard(10),
        ownBoard: initializeOwnBoard(10),
      },
      player2: {
        userId: user2Id,
        playerId: 2,
        killedShipsCount: 0,
        enemyBoard: initializeBoard(10),
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
        console.log(game[player]);
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
}

export const gameData = new GameData();
