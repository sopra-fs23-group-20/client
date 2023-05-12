import Category from "./Category";
import CategoryEnum from "./constant/CategoryEnum";

export class CategoryStack {
  currentCategory: Category | null;
  selectedCategories: CategoryEnum[] | null;
  remainingCategories: CategoryEnum[] | null;
  stackIdx: number | null;
  randomizedHints: boolean | null;
  closestCountries: string[] | null;

  constructor(
    currentCategory: Category | null,
    selectedCategories: CategoryEnum[] | null,
    remainingCategories: CategoryEnum[] | null,
    stackIdx: number | null,
    randomizedHints: boolean | null,
    closestCountries: string[] | null
  ) {
    this.currentCategory = currentCategory;
    this.remainingCategories = remainingCategories;
    this.selectedCategories = selectedCategories;
    this.stackIdx = stackIdx;
    this.randomizedHints = randomizedHints;
    this.closestCountries = closestCountries;
  }
}
