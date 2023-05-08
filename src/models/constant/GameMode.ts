export enum GameMode {
  NORMAL = "NORMAL",
  BLITZ = "BLITZ",
}

export function stringToGameMode(gameMode: string | null): GameMode {
  switch (gameMode) {
    case "NORMAL":
      return GameMode.NORMAL;
    case "BLITZ":
      return GameMode.BLITZ;
    default:
      return GameMode.NORMAL;
  }
}
