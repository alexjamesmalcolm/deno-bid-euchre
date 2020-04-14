import { TrickTakingPhase, PlayerPosition, Card } from "../definitions.ts";
import {
  getCardsOfSuitWhenTrumpOrderedByHierarchyDesc,
  isSameCard,
} from "../utils.ts";

export const getOptionsForTrickTakingPhase = (
  phase: TrickTakingPhase,
  currentPlayer: PlayerPosition,
): Card[] => {
  if (phase.cardPosition !== currentPlayer) return [];
  const players = phase.teams[0].players.concat(phase.teams[1].players);
  const player = players.find((player) => player.position === currentPlayer);
  const handOfCurrentPlayer: Card[] = player ? player.hand : [];
  if (phase.currentTrick.length > 0) {
    const leadingCard = phase.currentTrick[0].card;
    const cardsOfSameSuitAsLead: Card[] =
      getCardsOfSuitWhenTrumpOrderedByHierarchyDesc(
        phase.trump !== "High" &&
        phase.trump !== "Low" &&
        getCardsOfSuitWhenTrumpOrderedByHierarchyDesc(
          phase.trump,
          phase.trump,
        ).some((card) => isSameCard(leadingCard, card))
          ? phase.trump
          : leadingCard.suit,
        phase.trump,
      );
    const doesPlayerHaveCardOfSameLeadingSuit = cardsOfSameSuitAsLead.some(
      (card) =>
        handOfCurrentPlayer.some((cardInHand) => isSameCard(cardInHand, card)),
    );
    if (doesPlayerHaveCardOfSameLeadingSuit) {
      return handOfCurrentPlayer.filter((card) =>
        cardsOfSameSuitAsLead.some((cardOfSameSuitAsLead) =>
          isSameCard(cardOfSameSuitAsLead, card)
        )
      );
    }
  }
  return handOfCurrentPlayer;
};
