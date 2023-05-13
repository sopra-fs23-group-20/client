import GameState from "./constant/GameState";

interface UserData {
  userId: number | null;
  username: string | null;
  gamePoints: number | null;
  userPlayingAgain: boolean | null;
  hasLeft: boolean | null;
  numberOfGuessesLeft: number | null;
  guessedCorrectly: boolean | null;
}

interface GameUserIndexable {
  [key: string]: number | string | GameState | boolean | null;
}

class GameUser implements GameUserIndexable {
  userId: number | null;
  username: string | null;
  gamePoints: number | null;
  userPlayingAgain: boolean | null;
  hasLeft: boolean | null;
  numberOfGuessesLeft: number | null;
  guessedCorrectly: boolean | null;

  constructor(
    data: UserData = {
      userId: null,
      username: null,
      gamePoints: null,
      userPlayingAgain: null,
      hasLeft: null,
      numberOfGuessesLeft: null,
      guessedCorrectly: null,
    }
  ) {
    this.userId = data.userId ?? null;
    this.username = data.username ?? null;
    this.gamePoints = data.gamePoints ?? null;
    this.userPlayingAgain = data.userPlayingAgain ?? null;
    this.hasLeft = data.hasLeft ?? null;
    this.numberOfGuessesLeft = data.numberOfGuessesLeft ?? null;
    this.guessedCorrectly = data.guessedCorrectly ?? null;
  }
  [key: string]: string | number | boolean | null;
}

export default GameUser;
