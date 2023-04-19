import { CategoryStack } from "./CategoryStack";
import CategoryEnum from "./constant/CategoryEnum";
import RegionEnum from "./constant/RegionEnum";

class GamePostDTO {
  lobbyCreatorUserId: string | null;
  roundDuration: number | null;
  numberOfRounds: number | null;
  categoryStack: CategoryStack | null;
  selectedRegions: RegionEnum[] | null;
  openLobby: boolean | null;

  constructor(
    lobbyCreatorUserId: string | null,
    roundDuration: number | null,
    numberOfRounds: number | null,
    categoryStack: CategoryStack | null,
    selectedRegions: RegionEnum[],
    openLobby: boolean | null
  ) {
    this.lobbyCreatorUserId = lobbyCreatorUserId;
    this.roundDuration = roundDuration;
    this.numberOfRounds = numberOfRounds;
    this.categoryStack = categoryStack;
    this.selectedRegions = selectedRegions;
    this.openLobby = openLobby;
  }
}

export default GamePostDTO;
