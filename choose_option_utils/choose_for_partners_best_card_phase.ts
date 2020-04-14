import {
  Card,
  PartnersBestCardPickingPhase,
  TrickTakingPhase,
  PlayerPosition,
  Team,
  Player,
} from "../definitions.ts";
import FixedLengthArray from "../FixedLengthArray.ts";
import {
  getNextPosition,
  getPositionOfPartner,
  isSameCard,
  getPlayerByPosition,
} from "../utils.ts";

export const chooseOptionForPickingPartnersBestCardPhase = (
  option: Card,
  phase: PartnersBestCardPickingPhase,
  currentPlayer: PlayerPosition,
): TrickTakingPhase | PartnersBestCardPickingPhase => {
  const partnerPosition: PlayerPosition = phase.partner;
  const lonelyPlayerPosition: PlayerPosition = getPositionOfPartner(
    partnerPosition,
  );
  const hasLonelyPlayerAlreadyDiscardedACard =
    getPlayerByPosition(lonelyPlayerPosition, phase).hand.length === 5;
  const mapPlayer = (player: Player): Player => ({
    ...player,
    hand: player.position === currentPlayer
      ? player.hand.filter((card) => !isSameCard(card, option))
      : player.hand.concat([option]),
  });
  const mapTeam = (team: Team): Team => {
    const isTeamTheBidWinner = team.players.some(
      (player) => player.position === phase.partner,
    );
    if (isTeamTheBidWinner) {
      const result: Team = {
        ...team,
        players: [mapPlayer(team.players[0]), mapPlayer(team.players[1])],
      };
      return result;
    } else {
      return team;
    }
  };
  if (hasLonelyPlayerAlreadyDiscardedACard) {
    return {
      name: "Trick-Taking",
      playerSittingOut: phase.partner,
      dealer: phase.dealer,
      teams: [mapTeam(phase.teams[0]), mapTeam(phase.teams[1])],
      winningBid: phase.winningBid,
      trump: phase.trump,
      currentTrick: [],
      finishedTricks: [],
      cardPosition: getNextPosition(phase.dealer),
    };
  } else {
    return {
      ...phase,
      teams: [mapTeam(phase.teams[0]), mapTeam(phase.teams[1])],
    };
  }
};
