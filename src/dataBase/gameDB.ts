import { IGame } from '../types/types';
import { colorConsole } from '../utils/colorConsole';

class GameData {
  private gameDB: IGame[] = [];

  constructor() {
    this.gameDB = [];
  }

  private getGames = () => this.gameDB;

  public createGame = (gameId: number, user1ID: number, user2ID: number) => {
    const games = this.getGames();
    const game: IGame = {
      gameID: gameId,
      player1: {
        userId: user1ID,
        playerId: 1,
      },
      player2: {
        userId: user2ID,
        playerId: 2,
      },
    };
    games.push(game);
  };

  public deleteGame = (gameId: number) => {
    const games = this.getGames();
    const gameIndex = games.findIndex((game) => game.gameID === gameId);
    if (gameIndex !== -1) {
      games.splice(gameIndex, 1);
      colorConsole.yellow(`Game with ID ${gameId} has been deleted`);
    }
  };
}

export const gameData = new GameData();
