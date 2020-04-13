import {
  PartnersBestCardPickingPhase,
  PlayerPosition,
  Card,
} from "../definitions.ts";
import { getPositionOfPartner, getPlayerByPosition } from "../utils.ts";

export const getOptionsForPartnersBestCardPickingPhase = (
  phase: PartnersBestCardPickingPhase,
  currentPlayer: PlayerPosition
): Card[] => {
  const partnerPosition: PlayerPosition = phase.partner;
  const lonelyPlayerPosition: PlayerPosition = getPositionOfPartner(
    partnerPosition
  );
  const hasLonelyPlayerAlreadyDiscardedACard =
    getPlayerByPosition(lonelyPlayerPosition, phase).hand.length === 5;
  const playerToAct: PlayerPosition = !hasLonelyPlayerAlreadyDiscardedACard
    ? lonelyPlayerPosition
    : partnerPosition;
  if (currentPlayer !== playerToAct) return [];
  return getPlayerByPosition(playerToAct, phase).hand;
};
