import {
  Card,
  PartnersBestCardPickingPhase,
  TrickTakingPhase,
  PlayerPosition,
  Team,
  Player,
} from "../definitions.ts";
import FixedLengthArray from "../FixedLengthArray.ts";
import { getNextPosition, getPositionOfPartner } from "../utils.ts";

export const chooseOptionForPickingPartnersBestCardPhase = (
  option: Card,
  phase: PartnersBestCardPickingPhase
): TrickTakingPhase => {
  const positionOfPlayerWhoIsPlayingWithoutPartner: PlayerPosition = getPositionOfPartner(
    phase.partner
  );
  const mapTeam = (team: Team): Team => {
    const isTeamTheBidWinner = team.players.some(
      (player) => player.position === phase.partner
    );
    const mapPlayer = (player: Player): Player => {
      const isPlayerSolo =
        player.position === positionOfPlayerWhoIsPlayingWithoutPartner;
      const changedPlayer: Player = isPlayerSolo
        ? { ...player, hand: player.hand.concat([option]) }
        : {
            ...player,
            hand: player.hand.filter(
              (card) => card.rank !== option.rank && card.suit !== option.suit
            ),
          };
      return changedPlayer;
    };
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
  const teams: FixedLengthArray<[Team, Team]> = [
    mapTeam(phase.teams[0]),
    mapTeam(phase.teams[1]),
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
    cardPosition: getNextPosition(phase.dealer),
  };
};
