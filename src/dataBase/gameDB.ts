import { IGame, IShip } from '../types/types';
import { colorConsole } from '../utils/colorConsole';

class GameData {
  private gameDB: IGame[] = [];

  constructor() {
    this.gameDB = [];
  }

  private getGames = () => this.gameDB;

  public createGame = (gameId: number, user1Id: number, user2Id: number) => {
    const games = this.getGames();
    const game: IGame = {
      gameId: gameId,
      player1: {
        userId: user1Id,
        playerId: 1,
      },
      player2: {
        userId: user2Id,
        playerId: 2,
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
    if (playerId === 1) {
      games[currentGameIndex].player1.ships = ships;
    } else {
      games[currentGameIndex].player2.ships = ships;
    }
    return games[currentGameIndex];
  };
}

export const gameData = new GameData();
