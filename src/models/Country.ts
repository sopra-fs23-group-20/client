interface CountryData {
    name: string | null;
    population: number | null;
    flag: string | null;
    longitude: number | null;
    latitude: number | null;
  }
  
  class Country {
    name: string | null;
    population: number | null;
    flag: string | null;
    longitude: number | null;
    latitude: number | null;
  
    constructor(data: CountryData = { name: null, population: null, flag: null, longitude: null, latitude: null }) {
      this.name = data.name ?? null;
        this.population = data.population ?? null;
        this.flag = data.flag ?? null;
        this.longitude = data.longitude ?? null;
        this.latitude = data.latitude ?? null;
    }
  }
  
  export default Country;
  