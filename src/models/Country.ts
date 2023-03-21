
  
  class Country {
    name: String | null;
    population: Number | null;
    flag: String | null;
    longitude: Number | null;
    latitude: Number | null;
    outline: String | null;
  
    constructor(name: string | null, population: Number | null, flag: String | null, longitude: Number | null, latitude: Number | null, outline: String | null) {
      this.name = name;
      this.population = population;
      this.flag = flag;
      this.longitude = longitude;
      this.latitude = latitude;
      this.outline = outline;
    }
  }
  
  export default Country;
  