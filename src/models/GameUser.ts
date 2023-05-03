import GameState from "./constant/GameState";

interface UserData {
  userId: number | null;
  username: string | null;
  gamePoints: number | null;
  currentState: GameState | null;
  hasAlreadyGuessed: boolean | null;
  userPlayingAgain: boolean | null;
}

interface GameUserIndexable {
  [key: string]: number | string | GameState | boolean | null;
}

class GameUser implements GameUserIndexable {
  userId: number | null;
  username: string | null;
  gamePoints: number | null;
  currentState: GameState | null;
  hasAlreadyGuessed: boolean | null;
  userPlayingAgain: boolean | null;

  constructor(
    data: UserData = {
      userId: null,
      username: null,
      gamePoints: null,
      currentState: null,
      hasAlreadyGuessed: null,
      userPlayingAgain: null,
    }
  ) {
    this.userId = data.userId ?? null;
    this.username = data.username ?? null;
    this.gamePoints = data.gamePoints ?? null;
    this.currentState = data.currentState ?? null;
    this.hasAlreadyGuessed = data.hasAlreadyGuessed ?? null;
    this.userPlayingAgain = data.userPlayingAgain ?? null;
  }
  [key: string]: string | number | boolean | null;
}

export default GameUser;
