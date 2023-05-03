import { CategoryStack } from "./CategoryStack";
import CategoryEnum from "./constant/CategoryEnum";
import { Difficulty } from "./constant/Difficulty";
import RegionEnum from "./constant/RegionEnum";

class GamePostDTO {
  lobbyCreatorUserId: string | null;
  roundDuration: number | null;
  numberOfRounds: number | null;
  categoryStack: CategoryStack | null;
  selectedRegions: RegionEnum[] | null;
  openLobby: boolean | null;
  difficulty: Difficulty | null;
  timeBetweenRounds: number | null;

  constructor(
    lobbyCreatorUserId: string | null,
    roundDuration: number | null,
    numberOfRounds: number | null,
    categoryStack: CategoryStack | null,
    selectedRegions: RegionEnum[],
    openLobby: boolean | null,
    difficulty: Difficulty | null,
    timeBetweenRounds: number | null
  ) {
    this.lobbyCreatorUserId = lobbyCreatorUserId;
    this.roundDuration = roundDuration;
    this.numberOfRounds = numberOfRounds;
    this.categoryStack = categoryStack;
    this.selectedRegions = selectedRegions;
    this.openLobby = openLobby;
    this.difficulty = difficulty;
    this.timeBetweenRounds = timeBetweenRounds;
  }
}

export default GamePostDTO;
