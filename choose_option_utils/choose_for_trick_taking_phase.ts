import {
  Card,
  TrickTakingPhase,
  PlayerPosition,
  BiddingPhase,
  GameOverPhase,
  Player,
  FinishedTrick,
  Team,
  Trump,
  UpCard,
  CardSuit,
  BidChoice,
} from "../definitions.ts";
import {
  getNextPosition,
  getCardsOfSuitWhenTrumpOrderedByHierarchyDesc,
  isSameCard,
  shuffleAndDealFourHands,
  getHandSliceViaPosition,
} from "../utils.ts";

const getHighestCard = (
  leadingSuit: CardSuit,
  trump: Trump,
  cards: Card[],
): Card => {
  const highestValueCardsInTrump =
    getCardsOfSuitWhenTrumpOrderedByHierarchyDesc(
      leadingSuit,
      trump,
    );
  const highestValueCardsThatWereFound = highestValueCardsInTrump.filter(
    (card) => cards.some((trickCard) => isSameCard(trickCard, card)),
  );
  return highestValueCardsThatWereFound[0];
};

const getPositionOfWinnerOfTrick = (
  trick: FinishedTrick | UpCard[],
  trump: Trump,
): PlayerPosition => {
  const winningCard: Card = getHighestCard(
    trick[0].card.suit,
    trump,
    trick.map(
      (upCard: UpCard): Card => {
        return upCard.card;
      },
    ),
  );
  const winner: PlayerPosition =
    trick.filter((upCard) => isSameCard(upCard.card, winningCard))[0].owner;
  return winner;
};

const getTricksNeededToMakeBid = (bid: BidChoice): 3 | 4 | 5 | 6 => {
  if (bid === "3") {
    return 3;
  } else if (bid === "4") {
    return 4;
  } else if (bid === "5") {
    return 5;
  } else {
    return 6;
  }
};

const getPointsReceivedForMakingBid = (bid: BidChoice) => {
  if (bid === "Partner's Best Card") {
    return 12;
  } else if (bid === "Going Alone") {
    return 24;
  } else {
    return getTricksNeededToMakeBid(bid);
  }
};

const howManyPointsDoesTheTeamGetForBidding = (
  bid: BidChoice,
  tricksTakenCount: number,
): number => {
  const tricksNeeded = getTricksNeededToMakeBid(bid);
  const pointsReceivedForMakingBid = getPointsReceivedForMakingBid(bid);
  return tricksTakenCount < tricksNeeded
    ? pointsReceivedForMakingBid * -1
    : Math.max(tricksTakenCount, pointsReceivedForMakingBid);
};

const chooseLastCardInLastTrickThenMoveDealerAndDeal = (
  option: Card,
  phase: TrickTakingPhase,
  currentPlayer: PlayerPosition,
): BiddingPhase => {
  const fourShuffledHands = shuffleAndDealFourHands();
  const mapPlayer = (player: Player): Player => ({
    ...player,
    hand: [...getHandSliceViaPosition(player.position, fourShuffledHands)],
  });
  const lastTrick = [
    ...phase.currentTrick,
    { card: option, owner: currentPlayer },
  ];
  const allFinishedTricks: FinishedTrick[] = phase.finishedTricks.concat([
    lastTrick,
  ]);
  const mapTeams = (team: Team): Team => {
    const trickTakenCount: number = allFinishedTricks.reduce(
      (points: number, trick) => {
        const winner: PlayerPosition = getPositionOfWinnerOfTrick(
          trick,
          phase.trump,
        );
        return (
          points +
          (team.players.some((player) => player.position === winner) ? 1 : 0)
        );
      },
      0,
    );
    // const trickTakenCount: number = allFinishedTricks.filter((trick: FinishedTrick) => {}).length;
    const didBidBelongToThisTeam: boolean = team.players.some(
      (player) => player.position === phase.winningBid.playerPosition,
    );
    const pointsTaken: number = didBidBelongToThisTeam
      ? howManyPointsDoesTheTeamGetForBidding(
        phase.winningBid.choice,
        trickTakenCount,
      )
      : trickTakenCount;
    return {
      points: team.points + pointsTaken,
      players: [mapPlayer(team.players[0]), mapPlayer(team.players[1])],
    };
  };
  return {
    name: "Bidding",
    bidPosition: getNextPosition(getNextPosition(phase.dealer)),
    bids: [],
    dealer: getNextPosition(phase.dealer),
    teams: [mapTeams(phase.teams[0]), mapTeams(phase.teams[1])],
  };
};

export const chooseOptionForTrickTakingPhase = (
  option: Card,
  phase: TrickTakingPhase,
  currentPlayer: PlayerPosition,
): TrickTakingPhase | BiddingPhase | GameOverPhase => {
  const {
    currentTrick,
    finishedTricks,
    dealer,
    trump,
    winningBid,
    playerSittingOut,
    teams,
    cardPosition,
  } = phase;
  const isLastTrick: boolean = finishedTricks.length === 5;
  const isLastCardInTrick: boolean = currentTrick.length === 3 ||
    (!!playerSittingOut && currentTrick.length === 2);
  if (isLastTrick && isLastCardInTrick) {
    return chooseLastCardInLastTrickThenMoveDealerAndDeal(
      option,
      phase,
      currentPlayer,
    );
  }

  const transformPlayer = (player: Player): Player => ({
    name: player.name,
    position: player.position,
    hand: player.hand.filter((card: Card) => !isSameCard(option, card)),
  });
  const transformTeam = (team: Team): Team => ({
    players: [
      transformPlayer(team.players[0]),
      transformPlayer(team.players[1]),
    ],
    points: team.points,
  });
  if (isLastCardInTrick) {
    const trick: FinishedTrick = [
      ...currentTrick,
      { owner: currentPlayer, card: option },
    ];
    const trickWinner = getPositionOfWinnerOfTrick(trick, trump);
    const nextPhase: TrickTakingPhase = {
      name: "Trick-Taking",
      cardPosition: trickWinner,
      currentTrick: [],
      dealer,
      finishedTricks: [...finishedTricks, trick],
      trump,
      winningBid,
      playerSittingOut,
      teams: [transformTeam(teams[0]), transformTeam(teams[1])],
    };
    return nextPhase;
  } else {
    const nextPhase: TrickTakingPhase = {
      name: "Trick-Taking",
      cardPosition:
        playerSittingOut && getNextPosition(cardPosition) === playerSittingOut
          ? getNextPosition(getNextPosition(cardPosition))
          : getNextPosition(cardPosition),
      currentTrick: [...currentTrick, { owner: currentPlayer, card: option }],
      dealer,
      finishedTricks,
      trump,
      winningBid,
      playerSittingOut,
      teams: [transformTeam(teams[0]), transformTeam(teams[1])],
    };
    return nextPhase;
  }
};
