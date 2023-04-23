import { CategoryStack } from "./CategoryStack";
import { Difficulty } from "./constant/Difficulty";
import GameState from "./constant/GameState";
import RegionEnum from "./constant/RegionEnum";
import GameUser from "./GameUser";

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
  selectedRegions: RegionEnum[] | null;
  categoryStack: CategoryStack | null;
  openLobby: boolean | null;
  difficulty: Difficulty | null;

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
    selectedRegions: RegionEnum[] | null,
    categoryStack: CategoryStack | null,
    openLobby: boolean | null,
    difficulty: Difficulty | null
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
    this.selectedRegions = selectedRegions;
    this.categoryStack = categoryStack;
    this.openLobby = openLobby;
    this.difficulty = difficulty;
  }
}

export default GameGetDTO;
