import CategoryEnum from "./constant/CategoryEnum"
import Location from "./Location";

class Category{
    type: CategoryEnum;
    capital: string | null;
    flag: string | null;
    location: Location| null;
    population: number | null;
    outline: string | null;

    constructor(type: CategoryEnum, capital: string | null = null, flag: string | null = null, location: Location | null = null, population: number | null = null, outline: string | null = null){
        this.type = type;
        this.capital = capital;
        this.flag = flag;
        this.location = location;
        this.population = population;
        this.outline = outline;
    }
}

export default Category;