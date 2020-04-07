import {
  Card,
  BidChoice,
  Trump,
  PlayerPosition,
  Player,
  Phase,
  Option,
  GameOverPhase,
} from "./definitions.ts";
import { chooseOptionForBiddingPhase } from "./choose_option_utils/choose_for_bidding_phase.ts";
import { chooseOptionForPickingTrumpPhase } from "./choose_option_utils/choose_for_picking_trump_phase.ts";
import { chooseOptionForPickingPartnersBestCardPhase } from "./choose_option_utils/choose_for_partners_best_card_phase.ts";
import { chooseOptionForTrickTakingPhase } from "./choose_option_utils/choose_for_trick_taking_phase.ts";
import { getOptionsForBiddingPhase } from "./get_options_utils/get_for_bidding_phase.ts";
import { getOptionsForTrumpPickingPhase } from "./get_options_utils/get_for_trump_picking_phase.ts";
import { getOptionsForTrickTakingPhase } from "./get_options_utils/get_for_trick_taking_phase.ts";
import { getOptionsForPartnersBestCardPickingPhase } from "./get_options_utils/get_for_partners_best_card_picking_phase.ts";

const isCard = (a: any): a is Card => {
  const card = <Card>a;
  return card.rank !== undefined && card.suit !== undefined;
};

const isBidChoice = (a: any): a is BidChoice =>
  ["Pass", "3", "4", "5", "6", "Partner's Best Card", "Going Alone"].includes(
    a
  );
const isTrump = (a: any): a is Trump =>
  ["Clubs", "Diamonds", "Hearts", "High", "Low", "Spades"].includes(a);

export const determineIfPhaseIsLegal = (phase: Phase): [boolean, string] => {
  if (phase.teams.length !== 2) {
    return [false, "Team lengths were not two"];
  }
  const players: Player[] = phase.teams[0].players.concat(
    phase.teams[1].players
  );
  if (
    phase.name !== "Trick-Taking" &&
    !players.every((player) => player.hand.length === 6)
  ) {
    return [
      false,
      "Not all players have 6 cards in their hands each even though we aren't in the Trick-Taking Phase yet.",
    ];
  }
  const cardsInHandsOfPlayers: Card[] = players.reduce(
    (accumulator, currentValue) => accumulator.concat(currentValue.hand),
    [] as Card[]
  );
  const doesEachFinishedTrickHaveOnlyOneCardFromEachOwner =
    phase.name === "Trick-Taking"
      ? phase.finishedTricks.every(
          (trick) =>
            [...new Set(trick.map((upCard) => upCard.owner))].length ===
            trick.length
        ) &&
        [...new Set(phase.currentTrick.map((upCard) => upCard.owner))]
          .length === phase.currentTrick.length
      : true;
  if (!doesEachFinishedTrickHaveOnlyOneCardFromEachOwner) {
    return [false, "One of the "];
  }
  const cardsInPlay: Card[] =
    phase.name === "Trick-Taking"
      ? phase.finishedTricks
          .flatMap((trick) => trick.map(({ card }) => card))
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
  if ([...new Set(players.map((player) => player.position))].length !== 4) {
    return [false, "At least two of the players are sharing the same seat."];
  }
  if (
    !phase.teams.every((team) => {
      const positions = team.players.map((player) => player.position);
      return (
        (positions.includes("1") && positions.includes("3")) ||
        (positions.includes("2") && positions.includes("4"))
      );
    })
  ) {
    return [
      false,
      "Players of the same team are not sitting opposite each other.",
    ];
  }
  return [true, "No issue detected"];
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
