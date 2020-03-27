import {
  assertEquals,
  assertArrayContains
} from "https://deno.land/std/testing/asserts.ts";
import {
  determineIfPhaseIsLegal,
  BiddingPhase,
  isLegalOption,
  getOptions,
  BidChoice,
  chooseOption,
  TrumpPickingPhase,
  TrickTakingPhase,
  Option,
  PlayerPosition,
  Team,
  Bid,
  Card
} from "./index.ts";
import FixedLengthArray from "./FixedLengthArray.ts";

Deno.test(function shouldBeIllegalToHaveThreeTeams() {
  const phase: BiddingPhase = {
    name: "Bidding",
    bidPosition: "2",
    bids: [],
    dealer: "1",
    teams: [
      {
        players: [
          {
            name: "Serena",
            hand: [
              { rank: "9", suit: "Clubs" },
              { rank: "10", suit: "Clubs" },
              { rank: "Jack", suit: "Clubs" },
              { rank: "Queen", suit: "Clubs" },
              { rank: "King", suit: "Clubs" },
              { rank: "Ace", suit: "Clubs" }
            ],
            position: "1"
          },
          {
            name: "Noodle",
            hand: [
              { rank: "9", suit: "Diamonds" },
              { rank: "10", suit: "Diamonds" },
              { rank: "Jack", suit: "Diamonds" },
              { rank: "Queen", suit: "Diamonds" },
              { rank: "King", suit: "Diamonds" },
              { rank: "Ace", suit: "Diamonds" }
            ],
            position: "3"
          }
        ],
        points: 0
      },
      {
        players: [
          {
            name: "Larry",
            hand: [
              { rank: "9", suit: "Hearts" },
              { rank: "10", suit: "Hearts" },
              { rank: "Jack", suit: "Hearts" },
              { rank: "Queen", suit: "Hearts" },
              { rank: "King", suit: "Hearts" },
              { rank: "Ace", suit: "Hearts" }
            ],
            position: "3"
          },
          {
            name: "Julia",
            hand: [
              { rank: "9", suit: "Spades" },
              { rank: "10", suit: "Spades" },
              { rank: "Jack", suit: "Spades" },
              { rank: "Queen", suit: "Spades" },
              { rank: "King", suit: "Spades" },
              { rank: "Ace", suit: "Spades" }
            ],
            position: "4"
          }
        ],
        points: 0
      }
    ]
  };
  const [isPhaseLegal] = determineIfPhaseIsLegal(phase);
  assertEquals(isPhaseLegal, false);
});

Deno.test(function shouldBeLegalToHaveTwoTeams() {
  const phase: BiddingPhase = {
    name: "Bidding",
    bidPosition: "2",
    bids: [],
    dealer: "1",
    teams: [
      {
        players: [
          {
            name: "Serena",
            hand: [
              { rank: "9", suit: "Clubs" },
              { rank: "10", suit: "Clubs" },
              { rank: "Jack", suit: "Clubs" },
              { rank: "Queen", suit: "Clubs" },
              { rank: "King", suit: "Clubs" },
              { rank: "Ace", suit: "Clubs" }
            ],
            position: "1"
          },
          {
            name: "Noodle",
            hand: [
              { rank: "9", suit: "Diamonds" },
              { rank: "10", suit: "Diamonds" },
              { rank: "Jack", suit: "Diamonds" },
              { rank: "Queen", suit: "Diamonds" },
              { rank: "King", suit: "Diamonds" },
              { rank: "Ace", suit: "Diamonds" }
            ],
            position: "3"
          }
        ],
        points: 0
      },
      {
        players: [
          {
            name: "Larry",
            hand: [
              { rank: "9", suit: "Hearts" },
              { rank: "10", suit: "Hearts" },
              { rank: "Jack", suit: "Hearts" },
              { rank: "Queen", suit: "Hearts" },
              { rank: "King", suit: "Hearts" },
              { rank: "Ace", suit: "Hearts" }
            ],
            position: "2"
          },
          {
            name: "Julia",
            hand: [
              { rank: "9", suit: "Spades" },
              { rank: "10", suit: "Spades" },
              { rank: "Jack", suit: "Spades" },
              { rank: "Queen", suit: "Spades" },
              { rank: "King", suit: "Spades" },
              { rank: "Ace", suit: "Spades" }
            ],
            position: "4"
          }
        ],
        points: 0
      }
    ]
  };
  const [isPhaseLegal] = determineIfPhaseIsLegal(phase);
  assertEquals(isPhaseLegal, true);
});

Deno.test(function shouldBeIllegalForTwoPlayersToShareTheSamePosition() {
  const phase: BiddingPhase = {
    name: "Bidding",
    bidPosition: "2",
    bids: [],
    dealer: "1",
    teams: [
      {
        players: [
          {
            name: "Serena",
            hand: [
              { rank: "9", suit: "Clubs" },
              { rank: "10", suit: "Clubs" },
              { rank: "Jack", suit: "Clubs" },
              { rank: "Queen", suit: "Clubs" },
              { rank: "King", suit: "Clubs" },
              { rank: "Ace", suit: "Clubs" }
            ],
            position: "1"
          },
          {
            name: "Noodle",
            hand: [
              { rank: "9", suit: "Diamonds" },
              { rank: "10", suit: "Diamonds" },
              { rank: "Jack", suit: "Diamonds" },
              { rank: "Queen", suit: "Diamonds" },
              { rank: "King", suit: "Diamonds" },
              { rank: "Ace", suit: "Diamonds" }
            ],
            position: "1"
          }
        ],
        points: 0
      },
      {
        players: [
          {
            name: "Larry",
            hand: [
              { rank: "9", suit: "Hearts" },
              { rank: "10", suit: "Hearts" },
              { rank: "Jack", suit: "Hearts" },
              { rank: "Queen", suit: "Hearts" },
              { rank: "King", suit: "Hearts" },
              { rank: "Ace", suit: "Hearts" }
            ],
            position: "3"
          },
          {
            name: "Julia",
            hand: [
              { rank: "9", suit: "Spades" },
              { rank: "10", suit: "Spades" },
              { rank: "Jack", suit: "Spades" },
              { rank: "Queen", suit: "Spades" },
              { rank: "King", suit: "Spades" },
              { rank: "Ace", suit: "Spades" }
            ],
            position: "4"
          }
        ],
        points: 0
      }
    ]
  };
  const [isPhaseLegal] = determineIfPhaseIsLegal(phase);
  assertEquals(isPhaseLegal, false);
});

Deno.test(function shouldBeIllegalForPlayersToNotHaveOppositePositions() {
  const phase: BiddingPhase = {
    name: "Bidding",
    bidPosition: "2",
    bids: [],
    dealer: "1",
    teams: [
      {
        players: [
          {
            name: "Serena",
            hand: [
              { rank: "9", suit: "Clubs" },
              { rank: "10", suit: "Clubs" },
              { rank: "Jack", suit: "Clubs" },
              { rank: "Queen", suit: "Clubs" },
              { rank: "King", suit: "Clubs" },
              { rank: "Ace", suit: "Clubs" }
            ],
            position: "1"
          },
          {
            name: "Noodle",
            hand: [
              { rank: "9", suit: "Diamonds" },
              { rank: "10", suit: "Diamonds" },
              { rank: "Jack", suit: "Diamonds" },
              { rank: "Queen", suit: "Diamonds" },
              { rank: "King", suit: "Diamonds" },
              { rank: "Ace", suit: "Diamonds" }
            ],
            position: "2"
          }
        ],
        points: 0
      },
      {
        players: [
          {
            name: "Larry",
            hand: [
              { rank: "9", suit: "Hearts" },
              { rank: "10", suit: "Hearts" },
              { rank: "Jack", suit: "Hearts" },
              { rank: "Queen", suit: "Hearts" },
              { rank: "King", suit: "Hearts" },
              { rank: "Ace", suit: "Hearts" }
            ],
            position: "3"
          },
          {
            name: "Julia",
            hand: [
              { rank: "9", suit: "Spades" },
              { rank: "10", suit: "Spades" },
              { rank: "Jack", suit: "Spades" },
              { rank: "Queen", suit: "Spades" },
              { rank: "King", suit: "Spades" },
              { rank: "Ace", suit: "Spades" }
            ],
            position: "4"
          }
        ],
        points: 0
      }
    ]
  };
  const [isPhaseLegal] = determineIfPhaseIsLegal(phase);
  assertEquals(isPhaseLegal, false);
});

Deno.test(function shouldBeIllegalForDealerToPassWhenEveryoneElseHasPassed() {
  const dealerPosition = "4";
  const phase: BiddingPhase = {
    name: "Bidding",
    bidPosition: dealerPosition,
    dealer: dealerPosition,
    bids: [
      { playerPosition: "1", choice: "Pass" },
      { playerPosition: "2", choice: "Pass" },
      { playerPosition: "3", choice: "Pass" }
    ],
    teams: [
      {
        players: [
          {
            name: "Serena",
            hand: [
              { rank: "9", suit: "Clubs" },
              { rank: "10", suit: "Clubs" },
              { rank: "Jack", suit: "Clubs" },
              { rank: "Queen", suit: "Clubs" },
              { rank: "King", suit: "Clubs" },
              { rank: "Ace", suit: "Clubs" }
            ],
            position: "1"
          },
          {
            name: "Noodle",
            hand: [
              { rank: "9", suit: "Clubs" },
              { rank: "10", suit: "Clubs" },
              { rank: "Jack", suit: "Clubs" },
              { rank: "Queen", suit: "Clubs" },
              { rank: "King", suit: "Clubs" },
              { rank: "Ace", suit: "Clubs" }
            ],
            position: "3"
          }
        ],
        points: 0
      },
      {
        players: [
          {
            name: "Larry",
            hand: [
              { rank: "9", suit: "Clubs" },
              { rank: "10", suit: "Clubs" },
              { rank: "Jack", suit: "Clubs" },
              { rank: "Queen", suit: "Clubs" },
              { rank: "King", suit: "Clubs" },
              { rank: "Ace", suit: "Clubs" }
            ],
            position: "2"
          },
          {
            name: "Julia",
            hand: [
              { rank: "9", suit: "Clubs" },
              { rank: "10", suit: "Clubs" },
              { rank: "Jack", suit: "Clubs" },
              { rank: "Queen", suit: "Clubs" },
              { rank: "King", suit: "Clubs" },
              { rank: "Ace", suit: "Clubs" }
            ],
            position: "4"
          }
        ],
        points: 0
      }
    ]
  };
  const isLegal = isLegalOption("Pass", phase, dealerPosition);
  assertEquals(isLegal, false);
});

Deno.test(function shouldHaveDealerBeAbleToSelectAnyChoiceExceptPass() {
  const dealerPosition = "4";
  const phase: BiddingPhase = {
    name: "Bidding",
    bidPosition: dealerPosition,
    dealer: dealerPosition,
    bids: [
      { playerPosition: "1", choice: "Pass" },
      { playerPosition: "2", choice: "Pass" },
      { playerPosition: "3", choice: "Pass" }
    ],
    teams: [
      {
        players: [
          {
            name: "Serena",
            hand: [
              { rank: "9", suit: "Clubs" },
              { rank: "10", suit: "Clubs" },
              { rank: "Jack", suit: "Clubs" },
              { rank: "Queen", suit: "Clubs" },
              { rank: "King", suit: "Clubs" },
              { rank: "Ace", suit: "Clubs" }
            ],
            position: "1"
          },
          {
            name: "Noodle",
            hand: [
              { rank: "9", suit: "Diamonds" },
              { rank: "10", suit: "Diamonds" },
              { rank: "Jack", suit: "Diamonds" },
              { rank: "Queen", suit: "Diamonds" },
              { rank: "King", suit: "Diamonds" },
              { rank: "Ace", suit: "Diamonds" }
            ],
            position: "3"
          }
        ],
        points: 0
      },
      {
        players: [
          {
            name: "Larry",
            hand: [
              { rank: "9", suit: "Hearts" },
              { rank: "10", suit: "Hearts" },
              { rank: "Jack", suit: "Hearts" },
              { rank: "Queen", suit: "Hearts" },
              { rank: "King", suit: "Hearts" },
              { rank: "Ace", suit: "Hearts" }
            ],
            position: "2"
          },
          {
            name: "Julia",
            hand: [
              { rank: "9", suit: "Spades" },
              { rank: "10", suit: "Spades" },
              { rank: "Jack", suit: "Spades" },
              { rank: "Queen", suit: "Spades" },
              { rank: "King", suit: "Spades" },
              { rank: "Ace", suit: "Spades" }
            ],
            position: "4"
          }
        ],
        points: 0
      }
    ]
  };
  const legalOptions = getOptions(phase, dealerPosition);
  const expectedBidChoices: BidChoice[] = [
    "3",
    "4",
    "5",
    "6",
    "Partner's Best Card",
    "Going Alone"
  ];
  assertArrayContains(legalOptions, expectedBidChoices);
});

Deno.test(function shouldBeAbleToPickClubsAsTrump() {
  const bidWinner: PlayerPosition = "2";
  const dealerPosition: PlayerPosition = "1";
  const teams: FixedLengthArray<[Team, Team]> = [
    {
      players: [
        {
          name: "Serena",
          hand: [
            { rank: "9", suit: "Clubs" },
            { rank: "10", suit: "Clubs" },
            { rank: "Jack", suit: "Clubs" },
            { rank: "Queen", suit: "Clubs" },
            { rank: "King", suit: "Clubs" },
            { rank: "Ace", suit: "Clubs" }
          ],
          position: "1"
        },
        {
          name: "Noodle",
          hand: [
            { rank: "9", suit: "Diamonds" },
            { rank: "10", suit: "Diamonds" },
            { rank: "Jack", suit: "Diamonds" },
            { rank: "Queen", suit: "Diamonds" },
            { rank: "King", suit: "Diamonds" },
            { rank: "Ace", suit: "Diamonds" }
          ],
          position: "3"
        }
      ],
      points: 0
    },
    {
      players: [
        {
          name: "Larry",
          hand: [
            { rank: "9", suit: "Hearts" },
            { rank: "10", suit: "Hearts" },
            { rank: "Jack", suit: "Hearts" },
            { rank: "Queen", suit: "Hearts" },
            { rank: "King", suit: "Hearts" },
            { rank: "Ace", suit: "Hearts" }
          ],
          position: "2"
        },
        {
          name: "Julia",
          hand: [
            { rank: "9", suit: "Spades" },
            { rank: "10", suit: "Spades" },
            { rank: "Jack", suit: "Spades" },
            { rank: "Queen", suit: "Spades" },
            { rank: "King", suit: "Spades" },
            { rank: "Ace", suit: "Spades" }
          ],
          position: "4"
        }
      ],
      points: 0
    }
  ];
  const winningBid: Bid = { choice: "3", playerPosition: bidWinner };
  const phase: TrumpPickingPhase = {
    name: "Picking Trump",
    dealer: dealerPosition,
    winningBid,
    teams
  };
  const option: Option = "Clubs";
  const actualPhase = chooseOption(option, phase, bidWinner);
  const expectedPhase: TrickTakingPhase = {
    name: "Trick-Taking",
    cardPosition: "2",
    currentTrick: [],
    dealer: dealerPosition,
    finishedTricks: [],
    winningBid,
    teams,
    trump: "Clubs"
  };
  assertEquals(actualPhase, expectedPhase);
});

Deno.test(function shouldBeIllegalToHaveNoCardsInHandsInBiddingPhase() {
  const phase: BiddingPhase = {
    name: "Bidding",
    bidPosition: "2",
    dealer: "1",
    bids: [],
    teams: [
      {
        players: [
          { hand: [], name: "Noodle", position: "1" },
          { hand: [], name: "Serena", position: "3" }
        ],
        points: 0
      },
      {
        players: [
          { hand: [], name: "Julia", position: "2" },
          { hand: [], name: "Christa", position: "4" }
        ],
        points: 0
      }
    ]
  };
  const [isLegal] = determineIfPhaseIsLegal(phase);
  assertEquals(isLegal, false);
});

Deno.test(function shouldBeIllegalToHaveDuplicateCards() {
  const phase: BiddingPhase = {
    name: "Bidding",
    bidPosition: "2",
    bids: [],
    dealer: "1",
    teams: [
      {
        players: [
          {
            name: "Serena",
            hand: [
              { rank: "10", suit: "Clubs" },
              { rank: "10", suit: "Clubs" },
              { rank: "10", suit: "Clubs" },
              { rank: "10", suit: "Clubs" },
              { rank: "10", suit: "Clubs" },
              { rank: "10", suit: "Clubs" }
            ],
            position: "1"
          },
          {
            name: "Noodle",
            hand: [
              { rank: "10", suit: "Clubs" },
              { rank: "10", suit: "Clubs" },
              { rank: "10", suit: "Clubs" },
              { rank: "10", suit: "Clubs" },
              { rank: "10", suit: "Clubs" },
              { rank: "10", suit: "Clubs" }
            ],
            position: "3"
          }
        ],
        points: 0
      },
      {
        players: [
          {
            name: "Larry",
            hand: [
              { rank: "10", suit: "Clubs" },
              { rank: "10", suit: "Clubs" },
              { rank: "10", suit: "Clubs" },
              { rank: "10", suit: "Clubs" },
              { rank: "10", suit: "Clubs" },
              { rank: "10", suit: "Clubs" }
            ],
            position: "2"
          },
          {
            name: "Julia",
            hand: [
              { rank: "10", suit: "Clubs" },
              { rank: "10", suit: "Clubs" },
              { rank: "10", suit: "Clubs" },
              { rank: "10", suit: "Clubs" },
              { rank: "10", suit: "Clubs" },
              { rank: "10", suit: "Clubs" }
            ],
            position: "4"
          }
        ],
        points: 0
      }
    ]
  };
  const [isLegal] = determineIfPhaseIsLegal(phase);
  assertEquals(isLegal, false);
});

Deno.test(function shouldBeLegalToHaveOneCardInTrickTakingPhase() {
  const phase: TrickTakingPhase = {
    name: "Trick-Taking",
    teams: [
      {
        players: [
          {
            hand: [{ rank: "9", suit: "Clubs" }],
            name: "Serena",
            position: "1"
          },
          {
            hand: [{ rank: "9", suit: "Diamonds" }],
            name: "Noodle",
            position: "3"
          }
        ],
        points: 0
      },
      {
        players: [
          {
            hand: [{ rank: "9", suit: "Hearts" }],
            name: "Serena",
            position: "2"
          },
          {
            hand: [{ rank: "9", suit: "Spades" }],
            name: "Serena",
            position: "4"
          }
        ],
        points: 0
      }
    ],
    dealer: "1",
    cardPosition: "2",
    currentTrick: [],
    finishedTricks: [
      [
        { card: { rank: "10", suit: "Clubs" }, owner: "1" },
        { card: { rank: "Jack", suit: "Clubs" }, owner: "1" },
        { card: { rank: "Queen", suit: "Clubs" }, owner: "1" },
        { card: { rank: "King", suit: "Clubs" }, owner: "1" }
      ],
      [
        { card: { rank: "Ace", suit: "Clubs" }, owner: "1" },
        { card: { rank: "10", suit: "Diamonds" }, owner: "1" },
        { card: { rank: "Jack", suit: "Diamonds" }, owner: "1" },
        { card: { rank: "Queen", suit: "Diamonds" }, owner: "1" }
      ],
      [
        { card: { rank: "King", suit: "Diamonds" }, owner: "1" },
        { card: { rank: "Ace", suit: "Diamonds" }, owner: "1" },
        { card: { rank: "10", suit: "Hearts" }, owner: "1" },
        { card: { rank: "Jack", suit: "Hearts" }, owner: "1" }
      ],
      [
        { card: { rank: "Queen", suit: "Hearts" }, owner: "1" },
        { card: { rank: "King", suit: "Hearts" }, owner: "1" },
        { card: { rank: "Ace", suit: "Hearts" }, owner: "1" },
        { card: { rank: "10", suit: "Spades" }, owner: "1" }
      ],
      [
        { card: { rank: "Jack", suit: "Spades" }, owner: "1" },
        { card: { rank: "Queen", suit: "Spades" }, owner: "1" },
        { card: { rank: "King", suit: "Spades" }, owner: "1" },
        { card: { rank: "Ace", suit: "Spades" }, owner: "1" }
      ]
    ],
    trump: "Clubs",
    winningBid: { choice: "3", playerPosition: "2" }
  };
  const [isLegal, reason] = determineIfPhaseIsLegal(phase);
  assertEquals(isLegal, true, reason);
});

Deno.test(function shouldReturnBiddingPhaseOnceLastTrickIsTaken() {
  const currentPlayer = "1";
  const lastCard: Card = { rank: "Ace", suit: "Clubs" };
  const phase: TrickTakingPhase = {
    name: "Trick-Taking",
    trump: "High",
    winningBid: { choice: "4", playerPosition: "2" },
    teams: [
      {
        points: 0,
        players: [
          { name: "Serena", position: "2", hand: [] },
          { name: "Noodle", hand: [], position: "4" }
        ]
      },
      {
        points: 0,
        players: [
          { name: "Julia", position: "1", hand: [lastCard] },
          { name: "Larry", position: "3", hand: [] }
        ]
      }
    ],
    currentTrick: [
      { card: { rank: "9", suit: "Clubs" }, owner: "2" },
      { card: { rank: "10", suit: "Clubs" }, owner: "3" },
      { card: { rank: "Jack", suit: "Clubs" }, owner: "4" }
    ],
    finishedTricks: [
      [
        { card: { rank: "Queen", suit: "Clubs" }, owner: "1" },
        { card: { rank: "King", suit: "Clubs" }, owner: "1" },
        { card: { rank: "9", suit: "Diamonds" }, owner: "1" },
        { card: { rank: "10", suit: "Diamonds" }, owner: "1" }
      ],
      [
        { card: { rank: "Jack", suit: "Diamonds" }, owner: "1" },
        { card: { rank: "Queen", suit: "Diamonds" }, owner: "1" },
        { card: { rank: "King", suit: "Diamonds" }, owner: "1" },
        { card: { rank: "Ace", suit: "Diamonds" }, owner: "1" }
      ],
      [
        { card: { rank: "9", suit: "Spades" }, owner: "1" },
        { card: { rank: "10", suit: "Spades" }, owner: "1" },
        { card: { rank: "Jack", suit: "Spades" }, owner: "1" },
        { card: { rank: "Queen", suit: "Spades" }, owner: "1" }
      ],
      [
        { card: { rank: "King", suit: "Spades" }, owner: "1" },
        { card: { rank: "Ace", suit: "Spades" }, owner: "1" },
        { card: { rank: "9", suit: "Hearts" }, owner: "1" },
        { card: { rank: "10", suit: "Hearts" }, owner: "1" }
      ],
      [
        { card: { rank: "Jack", suit: "Hearts" }, owner: "1" },
        { card: { rank: "Queen", suit: "Hearts" }, owner: "1" },
        { card: { rank: "King", suit: "Hearts" }, owner: "1" },
        { card: { rank: "Ace", suit: "Hearts" }, owner: "1" }
      ]
    ],
    cardPosition: currentPlayer,
    dealer: currentPlayer
  };
  const [isLegal, reason] = determineIfPhaseIsLegal(phase);
  assertEquals(isLegal, true, reason);
  const options = getOptions(phase, "1");
  const nextPhase = chooseOption(options[0], phase, currentPlayer);
  assertEquals(nextPhase.name, "Bidding");
});

/*
Test winning a trick
Test placing a card in a trick
Test the last trick being taken
Test the game finishing
 */

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
