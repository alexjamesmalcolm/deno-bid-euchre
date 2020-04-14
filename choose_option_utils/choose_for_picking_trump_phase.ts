import {
  Trump,
  TrumpPickingPhase,
  PartnersBestCardPickingPhase,
  TrickTakingPhase,
} from "../definitions.ts";
import { getPositionOfPartner, getNextPosition } from "../utils.ts";

export const chooseOptionForPickingTrumpPhase = (
  option: Trump,
  phase: TrumpPickingPhase,
): PartnersBestCardPickingPhase | TrickTakingPhase => {
  const dealer = phase.dealer;
  const partner = getPositionOfPartner(phase.winningBid.playerPosition);
  const teams = phase.teams;
  if (phase.winningBid.choice === "Partner's Best Card") {
    const nextPhase: PartnersBestCardPickingPhase = {
      name: "Picking Partner's Best Card",
      dealer,
      trump: option,
      partner,
      teams,
      winningBid: phase.winningBid,
    };
    return nextPhase;
  } else {
    const nextPhase: TrickTakingPhase = {
      name: "Trick-Taking",
      dealer,
      trump: option,
      winningBid: phase.winningBid,
      cardPosition: getNextPosition(dealer),
      teams,
      currentTrick: [],
      finishedTricks: [],
    };
    if (phase.winningBid.choice === "Going Alone") {
      nextPhase.playerSittingOut = partner;
    }
    return nextPhase;
  }
};
