import CategoryTypes from "./CategoryTypes"

class Category{
    type: CategoryTypes;
    capital: String | null;
    flag: String | null;
    location: Array<Number> | null;
    population: Number | null;
    outline: String | null;

    constructor(type: CategoryTypes, capital: String | null = null, flag: String | null = null, location: Array<Number> | null = null, population: Number | null = null, outline: String | null = null){
        this.type = type;
        this.capital = capital;
        this.flag = flag;
        this.location = location;
        this.population = population;
        this.outline = outline;
    }
}

export default Category;