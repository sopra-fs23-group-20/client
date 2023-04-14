import { CategoryStack } from "./CategoryStack";
import GameState from "./constant/GameState";
import GameUser from "./GameUser";
import RegionSet from "./RegionSet";

class GameGetDTO {
  gameId: number | null;
  lobbyCreator: GameUser | null;
  participants: Set<GameUser> | null;
  creationDate: Date | null;
  currentState: GameState | null;
  roundDuration: number | null;
  remainingTime: number | null;
  numberOfRounds: number | null;
  remainingRounds: number | null;
  remainingRoundPoints: number | null;
  regionSet: RegionSet | null;
  categoryStack: CategoryStack | null;
  randomizedHints: boolean | null;
  openLobby: boolean | null;

  constructor(
    gameId: number | null,
    lobbyCreator: GameUser | null,
    participants: Set<GameUser> | null,
    creationDate: Date | null,
    currentState: GameState | null,
    roundDuration: number | null,
    remainingTime: number | null,
    numberOfRounds: number | null,
    remainingRounds: number | null,
    remainingRoundPoints: number | null,
    regionSet: RegionSet | null,
    categoryStack: CategoryStack | null,
    randomizedHints: boolean | null,
    openLobby: boolean | null
  ) {
    this.gameId = gameId;
    this.lobbyCreator = lobbyCreator;
    this.participants = participants;
    this.creationDate = creationDate;
    this.currentState = currentState;
    this.roundDuration = roundDuration;
    this.remainingTime = remainingTime;
    this.numberOfRounds = numberOfRounds;
    this.remainingRounds = remainingRounds;
    this.remainingRoundPoints = remainingRoundPoints;
    this.regionSet = regionSet;
    this.categoryStack = categoryStack;
    this.randomizedHints = randomizedHints;
    this.openLobby = openLobby;
  }
}

export default GameGetDTO;
