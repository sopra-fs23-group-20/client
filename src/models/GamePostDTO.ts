import CategoryEnum from './constant/CategoryEnum';
import RegionEnum from './constant/RegionEnum';

class GamePostDTO{
    lobbyCreatorUserId: string|null;
    roundDuration: number | null;
    numberOfRounds: number  | null;
    categoriesSelected: CategoryEnum[] | null;
    regionsSelected: RegionEnum[] | null;
    randomizedCategories: boolean | null;
    openLobby: boolean | null;

    constructor(lobbyCreatorUserId: string|null, roundDuration: number | null, numberOfRounds: number  | null, categoriesSelected: CategoryEnum[] | null, regionsSelected: RegionEnum[] | null, randomizedCategories: boolean | null, openLobby: boolean | null){
        this.lobbyCreatorUserId = lobbyCreatorUserId;
        this.roundDuration = roundDuration;
        this.numberOfRounds = numberOfRounds;
        this.categoriesSelected = categoriesSelected;
        this.regionsSelected = regionsSelected;
        this.randomizedCategories = randomizedCategories;
        this.openLobby = openLobby;
    }
}

export default GamePostDTO;