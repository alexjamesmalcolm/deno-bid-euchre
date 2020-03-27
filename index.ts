import FixedLengthArray from "./FixedLengthArray.ts";

type CardRank = "9" | "10" | "Jack" | "Queen" | "King" | "Ace";
type CardSuit = "Clubs" | "Diamonds" | "Hearts" | "Spades";

export interface Card {
  rank: CardRank;
  suit: CardSuit;
}
const isCard = (a: any): a is Card => {
  const card = <Card>a;
  return card.rank !== undefined && card.suit !== undefined;
};

export type PlayerPosition = "1" | "2" | "3" | "4";

interface Player {
  name: string;
  position: PlayerPosition;
  hand: Card[];
}

export interface Team {
  players: FixedLengthArray<[Player, Player]>;
  points: number;
}

interface BasePhase {
  name: string;
  teams: FixedLengthArray<[Team, Team]>;
  dealer: PlayerPosition;
}

export type BidChoice =
  | "Pass"
  | "3"
  | "4"
  | "5"
  | "6"
  | "Partner's Best Card"
  | "Going Alone";
const isBidChoice = (a: any): a is BidChoice =>
  ["Pass", "3", "4", "5", "6", "Partner's Best Card", "Going Alone"].includes(
    a
  );
type Trump = CardSuit | "High" | "Low";
const isTrump = (a: any): a is Trump =>
  ["Clubs", "Diamonds", "Hearts", "High", "Low", "Spades"].includes(a);

export interface Bid {
  playerPosition: PlayerPosition;
  choice: BidChoice;
}

export interface BiddingPhase extends BasePhase {
  name: "Bidding";
  bidPosition: PlayerPosition;
  bids: Bid[];
}

export interface TrumpPickingPhase extends BasePhase {
  name: "Picking Trump";
  winningBid: Bid;
}

export interface PartnersBestCardPickingPhase extends BasePhase {
  name: "Picking Partner's Best Card";
  trump: Trump;
  winningBid: Bid;
  partner: PlayerPosition;
}

interface UpCard {
  owner: PlayerPosition;
  card: Card;
}

type Trick = UpCard[];
type FinishedTrick = FixedLengthArray<[UpCard, UpCard, UpCard, UpCard]>;

export interface TrickTakingPhase extends BasePhase {
  name: "Trick-Taking";
  trump: Trump;
  winningBid: Bid;
  cardPosition: PlayerPosition;
  currentTrick: Trick;
  finishedTricks: FinishedTrick[];
  playerSittingOut?: PlayerPosition;
}

interface GameOverPhase {
  name: "Game Over";
  winners: Team;
  losers: Team;
}

export type Phase =
  | BiddingPhase
  | TrumpPickingPhase
  | PartnersBestCardPickingPhase
  | TrickTakingPhase;

export type Option = BidChoice | Trump | Card;

const bidHierarchy: BidChoice[] = [
  "Going Alone",
  "Partner's Best Card",
  "6",
  "5",
  "4",
  "3",
  "Pass"
];

const getPositionOfPartner = (position: PlayerPosition): PlayerPosition => {
  if (position === "1") {
    return "3";
  } else if (position === "2") {
    return "4";
  } else if (position === "3") {
    return "1";
  } else {
    return "2";
  }
};

export const determineIfPhaseIsLegal = (phase: Phase): [boolean, string] => {
  if (phase.teams.length !== 2) {
    return [false, "Team lengths were not two"];
  }
  const players: Player[] = phase.teams[0].players.concat(
    phase.teams[1].players
  );
  if (
    phase.name !== "Trick-Taking" &&
    !players.every(player => player.hand.length === 6)
  ) {
    return [
      false,
      "Not all players have 6 cards in their hands each even though we aren't in the Trick-Taking Phase yet."
    ];
  }
  const cardsInHandsOfPlayers: Card[] = players.reduce(
    (accumulator, currentValue) => accumulator.concat(currentValue.hand),
    [] as Card[]
  );
  const doesEachFinishedTrickHaveOnlyOneCardFromEachOwner =
    phase.name === "Trick-Taking"
      ? phase.finishedTricks.every(
          trick =>
            [...new Set(trick.map(upCard => upCard.owner))].length ===
            trick.length
        ) &&
        [...new Set(phase.currentTrick.map(upCard => upCard.owner))].length ===
          phase.currentTrick.length
      : true;
  if (!doesEachFinishedTrickHaveOnlyOneCardFromEachOwner) {
    return [false, "One of the "];
  }
  const cardsInPlay: Card[] =
    phase.name === "Trick-Taking"
      ? phase.finishedTricks
          .flatMap(trick => trick.map(({ card }) => card))
          .concat(phase.currentTrick.map(({ card }) => card))
      : [];
  const cards: Card[] = cardsInHandsOfPlayers.concat(cardsInPlay);
  const hasTwentyFourCards = cards.length === 24;
  if (!hasTwentyFourCards) {
    return [false, "Game does not have 24 cards in play."];
  }
  const isEveryCardUnique = cards.every((firstCard, firstIndex) => {
    return cards.every((secondCard, secondIndex) => {
      if (firstIndex === secondIndex) {
        return true;
      }
      const areNotTheSame =
        firstCard.rank !== secondCard.rank ||
        firstCard.suit !== secondCard.suit;
      return areNotTheSame;
    });
  });
  if (!isEveryCardUnique) {
    return [false, "Not every card is unique"];
  }
  if ([...new Set(players.map(player => player.position))].length !== 4) {
    return [false, "At least two of the players are sharing the same seat."];
  }
  if (
    !phase.teams.every(team => {
      const positions = team.players.map(player => player.position);
      return (
        (positions.includes("1") && positions.includes("3")) ||
        (positions.includes("2") && positions.includes("4"))
      );
    })
  ) {
    return [
      false,
      "Players of the same team are not sitting opposite each other."
    ];
  }
  return [true, "No issue detected"];
};

const getHigherBid = (bidA: BidChoice, bidB: BidChoice): BidChoice =>
  bidHierarchy.filter(element => element === bidA || element === bidB)[0];

const isFirstBidGreaterThanSecond = (
  first: BidChoice,
  second: BidChoice
): boolean => getHigherBid(first, second) === first;

const getHigherBids = (bid: BidChoice): BidChoice[] =>
  bidHierarchy.filter(element => isFirstBidGreaterThanSecond(element, bid));

const getOptionsForBiddingPhase = (
  phase: BiddingPhase,
  currentPlayer: PlayerPosition
): BidChoice[] => {
  if (phase.bidPosition !== currentPlayer) {
    return [];
  }
  const highestBid: BidChoice = phase.bids
    .map(bid => bid.choice)
    .reduce((previousValue, currentValue) =>
      getHigherBid(previousValue, currentValue)
    );
  const isPlayerDealer = currentPlayer === phase.dealer;
  const hasEveryoneElsePassed = phase.bids.every(bid => bid.choice === "Pass");
  const isDealerFucked = isPlayerDealer && hasEveryoneElsePassed;
  const higherBids = getHigherBids(highestBid);
  return isDealerFucked ? higherBids.filter(bid => bid !== "Pass") : higherBids;
};
const getOptionsForTrumpPickingPhase = (
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
const getOptionsForPartnersBestCardPickingPhase = (
  phase: PartnersBestCardPickingPhase,
  currentPlayer: PlayerPosition
): Card[] => {
  if (phase.partner !== currentPlayer) return [];
  const player = phase.teams[0].players
    .concat(phase.teams[1].players)
    .find(p => p.position === currentPlayer);
  return player ? player.hand : [];
};
const getSameColorSuit = (suit: CardSuit): CardSuit => {
  if (suit === "Clubs") {
    return "Spades";
  } else if (suit === "Spades") {
    return "Clubs";
  } else if (suit === "Diamonds") {
    return "Hearts";
  } else {
    return "Diamonds";
  }
};
const getCardsOfSuitWhenTrumpOrderedByHierarchyDesc = (
  suit: CardSuit,
  trump: Trump
): Card[] => {
  if (trump === "Low" || trump === "High") {
    const cards: Card[] = [
      { rank: "9", suit },
      { rank: "10", suit },
      { rank: "Jack", suit },
      { rank: "Queen", suit },
      { rank: "King", suit },
      { rank: "Ace", suit }
    ];
    return trump === "Low" ? cards : cards.reverse();
  } else {
    const leftBowerSuit: CardSuit = getSameColorSuit(suit);
    if (suit === trump) {
      const cards: Card[] = [
        { rank: "Jack", suit },
        { rank: "Jack", suit: leftBowerSuit },
        { rank: "Ace", suit },
        { rank: "King", suit },
        { rank: "Queen", suit },
        { rank: "10", suit },
        { rank: "9", suit }
      ];
      return cards;
    } else {
      if (leftBowerSuit === suit) {
        const cards: Card[] = [
          { rank: "Ace", suit },
          { rank: "King", suit },
          { rank: "Queen", suit },
          { rank: "10", suit },
          { rank: "9", suit }
        ];
        return cards;
      } else {
        const cards: Card[] = [
          { rank: "Ace", suit },
          { rank: "King", suit },
          { rank: "Queen", suit },
          { rank: "Jack", suit },
          { rank: "10", suit },
          { rank: "9", suit }
        ];
        return cards;
      }
    }
  }
};
const getHighestCard = (
  leadingSuit: CardSuit,
  trump: Trump,
  cards: Card[]
): Card =>
  getCardsOfSuitWhenTrumpOrderedByHierarchyDesc(
    leadingSuit,
    trump
  ).filter(card => cards.includes(card))[0];
const getOptionsForTrickTakingPhase = (
  phase: TrickTakingPhase,
  currentPlayer: PlayerPosition
): Card[] => {
  if (phase.cardPosition !== currentPlayer) return [];
  const players = phase.teams[0].players.concat(phase.teams[1].players);
  const player = players.find(player => player.position === currentPlayer);
  const handOfCurrentPlayer: Card[] = player ? player.hand : [];
  if (phase.currentTrick.length > 0) {
    const cardsOfSameSuitAsLead: Card[] = getCardsOfSuitWhenTrumpOrderedByHierarchyDesc(
      phase.currentTrick[0].card.suit,
      phase.trump
    );
    const doesPlayerHaveCardOfSameLeadingSuit = cardsOfSameSuitAsLead.some(
      card => handOfCurrentPlayer.includes(card)
    );
    if (doesPlayerHaveCardOfSameLeadingSuit) {
      return handOfCurrentPlayer.filter(card =>
        cardsOfSameSuitAsLead.includes(card)
      );
    }
  }
  return handOfCurrentPlayer;
};

export const getOptions = (
  phase: Phase,
  currentPlayer: PlayerPosition
): Option[] => {
  if (!determineIfPhaseIsLegal(phase)[0]) {
    return [];
  }
  if (phase.name === "Bidding") {
    return getOptionsForBiddingPhase(phase, currentPlayer);
  } else if (phase.name === "Picking Trump") {
    return getOptionsForTrumpPickingPhase(phase, currentPlayer);
  } else if (phase.name === "Trick-Taking") {
    return getOptionsForTrickTakingPhase(phase, currentPlayer);
  } else if (phase.name === "Picking Partner's Best Card") {
    return getOptionsForPartnersBestCardPickingPhase(phase, currentPlayer);
  }
  return [];
};

export const isLegalOption = (
  option: Option,
  phase: Phase,
  currentPlayer: PlayerPosition
): boolean => getOptions(phase, currentPlayer).includes(option);

const getNextPosition = (position: PlayerPosition): PlayerPosition => {
  if (position === "1") {
    return "2";
  } else if (position === "2") {
    return "3";
  } else if (position === "3") {
    return "4";
  } else {
    return "1";
  }
};

const getWinningBid = (bids: Bid[]): Bid =>
  bids.reduce((previousValue, currentValue) => {
    const highestBidChoice = getHigherBid(
      previousValue.choice,
      currentValue.choice
    );
    return highestBidChoice === previousValue.choice
      ? previousValue
      : currentValue;
  });

const chooseOptionForBiddingPhase = (
  option: BidChoice,
  phase: BiddingPhase,
  currentPlayer: PlayerPosition
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
      winningBid
    };
    return nextPhase;
  } else {
    const nextPhase: BiddingPhase = {
      name: "Bidding",
      bidPosition: getNextPosition(phase.bidPosition),
      bids,
      dealer: phase.dealer,
      teams: phase.teams
    };
    return nextPhase;
  }
};
const chooseOptionForPickingTrumpPhase = (
  option: Trump,
  phase: TrumpPickingPhase
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
      winningBid: phase.winningBid
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
      finishedTricks: []
    };
    if (phase.winningBid.choice === "Going Alone") {
      nextPhase.playerSittingOut = partner;
    }
    return nextPhase;
  }
};
const chooseOptionForPickingPartnersBestCardPhase = (
  option: Card,
  phase: PartnersBestCardPickingPhase
): TrickTakingPhase => {
  const positionOfPlayerWhoIsPlayingWithoutPartner: PlayerPosition = getPositionOfPartner(
    phase.partner
  );
  const mapTeam = (team: Team): Team => {
    const isTeamTheBidWinner = team.players.some(
      player => player.position === phase.partner
    );
    const mapPlayer = (player: Player): Player => {
      const isPlayerSolo =
        player.position === positionOfPlayerWhoIsPlayingWithoutPartner;
      const changedPlayer: Player = isPlayerSolo
        ? { ...player, hand: player.hand.concat([option]) }
        : {
            ...player,
            hand: player.hand.filter(
              card => card.rank !== option.rank && card.suit !== option.suit
            )
          };
      return changedPlayer;
    };
    if (isTeamTheBidWinner) {
      const result: Team = {
        ...team,
        players: [mapPlayer(team.players[0]), mapPlayer(team.players[1])]
      };
      return result;
    } else {
      return team;
    }
  };
  const teams: FixedLengthArray<[Team, Team]> = [
    mapTeam(phase.teams[0]),
    mapTeam(phase.teams[1])
  ];
  return {
    name: "Trick-Taking",
    playerSittingOut: phase.partner,
    dealer: phase.dealer,
    teams,
    winningBid: phase.winningBid,
    trump: phase.trump,
    currentTrick: [],
    finishedTricks: [],
    cardPosition: getNextPosition(phase.dealer)
  };
};

type TwentyFourCards = FixedLengthArray<
  [
    Card,
    Card,
    Card,
    Card,
    Card,
    Card,
    Card,
    Card,
    Card,
    Card,
    Card,
    Card,
    Card,
    Card,
    Card,
    Card,
    Card,
    Card,
    Card,
    Card,
    Card,
    Card,
    Card,
    Card
  ]
>;
const getAllCards = (): TwentyFourCards => [
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
  { rank: "Ace", suit: "Spades" }
];
const shuffleAndDealFourHands = (): FixedLengthArray<[
  FixedLengthArray<[Card, Card, Card, Card, Card, Card]>,
  FixedLengthArray<[Card, Card, Card, Card, Card, Card]>,
  FixedLengthArray<[Card, Card, Card, Card, Card, Card]>,
  FixedLengthArray<[Card, Card, Card, Card, Card, Card]>
]> => {
  const allCardsShuffled: TwentyFourCards = getAllCards().sort(
    () => Math.random() - 0.5
  );
  return [
    [
      allCardsShuffled[0],
      allCardsShuffled[1],
      allCardsShuffled[2],
      allCardsShuffled[3],
      allCardsShuffled[4],
      allCardsShuffled[5]
    ],
    [
      allCardsShuffled[6],
      allCardsShuffled[7],
      allCardsShuffled[8],
      allCardsShuffled[9],
      allCardsShuffled[10],
      allCardsShuffled[11]
    ],
    [
      allCardsShuffled[12],
      allCardsShuffled[13],
      allCardsShuffled[14],
      allCardsShuffled[15],
      allCardsShuffled[16],
      allCardsShuffled[17]
    ],
    [
      allCardsShuffled[18],
      allCardsShuffled[19],
      allCardsShuffled[20],
      allCardsShuffled[21],
      allCardsShuffled[22],
      allCardsShuffled[23]
    ]
  ];
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
      hand: [...getHandSliceViaPosition(player.position)]
    };
  };
  const mapTeams = (team: Team): Team => ({
    ...team,
    players: [mapPlayer(team.players[0]), mapPlayer(team.players[1])]
  });
  return {
    name: "Bidding",
    bidPosition: "1",
    bids: [],
    dealer: "1",
    teams: [mapTeams(phase.teams[0]), mapTeams(phase.teams[1])]
  };
};
const chooseOptionForTrickTakingPhase = (
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
    cardPosition
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

  if (isLastCardInTrick) {
    const nextPhase: TrickTakingPhase = {
      name: "Trick-Taking",
      cardPosition: getNextPosition(cardPosition),
      currentTrick: [...currentTrick, { owner: currentPlayer, card: option }],
      dealer,
      finishedTricks: [
        ...finishedTricks,
        [
          currentTrick[0],
          currentTrick[1],
          currentTrick[2],
          { owner: currentPlayer, card: option }
        ]
      ],
      trump,
      winningBid,
      playerSittingOut,
      // teams: [{ ...teams[0] }, { ...teams[1] }]
      teams
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
      // teams: [{ ...teams[0] }, { ...teams[1] }]
      teams
    };
    return nextPhase;
  }
};
export const chooseOption = (
  option: Option,
  phase: Phase,
  currentPlayer: PlayerPosition
): Phase | GameOverPhase => {
  if (
    !isLegalOption(option, phase, currentPlayer) ||
    !determineIfPhaseIsLegal(phase)
  ) {
    return phase;
  }

  const getPhase = () => {
    if (phase.name === "Bidding" && isBidChoice(option)) {
      return chooseOptionForBiddingPhase(option, phase, currentPlayer);
    } else if (phase.name === "Picking Trump" && isTrump(option)) {
      return chooseOptionForPickingTrumpPhase(option, phase);
    } else if (phase.name === "Picking Partner's Best Card" && isCard(option)) {
      return chooseOptionForPickingPartnersBestCardPhase(option, phase);
    } else if (phase.name === "Trick-Taking" && isCard(option)) {
      return chooseOptionForTrickTakingPhase(option, phase, currentPlayer);
    }
    return phase;
  };
  const nextPhase: Phase | GameOverPhase = getPhase();
  if (nextPhase.name === "Game Over") {
    return nextPhase;
  }
  return determineIfPhaseIsLegal(nextPhase) ? nextPhase : phase;
};
