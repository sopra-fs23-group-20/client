import RegionEnum from "./constant/RegionEnum";

class RegionSet {
  private regions: Set<RegionEnum>;

  constructor(regions: RegionEnum[] = []) {
    this.regions = new Set(regions);
  }

  addRegion(region: RegionEnum): void {
    this.regions.add(region);
  }

  removeRegion(region: RegionEnum): void {
    this.regions.delete(region);
  }

  getRegions(): RegionEnum[] {
    return Array.from(this.regions);
  }

  isEmpty(): boolean {
    return this.regions.size === 0;
  }
}

export default RegionSet;
