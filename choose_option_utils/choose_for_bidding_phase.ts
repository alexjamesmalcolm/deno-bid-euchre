import {
  BidChoice,
  BiddingPhase,
  PlayerPosition,
  TrumpPickingPhase,
  Bid,
} from "../definitions.ts";
import { getHigherBid, getNextPosition } from "../utils.ts";

const getWinningBid = (bids: Bid[]): Bid =>
  bids.reduce((previousValue, currentValue) => {
    const highestBidChoice = getHigherBid(
      previousValue.choice,
      currentValue.choice,
    );
    return highestBidChoice === previousValue.choice
      ? previousValue
      : currentValue;
  });

export const chooseOptionForBiddingPhase = (
  option: BidChoice,
  phase: BiddingPhase,
  currentPlayer: PlayerPosition,
): BiddingPhase | TrumpPickingPhase => {
  const bid: Bid = { choice: option, playerPosition: currentPlayer };
  const bids: Bid[] = phase.bids.concat([bid]);
  const isThisTheLastBid = currentPlayer === phase.dealer;
  if (isThisTheLastBid) {
    const winningBid: Bid = getWinningBid(bids);
    const nextPhase: TrumpPickingPhase = {
      name: "Picking Trump",
      dealer: phase.dealer,
      teams: phase.teams,
      winningBid,
    };
    return nextPhase;
  } else {
    const nextPhase: BiddingPhase = {
      name: "Bidding",
      bidPosition: getNextPosition(phase.bidPosition),
      bids,
      dealer: phase.dealer,
      teams: phase.teams,
    };
    return nextPhase;
  }
};
