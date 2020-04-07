import {
  BidChoice,
  PlayerPosition,
  CardSuit,
  Trump,
  Card,
} from "./definitions.ts";

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

export const getPositionOfPartner = (
  position: PlayerPosition
): PlayerPosition => {
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
  second: BidChoice
): boolean => getHigherBid(first, second) === first;

export const getHigherBids = (bid: BidChoice): BidChoice[] =>
  bidHierarchy.filter((element) => isFirstBidGreaterThanSecond(element, bid));

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

export const getCardsOfSuitWhenTrumpOrderedByHierarchyDesc = (
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
      { rank: "Ace", suit },
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
