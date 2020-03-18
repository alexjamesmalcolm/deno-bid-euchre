import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { determineIfPhaseIsLegal, BiddingPhase } from "./index.ts";

Deno.test(function shouldBeIllegalToHaveThreeTeams() {
  const phase: BiddingPhase = {
    name: "Bidding",
    bidPosition: "2",
    bids: [],
    dealer: "1",
    leader: "1",
    teams: [
      {
        players: [
          { name: "Serena", hand: [], position: "1" },
          { name: "Noodle", hand: [], position: "3" }
        ],
        points: 0
      },
      {
        players: [
          { name: "Larry", hand: [], position: "3" },
          { name: "Julia", hand: [], position: "4" }
        ],
        points: 0
      },
      { players: [], points: 0 }
    ]
  };
  const isPhaseLegal = determineIfPhaseIsLegal(phase);
  assertEquals(isPhaseLegal, false);
});

Deno.test(function shouldBeLegalToHaveTwoTeams() {
  const phase: BiddingPhase = {
    name: "Bidding",
    bidPosition: "2",
    bids: [],
    dealer: "1",
    leader: "1",
    teams: [
      {
        players: [
          { name: "Serena", hand: [], position: "1" },
          { name: "Noodle", hand: [], position: "3" }
        ],
        points: 0
      },
      {
        players: [
          { name: "Larry", hand: [], position: "2" },
          { name: "Julia", hand: [], position: "4" }
        ],
        points: 0
      }
    ]
  };
  const isPhaseLegal = determineIfPhaseIsLegal(phase);
  assertEquals(isPhaseLegal, true);
});

Deno.test(function shouldBeIllegalForTwoPlayersToShareTheSamePosition() {
  const phase: BiddingPhase = {
    name: "Bidding",
    bidPosition: "2",
    bids: [],
    dealer: "1",
    leader: "1",
    teams: [
      {
        players: [
          { name: "Serena", hand: [], position: "1" },
          { name: "Noodle", hand: [], position: "1" }
        ],
        points: 0
      },
      {
        players: [
          { name: "Larry", hand: [], position: "3" },
          { name: "Julia", hand: [], position: "4" }
        ],
        points: 0
      }
    ]
  };
  const isPhaseLegal = determineIfPhaseIsLegal(phase);
  assertEquals(isPhaseLegal, false);
});

Deno.test(function shouldBeIllegalForPlayersToNotHaveOppositePositions() {
  const phase: BiddingPhase = {
    name: "Bidding",
    bidPosition: "2",
    bids: [],
    dealer: "1",
    leader: "1",
    teams: [
      {
        players: [
          { name: "Serena", hand: [], position: "1" },
          { name: "Noodle", hand: [], position: "2" }
        ],
        points: 0
      },
      {
        players: [
          { name: "Larry", hand: [], position: "3" },
          { name: "Julia", hand: [], position: "4" }
        ],
        points: 0
      }
    ]
  };
  const isPhaseLegal = determineIfPhaseIsLegal(phase);
  assertEquals(isPhaseLegal, false);
});

/**
 * 1) We'll design what a game state should look like, things to consider in bid are: 4 players, 2 teams, define the phases, shuffling, dealing, tricks
 * 2) We're going to test if we can get options for a particular game state
 * 3a) We're going to test if we can get the altered state once a player selects and option
 * 3b) We'll also be testing if the state that was selected by a player is one of the currently valid choses
 */

// Deno.test({
//   name: "Test first move",
//   fn(): void {
//     const state: State = [
//       ["", "", ""],
//       ["", "", ""],
//       ["", "", ""]
//     ];
//     const expectedOptions: Option[] = [
//       { x: 0, y: 0, mark: "X" },
//       { x: 1, y: 0, mark: "X" },
//       { x: 2, y: 0, mark: "X" },
//       { x: 0, y: 1, mark: "X" },
//       { x: 1, y: 1, mark: "X" },
//       { x: 2, y: 1, mark: "X" },
//       { x: 0, y: 2, mark: "X" },
//       { x: 1, y: 2, mark: "X" },
//       { x: 2, y: 2, mark: "X" }
//     ];
//     const actualOptions = getOptions(state);
//     assertEquals(actualOptions, expectedOptions);
//   }
// });
