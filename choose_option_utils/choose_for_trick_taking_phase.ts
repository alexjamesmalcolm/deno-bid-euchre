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
import FixedLengthArray from "../FixedLengthArray.ts";
import {
  getNextPosition,
  getCardsOfSuitWhenTrumpOrderedByHierarchyDesc,
  isSameCard,
} from "../utils.ts";
import shuffle from "../shuffle.ts";

const getAllCards = (): Card[] => [
  { rank: "9", suit: "Clubs" },
  { rank: "10", suit: "Clubs" },
  { rank: "Jack", suit: "Clubs" },
  { rank: "Queen", suit: "Clubs" },
  { rank: "King", suit: "Clubs" },
  { rank: "Ace", suit: "Clubs" },
  { rank: "9", suit: "Diamonds" },
  { rank: "10", suit: "Diamonds" },
  { rank: "Jack", suit: "Diamonds" },
  { rank: "Queen", suit: "Diamonds" },
  { rank: "King", suit: "Diamonds" },
  { rank: "Ace", suit: "Diamonds" },
  { rank: "9", suit: "Hearts" },
  { rank: "10", suit: "Hearts" },
  { rank: "Jack", suit: "Hearts" },
  { rank: "Queen", suit: "Hearts" },
  { rank: "King", suit: "Hearts" },
  { rank: "Ace", suit: "Hearts" },
  { rank: "9", suit: "Spades" },
  { rank: "10", suit: "Spades" },
  { rank: "Jack", suit: "Spades" },
  { rank: "Queen", suit: "Spades" },
  { rank: "King", suit: "Spades" },
  { rank: "Ace", suit: "Spades" },
];

const shuffleAndDealFourHands = (): FixedLengthArray<
  [
    FixedLengthArray<[Card, Card, Card, Card, Card, Card]>,
    FixedLengthArray<[Card, Card, Card, Card, Card, Card]>,
    FixedLengthArray<[Card, Card, Card, Card, Card, Card]>,
    FixedLengthArray<[Card, Card, Card, Card, Card, Card]>
  ]
> => {
  const allCardsShuffled: Card[] = shuffle(getAllCards() as Card[]);
  return [
    [
      allCardsShuffled[0],
      allCardsShuffled[1],
      allCardsShuffled[2],
      allCardsShuffled[3],
      allCardsShuffled[4],
      allCardsShuffled[5],
    ],
    [
      allCardsShuffled[6],
      allCardsShuffled[7],
      allCardsShuffled[8],
      allCardsShuffled[9],
      allCardsShuffled[10],
      allCardsShuffled[11],
    ],
    [
      allCardsShuffled[12],
      allCardsShuffled[13],
      allCardsShuffled[14],
      allCardsShuffled[15],
      allCardsShuffled[16],
      allCardsShuffled[17],
    ],
    [
      allCardsShuffled[18],
      allCardsShuffled[19],
      allCardsShuffled[20],
      allCardsShuffled[21],
      allCardsShuffled[22],
      allCardsShuffled[23],
    ],
  ];
};

const getHighestCard = (
  leadingSuit: CardSuit,
  trump: Trump,
  cards: Card[]
): Card => {
  const highestValueCardsInTrump = getCardsOfSuitWhenTrumpOrderedByHierarchyDesc(
    leadingSuit,
    trump
  );
  const highestValueCardsThatWereFound = highestValueCardsInTrump.filter(
    (card) => cards.some((trickCard) => isSameCard(trickCard, card))
  );
  return highestValueCardsThatWereFound[0];
};

const getPositionOfWinnerOfTrick = (
  trick: FinishedTrick | UpCard[],
  trump: Trump
): PlayerPosition => {
  const winningCard: Card = getHighestCard(
    trick[0].card.suit,
    trump,
    trick.map(
      (upCard: UpCard): Card => {
        return upCard.card;
      }
    )
  );
  const winner: PlayerPosition = trick.filter((upCard) =>
    isSameCard(upCard.card, winningCard)
  )[0].owner;
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

const getPointsReceivedForMakingBid = (
  bid: BidChoice
): 3 | 4 | 5 | 6 | 12 | 24 => {
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
  tricksTakenCount: number
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
  currentPlayer: PlayerPosition
): BiddingPhase => {
  const fourShuffledHands = shuffleAndDealFourHands();
  const getIndex = (position: PlayerPosition): 0 | 1 | 2 | 3 => {
    if (position === "1") {
      return 0;
    } else if (position === "2") {
      return 1;
    } else if (position === "3") {
      return 2;
    }
    return 3;
  };
  const getHandSliceViaPosition = (
    position: PlayerPosition
  ): FixedLengthArray<[Card, Card, Card, Card, Card, Card]> => {
    const index = getIndex(position);
    return fourShuffledHands[index];
  };
  const mapPlayer = (player: Player): Player => {
    return {
      ...player,
      hand: [...getHandSliceViaPosition(player.position)],
    };
  };
  const firstCard: UpCard = phase.currentTrick[0];
  const secondCard: UpCard = phase.currentTrick[1];
  const thirdCard: UpCard = phase.currentTrick[2];
  const fourthCard: UpCard = { card: option, owner: currentPlayer };
  const lastTrick: FinishedTrick = [
    firstCard,
    secondCard,
    thirdCard,
    fourthCard,
  ];
  const allFinishedTricks: FinishedTrick[] = phase.finishedTricks.concat([
    lastTrick,
  ]);
  const mapTeams = (team: Team): Team => {
    const trickTakenCount: number = allFinishedTricks.reduce(
      (points: number, trick) => {
        // if (trick.length !== 4) {
        //   jsonPrint({ trick });
        //   throw `Trick's length should be 4 but it's ${trick.length}`;
        // }
        const winner: PlayerPosition = getPositionOfWinnerOfTrick(
          trick,
          phase.trump
        );
        return (
          points +
          (team.players.some((player) => player.position === winner) ? 1 : 0)
        );
      },
      0
    );
    // const trickTakenCount: number = allFinishedTricks.filter((trick: FinishedTrick) => {}).length;
    const didBidBelongToThisTeam: boolean = team.players.some(
      (player) => player.position === phase.winningBid.playerPosition
    );
    const pointsTaken: number = didBidBelongToThisTeam
      ? howManyPointsDoesTheTeamGetForBidding(
          phase.winningBid.choice,
          trickTakenCount
        )
      : trickTakenCount;
    return {
      points: team.points + pointsTaken,
      players: [mapPlayer(team.players[0]), mapPlayer(team.players[1])],
    };
  };
  return {
    name: "Bidding",
    bidPosition: "1",
    bids: [],
    dealer: "1",
    teams: [mapTeams(phase.teams[0]), mapTeams(phase.teams[1])],
  };
};

export const chooseOptionForTrickTakingPhase = (
  option: Card,
  phase: TrickTakingPhase,
  currentPlayer: PlayerPosition
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
  const isLastCardInTrick: boolean = currentTrick.length === 3;
  if (isLastTrick && isLastCardInTrick) {
    return chooseLastCardInLastTrickThenMoveDealerAndDeal(
      option,
      phase,
      currentPlayer
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
      currentTrick[0],
      currentTrick[1],
      currentTrick[2],
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
      cardPosition: getNextPosition(cardPosition),
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
