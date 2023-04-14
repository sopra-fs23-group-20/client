import RegionEnum from "./constant/RegionEnum";

class Region {
  type: RegionEnum;

  constructor(type: RegionEnum) {
    this.type = type;
  }
}

export default Region;
