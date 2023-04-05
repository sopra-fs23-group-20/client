import { CategoryStack } from "./CategoryStack";
import GameState from "./GameState";
import GameUser from "./GameUser";
import RegionTypes from "./RegionTypes";

class Game {
  gameId: number | null;
  lobbyCreator: GameUser | null;
  participants: Set<GameUser> | null;
  creationDate: Date | null;
  currentState: GameState | null;
  gameEndingCriteria: number | null;
  roundDuration: number | null;
  region: [RegionTypes] | null;
  currentRound: number | null;
  categoryStack: CategoryStack | null;
  remainingTime: number | null;
  numberOfRounds: number | null;
  openLobby: boolean | null;

  constructor(
    gameId: null,
    lobbyCreator: null,
    participants: null,
    creationDate: null,
    currentState: null,
    gameEndingCriteria: null,
    roundDuration: null,
    region: null,
    currentRound: null,
    categoryStack: null,
    remainingTime: null,
    numberOfRounds: null,
    openLobby: null
  ) {
    this.gameId = gameId;
    this.lobbyCreator = lobbyCreator;
    this.participants = participants;
    this.creationDate = creationDate;
    this.currentState = currentState;
    this.gameEndingCriteria = gameEndingCriteria;
    this.roundDuration = roundDuration;
    this.region = region;
    this.currentRound = currentRound;
    this.categoryStack = categoryStack;
    this.remainingTime = remainingTime;
    this.numberOfRounds = numberOfRounds;
    this.openLobby = openLobby;
  }
}
export default Game;
