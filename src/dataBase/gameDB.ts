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

  public createGame = (gameId: number, user1Id: number, user2Id: number) => {
    const games = this.getGames();
    const game: IGame = {
      gameId: gameId,
      current: 1,
      player1: {
        userId: user1Id,
        playerId: 1,
        enemyBoard: initializeBoard(10),
        ownBoard: initializeOwnBoard(10),
      },
      player2: {
        userId: user2Id,
        playerId: 2,
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
      colorConsole.yellow(`Game with ID ${gameId} has been deleted.`);
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
    return attackResult(games[gameIndex][player].ownBoard, x, y);
  };
}

export const gameData = new GameData();
