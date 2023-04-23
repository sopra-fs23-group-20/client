export enum Difficulty {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
}

export function stringToDifficulty(difficulty: string | null): Difficulty {
  switch (difficulty) {
    case "EASY":
      return Difficulty.EASY;
    case "MEDIUM":
      return Difficulty.MEDIUM;
    case "HARD":
      return Difficulty.HARD;
    default:
      return Difficulty.EASY;
  }
}
