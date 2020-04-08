import { BiddingPhase, PlayerPosition, BidChoice } from "../definitions.ts";
import { getHigherBid, getHigherBids } from "../utils.ts";

export const getOptionsForBiddingPhase = (
  phase: BiddingPhase,
  currentPlayer: PlayerPosition
): BidChoice[] => {
  if (phase.bidPosition !== currentPlayer) {
    return [];
  }
  if (phase.bids.length === 0) {
    return ["Pass", "3", "4", "5", "6", "Partner's Best Card", "Going Alone"];
  }
  const highestBid: BidChoice = phase.bids
    .map((bid) => bid.choice)
    .reduce((previousValue, currentValue) =>
      getHigherBid(previousValue, currentValue)
    );
  const isPlayerDealer = currentPlayer === phase.dealer;
  const hasEveryoneElsePassed = phase.bids.every(
    (bid) => bid.choice === "Pass"
  );
  const isDealerFucked = isPlayerDealer && hasEveryoneElsePassed;
  const higherBids = getHigherBids(highestBid);
  return isDealerFucked
    ? higherBids.filter((bid) => bid !== "Pass")
    : higherBids;
};
