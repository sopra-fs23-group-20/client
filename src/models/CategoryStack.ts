import CategoryTypes from "./CategoryTypes";

export class CategoryStack {
  categoryStackId?: number;
  currentCategory?: CategoryTypes;
  selectedCategories: CategoryTypes[];
  remainingCategories: CategoryTypes[];
  stackIdx: number;

  constructor() {
    this.remainingCategories = [];
    this.selectedCategories = [];
    this.stackIdx = -1;
  }

  add(categoryEnum: CategoryTypes): void {
    this.selectedCategories.push(categoryEnum);
    this.stackIdx++;
  }

  addAll(categoryEnumListInsert: CategoryTypes[]): void {
    for (let i = categoryEnumListInsert.length - 1; i >= 0; i--) {
      const categoryEnum = categoryEnumListInsert[i];
      if (!this.selectedCategories.includes(categoryEnum)) {
        this.add(categoryEnum);
      }
    }
    this.refillStack();
  }

  isEmpty(): boolean {
    return this.remainingCategories.length === 0;
  }

  pop(): CategoryTypes | null {
    if (this.remainingCategories.length === 0) {
      return null;
    }
    const categoryEnum = this.remainingCategories.splice(this.stackIdx, 1)[0];
    this.stackIdx--;
    return categoryEnum;
  }

  refillStack(): void {
    this.remainingCategories = [...this.selectedCategories];
    this.stackIdx = this.remainingCategories.length - 1;
  }
}
