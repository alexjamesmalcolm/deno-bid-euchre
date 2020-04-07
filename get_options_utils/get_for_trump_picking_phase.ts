import { TrumpPickingPhase, PlayerPosition, Trump } from "../definitions.ts";

export const getOptionsForTrumpPickingPhase = (
  phase: TrumpPickingPhase,
  currentPlayer: PlayerPosition
): Trump[] => {
  if (phase.winningBid.playerPosition === currentPlayer) {
    if (phase.winningBid.choice === "3") {
      return ["Clubs", "Diamonds", "Hearts", "Spades"];
    } else {
      return ["Clubs", "Diamonds", "Hearts", "Spades", "High", "Low"];
    }
  }
  return [];
};
