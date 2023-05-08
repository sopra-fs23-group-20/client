import { Difficulty } from "./constant/Difficulty";
import { CategoryStack } from "./CategoryStack";
import RegionEnum from "./constant/RegionEnum";
import { GameMode } from "./constant/GameMode";

class GamePutDTO {
  userId: number | null;
  lobbyCreatorUserId: string | null;
  roundDuration: number | null;
  numberOfRounds: number | null;
  categoryStack: CategoryStack | null;
  selectedRegions: RegionEnum[] | null;
  openLobby: boolean | null;
  difficulty: Difficulty | null;
  gameMode: GameMode | null;

  constructor(
    userId: number | null,
    lobbyCreatorUserId: string | null,
    roundDuration: number | null,
    numberOfRounds: number | null,
    categoryStack: CategoryStack | null,
    selectedRegions: RegionEnum[] | null,
    openLobby: boolean | null,
    difficulty: Difficulty | null,
    gameMode: GameMode | null
  ) {
    this.userId = userId;
    this.lobbyCreatorUserId = lobbyCreatorUserId;
    this.roundDuration = roundDuration;
    this.numberOfRounds = numberOfRounds;
    this.categoryStack = categoryStack;
    this.selectedRegions = selectedRegions;
    this.openLobby = openLobby;
    this.difficulty = difficulty;
    this.gameMode = gameMode;
  }
}

export default GamePutDTO;
