import { TrickTakingPhase, PlayerPosition, Card } from "../definitions.ts";
import { getCardsOfSuitWhenTrumpOrderedByHierarchyDesc } from "../utils.ts";

export const getOptionsForTrickTakingPhase = (
  phase: TrickTakingPhase,
  currentPlayer: PlayerPosition
): Card[] => {
  if (phase.cardPosition !== currentPlayer) return [];
  const players = phase.teams[0].players.concat(phase.teams[1].players);
  const player = players.find((player) => player.position === currentPlayer);
  const handOfCurrentPlayer: Card[] = player ? player.hand : [];
  if (phase.currentTrick.length > 0) {
    const cardsOfSameSuitAsLead: Card[] = getCardsOfSuitWhenTrumpOrderedByHierarchyDesc(
      phase.currentTrick[0].card.suit,
      phase.trump
    );
    const doesPlayerHaveCardOfSameLeadingSuit = cardsOfSameSuitAsLead.some(
      (card) => handOfCurrentPlayer.includes(card)
    );
    if (doesPlayerHaveCardOfSameLeadingSuit) {
      return handOfCurrentPlayer.filter((card) =>
        cardsOfSameSuitAsLead.includes(card)
      );
    }
  }
  return handOfCurrentPlayer;
};
