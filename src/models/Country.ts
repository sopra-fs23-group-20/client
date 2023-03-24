import Location from "./Location";
  
  class Country {
    name: String | null;
    population: Number | null;
    capital: String | null;
    flag: String | null;
    location: Location | null;
    outline: String | null;
  
    constructor(name: string | null, population: Number | null, capital: String|null, flag: String | null, location: Location | null , outline: String | null) {
      this.name = name;
      this.population = population;
      this.capital = capital;
      this.flag = flag;
      this.location =  location
      this.outline = outline;
    }
  }
  
  export default Country;
  