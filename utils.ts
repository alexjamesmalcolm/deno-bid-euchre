import {
  BidChoice,
  PlayerPosition,
  CardSuit,
  Trump,
  Card,
  FourHands,
  Phase,
  Player,
} from "./definitions.ts";
import FixedLengthArray from "./FixedLengthArray.ts";
import shuffle from "./shuffle.ts";

const bidHierarchy: BidChoice[] = [
  "Going Alone",
  "Partner's Best Card",
  "6",
  "5",
  "4",
  "3",
  "Pass",
];

export const getHigherBid = (bidA: BidChoice, bidB: BidChoice): BidChoice =>
  bidHierarchy.filter((element) => element === bidA || element === bidB)[0];

export const getNextPosition = (position: PlayerPosition): PlayerPosition => {
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

export const getPositionOfPartner = (position: PlayerPosition) => {
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

const isFirstBidGreaterThanSecond = (
  first: BidChoice,
  second: BidChoice,
): boolean => getHigherBid(first, second) === first;

export const getHigherBids = (bid: BidChoice): BidChoice[] =>
  bidHierarchy.filter(
    (element) =>
      element === "Pass" ||
      (bid !== element && isFirstBidGreaterThanSecond(element, bid)),
  );

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

export const cardsContainCard = (cards: Card[], card: Card) =>
  cards.some((c) => isSameCard(card, c));

export const getAllCardsOrderedByHierarchyDesc = (
  leadingCardSuit: CardSuit,
  trump: Trump,
): Card[] => {
  if (trump === "Low" || trump === "High") {
    const relevantCards: Card[] = getCardsOfSuitWhenTrumpOrderedByHierarchyDesc(
      leadingCardSuit,
      trump,
    );
    const irrelevantCards: Card[] = getAllCards().filter((card) =>
      !cardsContainCard(relevantCards, card)
    );
    return relevantCards.concat(irrelevantCards);
  }
  const trumpCards: Card[] = getCardsOfSuitWhenTrumpOrderedByHierarchyDesc(
    trump,
    trump,
  );
  const leadingSuitCards: Card[] =
    getCardsOfSuitWhenTrumpOrderedByHierarchyDesc(leadingCardSuit, trump);
  const irrelevantCards: Card[] = getAllCards().filter((card) => {
    if (cardsContainCard(trumpCards, card)) return false;
    if (cardsContainCard(leadingSuitCards, card)) return false;
    return true;
  });
  return trumpCards.concat(leadingSuitCards).concat(irrelevantCards);
};

export const getCardsOfSuitWhenTrumpOrderedByHierarchyDesc = (
  suit: CardSuit,
  trump: Trump,
): Card[] => {
  if (trump === "Low" || trump === "High") {
    const cards: Card[] = [
      { rank: "9", suit },
      { rank: "10", suit },
      { rank: "Jack", suit },
      { rank: "Queen", suit },
      { rank: "King", suit },
      { rank: "Ace", suit },
    ];
    return trump === "Low" ? cards : cards.reverse();
  } else {
    const leftBowerSuit: CardSuit = getSameColorSuit(trump);
    if (suit === trump) {
      const cards: Card[] = [
        { rank: "Jack", suit },
        { rank: "Jack", suit: leftBowerSuit },
        { rank: "Ace", suit },
        { rank: "King", suit },
        { rank: "Queen", suit },
        { rank: "10", suit },
        { rank: "9", suit },
      ];
      return cards;
    } else {
      if (leftBowerSuit === suit) {
        const cards: Card[] = [
          { rank: "Ace", suit },
          { rank: "King", suit },
          { rank: "Queen", suit },
          { rank: "10", suit },
          { rank: "9", suit },
        ];
        return cards;
      } else {
        const cards: Card[] = [
          { rank: "Ace", suit },
          { rank: "King", suit },
          { rank: "Queen", suit },
          { rank: "Jack", suit },
          { rank: "10", suit },
          { rank: "9", suit },
        ];
        return cards;
      }
    }
  }
};

export const isSameCard = (a: Card, b: Card): boolean =>
  a.rank === b.rank && a.suit === b.suit;

const randomNumberBothInclusive = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const randomPlayerPosition = (): PlayerPosition => {
  const playerPositions: PlayerPosition[] = ["1", "2", "3", "4"];
  return playerPositions[randomNumberBothInclusive(0, 3)];
};

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

export const shuffleAndDealFourHands = (): FourHands => {
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

export const getHandSliceViaPosition = (
  position: PlayerPosition,
  fourShuffledHands: FourHands,
): FixedLengthArray<[Card, Card, Card, Card, Card, Card]> =>
  fourShuffledHands[getIndex(position)];

export const getPlayerByPosition = (
  position: PlayerPosition,
  phase: Phase,
): Player => {
  const players: Player[] = phase.teams[0].players.concat(
    phase.teams[1].players,
  );
  const foundPlayer = players.find((player) => player.position === position);
  if (foundPlayer) return foundPlayer;
  throw `Could not find player of position ${position}`;
};
