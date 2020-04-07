import {
  PartnersBestCardPickingPhase,
  PlayerPosition,
  Card,
} from "../definitions.ts";

export const getOptionsForPartnersBestCardPickingPhase = (
  phase: PartnersBestCardPickingPhase,
  currentPlayer: PlayerPosition
): Card[] => {
  if (phase.partner !== currentPlayer) return [];
  const player = phase.teams[0].players
    .concat(phase.teams[1].players)
    .find((p) => p.position === currentPlayer);
  return player ? player.hand : [];
};
