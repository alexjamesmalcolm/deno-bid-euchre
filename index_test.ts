import {
  assertEquals,
  assertArrayContains,
  fail,
  assertNotEquals,
} from "https://deno.land/std/testing/asserts.ts";
import {
  determineIfPhaseIsLegal,
  isLegalOption,
  getOptions,
  chooseOption,
} from "./index.ts";
import {
  BiddingPhase,
  BidChoice,
  PlayerPosition,
  Team,
  Bid,
  TrumpPickingPhase,
  Option,
  TrickTakingPhase,
  Card,
  Trump,
  PartnersBestCardPickingPhase,
  Player,
} from "./definitions.ts";

Deno.test({
  name: "Should be illegal to have three teams",
  fn: () => {
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
                { rank: "Ace", suit: "Clubs" },
              ],
              position: "1",
            },
            {
              name: "Noodle",
              hand: [
                { rank: "9", suit: "Diamonds" },
                { rank: "10", suit: "Diamonds" },
                { rank: "Jack", suit: "Diamonds" },
                { rank: "Queen", suit: "Diamonds" },
                { rank: "King", suit: "Diamonds" },
                { rank: "Ace", suit: "Diamonds" },
              ],
              position: "3",
            },
          ],
          points: 0,
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
                { rank: "Ace", suit: "Hearts" },
              ],
              position: "3",
            },
            {
              name: "Julia",
              hand: [
                { rank: "9", suit: "Spades" },
                { rank: "10", suit: "Spades" },
                { rank: "Jack", suit: "Spades" },
                { rank: "Queen", suit: "Spades" },
                { rank: "King", suit: "Spades" },
                { rank: "Ace", suit: "Spades" },
              ],
              position: "4",
            },
          ],
          points: 0,
        },
      ],
    };
    const [isPhaseLegal] = determineIfPhaseIsLegal(phase);
    assertEquals(isPhaseLegal, false);
  },
});

Deno.test({
  name: "Should be legal to have two teams",
  fn: () => {
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
                { rank: "Ace", suit: "Clubs" },
              ],
              position: "1",
            },
            {
              name: "Noodle",
              hand: [
                { rank: "9", suit: "Diamonds" },
                { rank: "10", suit: "Diamonds" },
                { rank: "Jack", suit: "Diamonds" },
                { rank: "Queen", suit: "Diamonds" },
                { rank: "King", suit: "Diamonds" },
                { rank: "Ace", suit: "Diamonds" },
              ],
              position: "3",
            },
          ],
          points: 0,
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
                { rank: "Ace", suit: "Hearts" },
              ],
              position: "2",
            },
            {
              name: "Julia",
              hand: [
                { rank: "9", suit: "Spades" },
                { rank: "10", suit: "Spades" },
                { rank: "Jack", suit: "Spades" },
                { rank: "Queen", suit: "Spades" },
                { rank: "King", suit: "Spades" },
                { rank: "Ace", suit: "Spades" },
              ],
              position: "4",
            },
          ],
          points: 0,
        },
      ],
    };
    const [isPhaseLegal] = determineIfPhaseIsLegal(phase);
    assertEquals(isPhaseLegal, true);
  },
});

Deno.test(
  {
    name: "Should be illegal for two players to share the same position",
    fn: () => {
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
                  { rank: "Ace", suit: "Clubs" },
                ],
                position: "1",
              },
              {
                name: "Noodle",
                hand: [
                  { rank: "9", suit: "Diamonds" },
                  { rank: "10", suit: "Diamonds" },
                  { rank: "Jack", suit: "Diamonds" },
                  { rank: "Queen", suit: "Diamonds" },
                  { rank: "King", suit: "Diamonds" },
                  { rank: "Ace", suit: "Diamonds" },
                ],
                position: "1",
              },
            ],
            points: 0,
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
                  { rank: "Ace", suit: "Hearts" },
                ],
                position: "3",
              },
              {
                name: "Julia",
                hand: [
                  { rank: "9", suit: "Spades" },
                  { rank: "10", suit: "Spades" },
                  { rank: "Jack", suit: "Spades" },
                  { rank: "Queen", suit: "Spades" },
                  { rank: "King", suit: "Spades" },
                  { rank: "Ace", suit: "Spades" },
                ],
                position: "4",
              },
            ],
            points: 0,
          },
        ],
      };
      const [isPhaseLegal] = determineIfPhaseIsLegal(phase);
      assertEquals(isPhaseLegal, false);
    },
  },
);

Deno.test(
  {
    name: "Should be illegal for players to not have opposite positions",
    fn: () => {
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
                  { rank: "Ace", suit: "Clubs" },
                ],
                position: "1",
              },
              {
                name: "Noodle",
                hand: [
                  { rank: "9", suit: "Diamonds" },
                  { rank: "10", suit: "Diamonds" },
                  { rank: "Jack", suit: "Diamonds" },
                  { rank: "Queen", suit: "Diamonds" },
                  { rank: "King", suit: "Diamonds" },
                  { rank: "Ace", suit: "Diamonds" },
                ],
                position: "2",
              },
            ],
            points: 0,
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
                  { rank: "Ace", suit: "Hearts" },
                ],
                position: "3",
              },
              {
                name: "Julia",
                hand: [
                  { rank: "9", suit: "Spades" },
                  { rank: "10", suit: "Spades" },
                  { rank: "Jack", suit: "Spades" },
                  { rank: "Queen", suit: "Spades" },
                  { rank: "King", suit: "Spades" },
                  { rank: "Ace", suit: "Spades" },
                ],
                position: "4",
              },
            ],
            points: 0,
          },
        ],
      };
      const [isPhaseLegal] = determineIfPhaseIsLegal(phase);
      assertEquals(isPhaseLegal, false);
    },
  },
);

Deno.test(
  {
    name: "Should be illegal for dealer to pass when everyone else has passed",
    fn: () => {
      const dealerPosition = "4";
      const phase: BiddingPhase = {
        name: "Bidding",
        bidPosition: dealerPosition,
        dealer: dealerPosition,
        bids: [
          { playerPosition: "1", choice: "Pass" },
          { playerPosition: "2", choice: "Pass" },
          { playerPosition: "3", choice: "Pass" },
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
                  { rank: "Ace", suit: "Clubs" },
                ],
                position: "1",
              },
              {
                name: "Noodle",
                hand: [
                  { rank: "9", suit: "Clubs" },
                  { rank: "10", suit: "Clubs" },
                  { rank: "Jack", suit: "Clubs" },
                  { rank: "Queen", suit: "Clubs" },
                  { rank: "King", suit: "Clubs" },
                  { rank: "Ace", suit: "Clubs" },
                ],
                position: "3",
              },
            ],
            points: 0,
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
                  { rank: "Ace", suit: "Clubs" },
                ],
                position: "2",
              },
              {
                name: "Julia",
                hand: [
                  { rank: "9", suit: "Clubs" },
                  { rank: "10", suit: "Clubs" },
                  { rank: "Jack", suit: "Clubs" },
                  { rank: "Queen", suit: "Clubs" },
                  { rank: "King", suit: "Clubs" },
                  { rank: "Ace", suit: "Clubs" },
                ],
                position: "4",
              },
            ],
            points: 0,
          },
        ],
      };
      const isLegal = isLegalOption("Pass", phase, dealerPosition);
      assertEquals(isLegal, false);
    },
  },
);

Deno.test(
  {
    name: "Should have dealer be able to select any choice except pass",
    fn: () => {
      const dealerPosition = "4";
      const phase: BiddingPhase = {
        name: "Bidding",
        bidPosition: dealerPosition,
        dealer: dealerPosition,
        bids: [
          { playerPosition: "1", choice: "Pass" },
          { playerPosition: "2", choice: "Pass" },
          { playerPosition: "3", choice: "Pass" },
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
                  { rank: "Ace", suit: "Clubs" },
                ],
                position: "1",
              },
              {
                name: "Noodle",
                hand: [
                  { rank: "9", suit: "Diamonds" },
                  { rank: "10", suit: "Diamonds" },
                  { rank: "Jack", suit: "Diamonds" },
                  { rank: "Queen", suit: "Diamonds" },
                  { rank: "King", suit: "Diamonds" },
                  { rank: "Ace", suit: "Diamonds" },
                ],
                position: "3",
              },
            ],
            points: 0,
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
                  { rank: "Ace", suit: "Hearts" },
                ],
                position: "2",
              },
              {
                name: "Julia",
                hand: [
                  { rank: "9", suit: "Spades" },
                  { rank: "10", suit: "Spades" },
                  { rank: "Jack", suit: "Spades" },
                  { rank: "Queen", suit: "Spades" },
                  { rank: "King", suit: "Spades" },
                  { rank: "Ace", suit: "Spades" },
                ],
                position: "4",
              },
            ],
            points: 0,
          },
        ],
      };
      const legalOptions = getOptions(phase, dealerPosition);
      const expectedBidChoices: BidChoice[] = [
        "3",
        "4",
        "5",
        "6",
        "Partner's Best Card",
        "Going Alone",
      ];
      assertArrayContains(legalOptions, expectedBidChoices);
    },
  },
);

Deno.test({
  name: "Should be able to pick clubs as trump",
  fn: () => {
    const bidWinner: PlayerPosition = "2";
    const dealerPosition: PlayerPosition = "1";
    const teams: [Team, Team] = [
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
              { rank: "Ace", suit: "Clubs" },
            ],
            position: "1",
          },
          {
            name: "Noodle",
            hand: [
              { rank: "9", suit: "Diamonds" },
              { rank: "10", suit: "Diamonds" },
              { rank: "Jack", suit: "Diamonds" },
              { rank: "Queen", suit: "Diamonds" },
              { rank: "King", suit: "Diamonds" },
              { rank: "Ace", suit: "Diamonds" },
            ],
            position: "3",
          },
        ],
        points: 0,
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
              { rank: "Ace", suit: "Hearts" },
            ],
            position: "2",
          },
          {
            name: "Julia",
            hand: [
              { rank: "9", suit: "Spades" },
              { rank: "10", suit: "Spades" },
              { rank: "Jack", suit: "Spades" },
              { rank: "Queen", suit: "Spades" },
              { rank: "King", suit: "Spades" },
              { rank: "Ace", suit: "Spades" },
            ],
            position: "4",
          },
        ],
        points: 0,
      },
    ];
    const winningBid: Bid = { choice: "3", playerPosition: bidWinner };
    const phase: TrumpPickingPhase = {
      name: "Picking Trump",
      dealer: dealerPosition,
      winningBid,
      teams,
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
      trump: "Clubs",
    };
    assertEquals(actualPhase, expectedPhase);
  },
});

Deno.test(
  {
    name: "Should be illegal to have no cards in hands in bidding phase",
    fn: () => {
      const phase: BiddingPhase = {
        name: "Bidding",
        bidPosition: "2",
        dealer: "1",
        bids: [],
        teams: [
          {
            players: [
              { hand: [], name: "Noodle", position: "1" },
              { hand: [], name: "Serena", position: "3" },
            ],
            points: 0,
          },
          {
            players: [
              { hand: [], name: "Julia", position: "2" },
              { hand: [], name: "Christa", position: "4" },
            ],
            points: 0,
          },
        ],
      };
      const [isLegal] = determineIfPhaseIsLegal(phase);
      assertEquals(isLegal, false);
    },
  },
);

Deno.test({
  name: "Should be illegal to have duplicate cards",
  fn: () => {
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
                { rank: "10", suit: "Clubs" },
              ],
              position: "1",
            },
            {
              name: "Noodle",
              hand: [
                { rank: "10", suit: "Clubs" },
                { rank: "10", suit: "Clubs" },
                { rank: "10", suit: "Clubs" },
                { rank: "10", suit: "Clubs" },
                { rank: "10", suit: "Clubs" },
                { rank: "10", suit: "Clubs" },
              ],
              position: "3",
            },
          ],
          points: 0,
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
                { rank: "10", suit: "Clubs" },
              ],
              position: "2",
            },
            {
              name: "Julia",
              hand: [
                { rank: "10", suit: "Clubs" },
                { rank: "10", suit: "Clubs" },
                { rank: "10", suit: "Clubs" },
                { rank: "10", suit: "Clubs" },
                { rank: "10", suit: "Clubs" },
                { rank: "10", suit: "Clubs" },
              ],
              position: "4",
            },
          ],
          points: 0,
        },
      ],
    };
    const [isLegal] = determineIfPhaseIsLegal(phase);
    assertEquals(isLegal, false);
  },
});

Deno.test(
  {
    name: "Should be legal to have one card in trick taking phase",
    fn: () => {
      const phase: TrickTakingPhase = {
        name: "Trick-Taking",
        teams: [
          {
            players: [
              {
                hand: [{ rank: "9", suit: "Clubs" }],
                name: "Serena",
                position: "1",
              },
              {
                hand: [{ rank: "9", suit: "Diamonds" }],
                name: "Noodle",
                position: "3",
              },
            ],
            points: 0,
          },
          {
            players: [
              {
                hand: [{ rank: "9", suit: "Hearts" }],
                name: "Serena",
                position: "2",
              },
              {
                hand: [{ rank: "9", suit: "Spades" }],
                name: "Serena",
                position: "4",
              },
            ],
            points: 0,
          },
        ],
        dealer: "1",
        cardPosition: "2",
        currentTrick: [],
        finishedTricks: [
          [
            { card: { rank: "10", suit: "Clubs" }, owner: "1" },
            { card: { rank: "Jack", suit: "Clubs" }, owner: "2" },
            { card: { rank: "Queen", suit: "Clubs" }, owner: "3" },
            { card: { rank: "King", suit: "Clubs" }, owner: "4" },
          ],
          [
            { card: { rank: "Ace", suit: "Clubs" }, owner: "1" },
            { card: { rank: "10", suit: "Diamonds" }, owner: "2" },
            { card: { rank: "Jack", suit: "Diamonds" }, owner: "3" },
            { card: { rank: "Queen", suit: "Diamonds" }, owner: "4" },
          ],
          [
            { card: { rank: "King", suit: "Diamonds" }, owner: "1" },
            { card: { rank: "Ace", suit: "Diamonds" }, owner: "2" },
            { card: { rank: "10", suit: "Hearts" }, owner: "3" },
            { card: { rank: "Jack", suit: "Hearts" }, owner: "4" },
          ],
          [
            { card: { rank: "Queen", suit: "Hearts" }, owner: "1" },
            { card: { rank: "King", suit: "Hearts" }, owner: "2" },
            { card: { rank: "Ace", suit: "Hearts" }, owner: "3" },
            { card: { rank: "10", suit: "Spades" }, owner: "4" },
          ],
          [
            { card: { rank: "Jack", suit: "Spades" }, owner: "1" },
            { card: { rank: "Queen", suit: "Spades" }, owner: "2" },
            { card: { rank: "King", suit: "Spades" }, owner: "3" },
            { card: { rank: "Ace", suit: "Spades" }, owner: "4" },
          ],
        ],
        trump: "Clubs",
        winningBid: { choice: "3", playerPosition: "2" },
      };
      const [isLegal, reason] = determineIfPhaseIsLegal(phase);
      assertEquals(isLegal, true, reason);
    },
  },
);

Deno.test(
  {
    name: "Should return bidding phase once last trick is taken",
    fn: () => {
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
              { name: "Noodle", hand: [], position: "4" },
            ],
          },
          {
            points: 0,
            players: [
              { name: "Julia", position: "1", hand: [lastCard] },
              { name: "Larry", position: "3", hand: [] },
            ],
          },
        ],
        currentTrick: [
          { card: { rank: "9", suit: "Clubs" }, owner: "2" },
          { card: { rank: "10", suit: "Clubs" }, owner: "3" },
          { card: { rank: "Jack", suit: "Clubs" }, owner: "4" },
        ],
        finishedTricks: [
          [
            { card: { rank: "Queen", suit: "Clubs" }, owner: "1" },
            { card: { rank: "King", suit: "Clubs" }, owner: "2" },
            { card: { rank: "9", suit: "Diamonds" }, owner: "3" },
            { card: { rank: "10", suit: "Diamonds" }, owner: "4" },
          ],
          [
            { card: { rank: "Jack", suit: "Diamonds" }, owner: "1" },
            { card: { rank: "Queen", suit: "Diamonds" }, owner: "2" },
            { card: { rank: "King", suit: "Diamonds" }, owner: "3" },
            { card: { rank: "Ace", suit: "Diamonds" }, owner: "4" },
          ],
          [
            { card: { rank: "9", suit: "Spades" }, owner: "1" },
            { card: { rank: "10", suit: "Spades" }, owner: "2" },
            { card: { rank: "Jack", suit: "Spades" }, owner: "3" },
            { card: { rank: "Queen", suit: "Spades" }, owner: "4" },
          ],
          [
            { card: { rank: "King", suit: "Spades" }, owner: "1" },
            { card: { rank: "Ace", suit: "Spades" }, owner: "2" },
            { card: { rank: "9", suit: "Hearts" }, owner: "3" },
            { card: { rank: "10", suit: "Hearts" }, owner: "4" },
          ],
          [
            { card: { rank: "Jack", suit: "Hearts" }, owner: "1" },
            { card: { rank: "Queen", suit: "Hearts" }, owner: "2" },
            { card: { rank: "King", suit: "Hearts" }, owner: "3" },
            { card: { rank: "Ace", suit: "Hearts" }, owner: "4" },
          ],
        ],
        cardPosition: currentPlayer,
        dealer: currentPlayer,
      };
      const [isLegal, reason] = determineIfPhaseIsLegal(phase);
      assertEquals(isLegal, true, reason);
      const options = getOptions(phase, "1");
      const nextPhase = chooseOption(options[0], phase, currentPlayer);
      assertEquals(nextPhase.name, "Bidding");
    },
  },
);

Deno.test(
  {
    name:
      "Should test that two cards in the same trick do not have the same owner",
    fn: () => {
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
              { name: "Noodle", hand: [], position: "4" },
            ],
          },
          {
            points: 0,
            players: [
              { name: "Julia", position: "1", hand: [lastCard] },
              { name: "Larry", position: "3", hand: [] },
            ],
          },
        ],
        currentTrick: [
          { card: { rank: "9", suit: "Clubs" }, owner: "2" },
          { card: { rank: "10", suit: "Clubs" }, owner: "3" },
          { card: { rank: "Jack", suit: "Clubs" }, owner: "4" },
        ],
        finishedTricks: [
          [
            { card: { rank: "Queen", suit: "Clubs" }, owner: "1" },
            { card: { rank: "King", suit: "Clubs" }, owner: "1" },
            { card: { rank: "9", suit: "Diamonds" }, owner: "1" },
            { card: { rank: "10", suit: "Diamonds" }, owner: "1" },
          ],
          [
            { card: { rank: "Jack", suit: "Diamonds" }, owner: "1" },
            { card: { rank: "Queen", suit: "Diamonds" }, owner: "1" },
            { card: { rank: "King", suit: "Diamonds" }, owner: "1" },
            { card: { rank: "Ace", suit: "Diamonds" }, owner: "1" },
          ],
          [
            { card: { rank: "9", suit: "Spades" }, owner: "1" },
            { card: { rank: "10", suit: "Spades" }, owner: "1" },
            { card: { rank: "Jack", suit: "Spades" }, owner: "1" },
            { card: { rank: "Queen", suit: "Spades" }, owner: "1" },
          ],
          [
            { card: { rank: "King", suit: "Spades" }, owner: "1" },
            { card: { rank: "Ace", suit: "Spades" }, owner: "1" },
            { card: { rank: "9", suit: "Hearts" }, owner: "1" },
            { card: { rank: "10", suit: "Hearts" }, owner: "1" },
          ],
          [
            { card: { rank: "Jack", suit: "Hearts" }, owner: "1" },
            { card: { rank: "Queen", suit: "Hearts" }, owner: "1" },
            { card: { rank: "King", suit: "Hearts" }, owner: "1" },
            { card: { rank: "Ace", suit: "Hearts" }, owner: "1" },
          ],
        ],
        cardPosition: currentPlayer,
        dealer: currentPlayer,
      };
      const [isLegal] = determineIfPhaseIsLegal(phase);
      assertEquals(isLegal, false);
    },
  },
);

Deno.test(
  {
    name:
      "Should have hands of players be full of cards when starting bidding phase",
    fn: () => {
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
              { name: "Noodle", hand: [], position: "4" },
            ],
          },
          {
            points: 0,
            players: [
              { name: "Julia", position: "1", hand: [lastCard] },
              { name: "Larry", position: "3", hand: [] },
            ],
          },
        ],
        currentTrick: [
          { card: { rank: "9", suit: "Clubs" }, owner: "2" },
          { card: { rank: "10", suit: "Clubs" }, owner: "3" },
          { card: { rank: "Jack", suit: "Clubs" }, owner: "4" },
        ],
        finishedTricks: [
          [
            { card: { rank: "Queen", suit: "Clubs" }, owner: "1" },
            { card: { rank: "King", suit: "Clubs" }, owner: "2" },
            { card: { rank: "9", suit: "Diamonds" }, owner: "3" },
            { card: { rank: "10", suit: "Diamonds" }, owner: "4" },
          ],
          [
            { card: { rank: "Jack", suit: "Diamonds" }, owner: "1" },
            { card: { rank: "Queen", suit: "Diamonds" }, owner: "2" },
            { card: { rank: "King", suit: "Diamonds" }, owner: "3" },
            { card: { rank: "Ace", suit: "Diamonds" }, owner: "4" },
          ],
          [
            { card: { rank: "9", suit: "Spades" }, owner: "1" },
            { card: { rank: "10", suit: "Spades" }, owner: "2" },
            { card: { rank: "Jack", suit: "Spades" }, owner: "3" },
            { card: { rank: "Queen", suit: "Spades" }, owner: "4" },
          ],
          [
            { card: { rank: "King", suit: "Spades" }, owner: "1" },
            { card: { rank: "Ace", suit: "Spades" }, owner: "2" },
            { card: { rank: "9", suit: "Hearts" }, owner: "3" },
            { card: { rank: "10", suit: "Hearts" }, owner: "4" },
          ],
          [
            { card: { rank: "Jack", suit: "Hearts" }, owner: "1" },
            { card: { rank: "Queen", suit: "Hearts" }, owner: "2" },
            { card: { rank: "King", suit: "Hearts" }, owner: "3" },
            { card: { rank: "Ace", suit: "Hearts" }, owner: "4" },
          ],
        ],
        cardPosition: currentPlayer,
        dealer: currentPlayer,
      };
      const options = getOptions(phase, "1");
      const nextPhase = chooseOption(options[0], phase, currentPlayer);
      if (nextPhase.name === "Bidding") {
        const allPlayersHaveSixCards = nextPhase.teams.every((team: Team) =>
          team.players.every((player: Player) => player.hand.length === 6)
        );
        assertEquals(
          allPlayersHaveSixCards,
          true,
          "All players should've had six cards but they don't for some reason.",
        );
      } else {
        fail("Phase should have been Bidding but wasn't");
      }
    },
  },
);

Deno.test(
  {
    name:
      "Should give five points to first team and give one point to second team",
    fn: () => {
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
              { name: "Noodle", hand: [], position: "4" },
            ],
          },
          {
            points: 0,
            players: [
              { name: "Julia", position: "1", hand: [lastCard] },
              { name: "Larry", position: "3", hand: [] },
            ],
          },
        ],
        currentTrick: [
          // Julia is about to win this trick
          { card: { rank: "9", suit: "Clubs" }, owner: "2" },
          { card: { rank: "10", suit: "Clubs" }, owner: "3" },
          { card: { rank: "Jack", suit: "Clubs" }, owner: "4" },
        ],
        finishedTricks: [
          [
            // Serena won this trick
            { card: { rank: "Queen", suit: "Clubs" }, owner: "1" },
            { card: { rank: "King", suit: "Clubs" }, owner: "2" },
            { card: { rank: "9", suit: "Diamonds" }, owner: "3" },
            { card: { rank: "10", suit: "Diamonds" }, owner: "4" },
          ],
          [
            // Noodle won this trick
            { card: { rank: "Jack", suit: "Diamonds" }, owner: "1" },
            { card: { rank: "Queen", suit: "Diamonds" }, owner: "2" },
            { card: { rank: "King", suit: "Diamonds" }, owner: "3" },
            { card: { rank: "Ace", suit: "Diamonds" }, owner: "4" },
          ],
          [
            // Noodle won this trick
            { card: { rank: "9", suit: "Spades" }, owner: "1" },
            { card: { rank: "10", suit: "Spades" }, owner: "2" },
            { card: { rank: "Jack", suit: "Spades" }, owner: "3" },
            { card: { rank: "Queen", suit: "Spades" }, owner: "4" },
          ],
          [
            // Serena won this trick
            { card: { rank: "King", suit: "Spades" }, owner: "1" },
            { card: { rank: "Ace", suit: "Spades" }, owner: "2" },
            { card: { rank: "9", suit: "Hearts" }, owner: "3" },
            { card: { rank: "10", suit: "Hearts" }, owner: "4" },
          ],
          [
            // Noodle won this trick
            { card: { rank: "Jack", suit: "Hearts" }, owner: "1" },
            { card: { rank: "Queen", suit: "Hearts" }, owner: "2" },
            { card: { rank: "King", suit: "Hearts" }, owner: "3" },
            { card: { rank: "Ace", suit: "Hearts" }, owner: "4" },
          ],
        ],
        cardPosition: currentPlayer,
        dealer: currentPlayer,
      };
      const options = getOptions(phase, "1");
      const nextPhase = chooseOption(options[0], phase, currentPlayer);
      if (
        nextPhase.name === "Bidding"
      ) {
        const firstTeamPoints = nextPhase.teams[0].points;
        const secondTeamPoints = nextPhase.teams[1].points;
        assertEquals(firstTeamPoints, 5);
        assertEquals(secondTeamPoints, 1);
      } else {
        fail("Phase should have been Bidding but wasn't");
      }
    },
  },
);

Deno.test(
  {
    name: "Should remove all cards from trick when last card is played",
    fn: () => {
      const currentPlayer = "4";
      const option: Option = { rank: "Ace", suit: "Hearts" };
      const phase: TrickTakingPhase = {
        name: "Trick-Taking",
        trump: "High",
        winningBid: { choice: "4", playerPosition: "2" },
        teams: [
          {
            points: 0,
            players: [
              {
                name: "Serena",
                position: "2",
                hand: [
                  { rank: "Ace", suit: "Spades" },
                  { rank: "9", suit: "Clubs" },
                ],
              },
              {
                name: "Noodle",
                hand: [
                  { rank: "10", suit: "Hearts" },
                  { rank: "Jack", suit: "Clubs" },
                  option,
                ],
                position: currentPlayer,
              },
            ],
          },
          {
            points: 0,
            players: [
              {
                name: "Julia",
                position: "1",
                hand: [
                  { rank: "King", suit: "Spades" },
                  { rank: "Ace", suit: "Clubs" },
                ],
              },
              {
                name: "Larry",
                position: "3",
                hand: [
                  { rank: "9", suit: "Hearts" },
                  { rank: "10", suit: "Clubs" },
                ],
              },
            ],
          },
        ],
        currentTrick: [
          { card: { rank: "Jack", suit: "Hearts" }, owner: "1" },
          { card: { rank: "Queen", suit: "Hearts" }, owner: "2" },
          { card: { rank: "King", suit: "Hearts" }, owner: "3" },
        ],
        finishedTricks: [
          [
            // Serena won this trick
            { card: { rank: "Queen", suit: "Clubs" }, owner: "1" },
            { card: { rank: "King", suit: "Clubs" }, owner: "2" },
            { card: { rank: "9", suit: "Diamonds" }, owner: "3" },
            { card: { rank: "10", suit: "Diamonds" }, owner: "4" },
          ],
          [
            // Noodle won this trick
            { card: { rank: "Jack", suit: "Diamonds" }, owner: "1" },
            { card: { rank: "Queen", suit: "Diamonds" }, owner: "2" },
            { card: { rank: "King", suit: "Diamonds" }, owner: "3" },
            { card: { rank: "Ace", suit: "Diamonds" }, owner: "4" },
          ],
          [
            // Noodle won this trick
            { card: { rank: "9", suit: "Spades" }, owner: "1" },
            { card: { rank: "10", suit: "Spades" }, owner: "2" },
            { card: { rank: "Jack", suit: "Spades" }, owner: "3" },
            { card: { rank: "Queen", suit: "Spades" }, owner: "4" },
          ],
        ],
        cardPosition: currentPlayer,
        dealer: currentPlayer,
      };
      const [isLegalPhase, errorMessage] = determineIfPhaseIsLegal(phase);
      assertEquals(isLegalPhase, true, errorMessage);
      const options = getOptions(phase, currentPlayer);
      assertEquals(
        options.length > 0,
        true,
        "Was not able to find any options for this phase",
      );
      const nextPhase = chooseOption(option, phase, currentPlayer);
      if (nextPhase.name !== "Game Over") {
        const [isLegalPhase, errorMessage] = determineIfPhaseIsLegal(nextPhase);
        assertEquals(isLegalPhase, true, errorMessage);
      }
      if (nextPhase.name === "Trick-Taking") {
        assertEquals(nextPhase.currentTrick.length, 0);
      } else {
        fail("The phase was supposed to be Trick-Taking but it isn't.");
      }
    },
  },
);

Deno.test(
  {
    name: "Should have person who won last trick lead the next",
    fn: () => {
      const currentPlayer = "4";
      const option: Option = { rank: "Ace", suit: "Hearts" };
      const phase: TrickTakingPhase = {
        name: "Trick-Taking",
        trump: "High",
        winningBid: { choice: "4", playerPosition: "2" },
        teams: [
          {
            points: 0,
            players: [
              {
                name: "Serena",
                position: "2",
                hand: [
                  { rank: "Ace", suit: "Spades" },
                  { rank: "9", suit: "Clubs" },
                ],
              },
              {
                name: "Noodle",
                hand: [
                  { rank: "10", suit: "Hearts" },
                  { rank: "Jack", suit: "Clubs" },
                  option,
                ],
                position: currentPlayer,
              },
            ],
          },
          {
            points: 0,
            players: [
              {
                name: "Julia",
                position: "1",
                hand: [
                  { rank: "King", suit: "Spades" },
                  { rank: "Ace", suit: "Clubs" },
                ],
              },
              {
                name: "Larry",
                position: "3",
                hand: [
                  { rank: "9", suit: "Hearts" },
                  { rank: "10", suit: "Clubs" },
                ],
              },
            ],
          },
        ],
        currentTrick: [
          { card: { rank: "Jack", suit: "Hearts" }, owner: "1" },
          { card: { rank: "Queen", suit: "Hearts" }, owner: "2" },
          { card: { rank: "King", suit: "Hearts" }, owner: "3" },
        ],
        finishedTricks: [
          [
            // Serena won this trick
            { card: { rank: "Queen", suit: "Clubs" }, owner: "1" },
            { card: { rank: "King", suit: "Clubs" }, owner: "2" },
            { card: { rank: "9", suit: "Diamonds" }, owner: "3" },
            { card: { rank: "10", suit: "Diamonds" }, owner: "4" },
          ],
          [
            // Noodle won this trick
            { card: { rank: "Jack", suit: "Diamonds" }, owner: "1" },
            { card: { rank: "Queen", suit: "Diamonds" }, owner: "2" },
            { card: { rank: "King", suit: "Diamonds" }, owner: "3" },
            { card: { rank: "Ace", suit: "Diamonds" }, owner: "4" },
          ],
          [
            // Noodle won this trick
            { card: { rank: "9", suit: "Spades" }, owner: "1" },
            { card: { rank: "10", suit: "Spades" }, owner: "2" },
            { card: { rank: "Jack", suit: "Spades" }, owner: "3" },
            { card: { rank: "Queen", suit: "Spades" }, owner: "4" },
          ],
        ],
        cardPosition: currentPlayer,
        dealer: currentPlayer,
      };
      const [isLegalPhase, errorMessage] = determineIfPhaseIsLegal(phase);
      assertEquals(isLegalPhase, true, errorMessage);
      const options = getOptions(phase, currentPlayer);
      assertEquals(
        options.length > 0,
        true,
        "Was not able to find any options for this phase",
      );
      const nextPhase = chooseOption(option, phase, currentPlayer);
      if (nextPhase.name === "Trick-Taking") {
        assertEquals(
          nextPhase.cardPosition,
          currentPlayer,
          `Since Noodle ${currentPlayer} won the last trick he should be the first player in the next trick but instead it was ${nextPhase.cardPosition}`,
        );
      } else {
        fail("The phase was supposed to be Trick-Taking but it isn't.");
      }
    },
  },
);

Deno.test({
  name: "Should be able to get options for all players",
  fn: () => {
    const phase: BiddingPhase = {
      name: "Bidding",
      bids: [],
      dealer: "4",
      bidPosition: "1",
      teams: [
        {
          points: 0,
          players: [
            {
              name: "Julia",
              position: "1",
              hand: [
                {
                  rank: "10",
                  suit: "Diamonds",
                },
                {
                  rank: "Queen",
                  suit: "Clubs",
                },
                {
                  rank: "King",
                  suit: "Diamonds",
                },
                {
                  rank: "Ace",
                  suit: "Hearts",
                },
                {
                  rank: "Queen",
                  suit: "Diamonds",
                },
                {
                  rank: "10",
                  suit: "Spades",
                },
              ],
            },
            {
              name: "Larry",
              position: "3",
              hand: [
                {
                  rank: "King",
                  suit: "Hearts",
                },
                {
                  rank: "Queen",
                  suit: "Hearts",
                },
                {
                  rank: "9",
                  suit: "Diamonds",
                },
                {
                  rank: "10",
                  suit: "Hearts",
                },
                {
                  rank: "King",
                  suit: "Spades",
                },
                {
                  rank: "King",
                  suit: "Clubs",
                },
              ],
            },
          ],
        },
        {
          points: 0,
          players: [
            {
              name: "Serena",
              position: "2",
              hand: [
                {
                  rank: "10",
                  suit: "Clubs",
                },
                {
                  rank: "Jack",
                  suit: "Spades",
                },
                {
                  rank: "9",
                  suit: "Hearts",
                },
                {
                  rank: "Jack",
                  suit: "Hearts",
                },
                {
                  rank: "9",
                  suit: "Clubs",
                },
                {
                  rank: "Ace",
                  suit: "Diamonds",
                },
              ],
            },
            {
              name: "Noodle",
              position: "4",
              hand: [
                {
                  rank: "Ace",
                  suit: "Spades",
                },
                {
                  rank: "9",
                  suit: "Spades",
                },
                {
                  rank: "Jack",
                  suit: "Clubs",
                },
                {
                  rank: "Jack",
                  suit: "Diamonds",
                },
                {
                  rank: "Queen",
                  suit: "Spades",
                },
                {
                  rank: "Ace",
                  suit: "Clubs",
                },
              ],
            },
          ],
        },
      ],
    };
    getOptions(phase, "1");
    getOptions(phase, "2");
    getOptions(phase, "3");
    getOptions(phase, "4");
  },
});

Deno.test(
  {
    name: "Should allow second bidder to pass when first bidder did not",
    fn: () => {
      const phase: BiddingPhase = {
        name: "Bidding",
        bids: [],
        dealer: "4",
        bidPosition: "1",
        teams: [
          {
            points: 0,
            players: [
              {
                name: "Julia",
                position: "1",
                hand: [
                  {
                    rank: "10",
                    suit: "Diamonds",
                  },
                  {
                    rank: "Queen",
                    suit: "Clubs",
                  },
                  {
                    rank: "King",
                    suit: "Diamonds",
                  },
                  {
                    rank: "Ace",
                    suit: "Hearts",
                  },
                  {
                    rank: "Queen",
                    suit: "Diamonds",
                  },
                  {
                    rank: "10",
                    suit: "Spades",
                  },
                ],
              },
              {
                name: "Larry",
                position: "3",
                hand: [
                  {
                    rank: "King",
                    suit: "Hearts",
                  },
                  {
                    rank: "Queen",
                    suit: "Hearts",
                  },
                  {
                    rank: "9",
                    suit: "Diamonds",
                  },
                  {
                    rank: "10",
                    suit: "Hearts",
                  },
                  {
                    rank: "King",
                    suit: "Spades",
                  },
                  {
                    rank: "King",
                    suit: "Clubs",
                  },
                ],
              },
            ],
          },
          {
            points: 0,
            players: [
              {
                name: "Serena",
                position: "2",
                hand: [
                  {
                    rank: "10",
                    suit: "Clubs",
                  },
                  {
                    rank: "Jack",
                    suit: "Spades",
                  },
                  {
                    rank: "9",
                    suit: "Hearts",
                  },
                  {
                    rank: "Jack",
                    suit: "Hearts",
                  },
                  {
                    rank: "9",
                    suit: "Clubs",
                  },
                  {
                    rank: "Ace",
                    suit: "Diamonds",
                  },
                ],
              },
              {
                name: "Noodle",
                position: "4",
                hand: [
                  {
                    rank: "Ace",
                    suit: "Spades",
                  },
                  {
                    rank: "9",
                    suit: "Spades",
                  },
                  {
                    rank: "Jack",
                    suit: "Clubs",
                  },
                  {
                    rank: "Jack",
                    suit: "Diamonds",
                  },
                  {
                    rank: "Queen",
                    suit: "Spades",
                  },
                  {
                    rank: "Ace",
                    suit: "Clubs",
                  },
                ],
              },
            ],
          },
        ],
      };
      const nextPhase = chooseOption("3", phase, "1");
      if (
        nextPhase.name === "Game Over"
      ) {
        fail("Phase was Game Over but should be Bidding");
      } else {
        const options = getOptions(nextPhase, "2");
        const expectedOption: Option = "Pass";
        assertArrayContains(options, [expectedOption]);
      }
    },
  },
);

Deno.test({
  name: "Should have only option to place card of same suit if player has them",
  fn: () => {
    const currentPlayer: PlayerPosition = "3";
    const phase: TrickTakingPhase = {
      name: "Trick-Taking",
      teams: [
        {
          players: [
            {
              hand: [
                { rank: "9", suit: "Clubs" },
                { rank: "10", suit: "Clubs" },
                { rank: "Ace", suit: "Clubs" },
                { rank: "King", suit: "Diamonds" },
                { rank: "Queen", suit: "Hearts" },
                { rank: "Jack", suit: "Spades" },
              ],
              name: "Serena",
              position: "1",
            },
            {
              hand: [
                { rank: "9", suit: "Diamonds" },
                { rank: "Queen", suit: "Clubs" },
                { rank: "Jack", suit: "Diamonds" },
                { rank: "10", suit: "Hearts" },
                { rank: "Ace", suit: "Hearts" },
                { rank: "King", suit: "Spades" },
              ],
              name: "Noodle",
              position: "3",
            },
          ],
          points: 0,
        },
        {
          players: [
            {
              hand: [
                { rank: "Jack", suit: "Clubs" },
                { rank: "10", suit: "Diamonds" },
                { rank: "Ace", suit: "Diamonds" },
                { rank: "King", suit: "Hearts" },
                { rank: "Queen", suit: "Spades" },
              ],
              name: "Julia",
              position: "2",
            },
            {
              hand: [
                { rank: "9", suit: "Spades" },
                { rank: "King", suit: "Clubs" },
                { rank: "Queen", suit: "Diamonds" },
                { rank: "Jack", suit: "Hearts" },
                { rank: "10", suit: "Spades" },
                { rank: "Ace", suit: "Spades" },
              ],
              name: "Larry",
              position: "4",
            },
          ],
          points: 0,
        },
      ],
      dealer: "1",
      cardPosition: currentPlayer,
      currentTrick: [{ card: { rank: "9", suit: "Hearts" }, owner: "2" }],
      finishedTricks: [],
      trump: "Clubs",
      winningBid: { choice: "3", playerPosition: "2" },
    };
    const options: Option[] = getOptions(phase, currentPlayer);
    assertEquals(options.length, 2);
    assertArrayContains(options, [
      { rank: "10", suit: "Hearts" },
      { rank: "Ace", suit: "Hearts" },
    ]);
  },
});

Deno.test(
  {
    name:
      "Should have Serena only be able to pick ace of diamonds when trump is hearts and leading card is diamond and Serena has the jack of diamonds",
    fn: () => {
      const currentPlayer: PlayerPosition = "2";
      const trump: Trump = "Hearts";
      const phase: TrickTakingPhase = {
        dealer: "4",
        cardPosition: "2",
        finishedTricks: [],
        winningBid: { choice: "4", playerPosition: currentPlayer },
        currentTrick: [
          { card: { rank: "Queen", suit: "Diamonds" }, owner: "1" },
        ],
        teams: [
          {
            players: [
              {
                name: "Julia",
                position: "1",
                hand: [
                  { rank: "Jack", suit: "Clubs" },
                  { rank: "Queen", suit: "Clubs" },
                  { rank: "King", suit: "Clubs" },
                  { rank: "Ace", suit: "Clubs" },
                  { rank: "9", suit: "Spades" },
                ],
              },
              {
                name: "Larry",
                position: "3",
                hand: [
                  { rank: "10", suit: "Spades" },
                  { rank: "Jack", suit: "Spades" },
                  { rank: "Queen", suit: "Spades" },
                  { rank: "King", suit: "Spades" },
                  { rank: "Ace", suit: "Spades" },
                  { rank: "9", suit: "Hearts" },
                ],
              },
            ],
            points: 0,
          },
          {
            players: [
              {
                name: "Serena",
                position: currentPlayer,
                hand: [
                  { rank: "Jack", suit: "Hearts" },
                  { rank: "Ace", suit: "Diamonds" },
                  { rank: "Jack", suit: "Diamonds" },
                  { rank: "Ace", suit: "Hearts" },
                  { rank: "9", suit: "Clubs" },
                  { rank: "10", suit: "Clubs" },
                ],
              },
              {
                name: "Noodle",
                position: "4",
                hand: [
                  { rank: "10", suit: "Hearts" },
                  { rank: "Queen", suit: "Hearts" },
                  { rank: "King", suit: "Hearts" },
                  { rank: "9", suit: "Diamonds" },
                  { rank: "10", suit: "Diamonds" },
                  { rank: "King", suit: "Diamonds" },
                ],
              },
            ],
            points: 0,
          },
        ],
        name: "Trick-Taking",
        trump,
      };
      const [isLegalPhase, errorMessage] = determineIfPhaseIsLegal(phase);
      assertEquals(isLegalPhase, true, errorMessage);
      const options = getOptions(phase, currentPlayer);
      assertEquals(
        options.length,
        1,
        `The number of options should be 1 but instead it was ${options.length}`,
      );
      const expectedOption: Card = { rank: "Ace", suit: "Diamonds" };
      assertArrayContains(options, [expectedOption]);
    },
  },
);

Deno.test(
  {
    name:
      "Should have the person who won the bid have to pick a card to give to their partner",
    fn: () => {
      const currentPlayer: PlayerPosition = "1";
      const phase: PartnersBestCardPickingPhase = {
        name: "Picking Partner's Best Card",
        dealer: "3",
        trump: "High",
        partner: "3",
        teams: [
          {
            points: 0,
            players: [
              {
                name: "Julia",
                position: "1",
                hand: [
                  { rank: "Queen", suit: "Diamonds" },
                  { rank: "Jack", suit: "Diamonds" },
                  { rank: "9", suit: "Diamonds" },
                  { rank: "King", suit: "Hearts" },
                  { rank: "Ace", suit: "Diamonds" },
                  { rank: "9", suit: "Clubs" },
                ],
              },
              {
                name: "Larry",
                position: "3",
                hand: [
                  { rank: "10", suit: "Clubs" },
                  { rank: "Ace", suit: "Spades" },
                  { rank: "Jack", suit: "Hearts" },
                  { rank: "9", suit: "Spades" },
                  { rank: "Ace", suit: "Hearts" },
                  { rank: "Jack", suit: "Clubs" },
                ],
              },
            ],
          },
          {
            points: 0,
            players: [
              {
                name: "Serena",
                position: "2",
                hand: [
                  { rank: "10", suit: "Hearts" },
                  { rank: "King", suit: "Clubs" },
                  { rank: "Queen", suit: "Clubs" },
                  { rank: "King", suit: "Diamonds" },
                  { rank: "Queen", suit: "Hearts" },
                  { rank: "King", suit: "Spades" },
                ],
              },
              {
                name: "Noodle",
                position: "4",
                hand: [
                  { rank: "Jack", suit: "Spades" },
                  { rank: "9", suit: "Hearts" },
                  { rank: "Queen", suit: "Spades" },
                  { rank: "10", suit: "Diamonds" },
                  { rank: "Ace", suit: "Clubs" },
                  { rank: "10", suit: "Spades" },
                ],
              },
            ],
          },
        ],
        winningBid: {
          choice: "Partner's Best Card",
          playerPosition: "1",
        },
      };
      const options = getOptions(phase, currentPlayer);
      assertEquals(options.length, 6);
      const nextPhase = chooseOption(options[0], phase, currentPlayer);
      assertNotEquals(nextPhase, phase);
    },
  },
);

Deno.test(
  {
    name: "Should be able to select any card when picking partner's best card",
    fn: () => {
      const hand: Card[] = [
        { rank: "10", suit: "Clubs" },
        { rank: "Ace", suit: "Spades" },
        { rank: "Jack", suit: "Hearts" },
        { rank: "9", suit: "Spades" },
        { rank: "Ace", suit: "Hearts" },
        { rank: "Jack", suit: "Clubs" },
      ];
      const currentPlayer: PlayerPosition = "3";
      const phase: PartnersBestCardPickingPhase = {
        name: "Picking Partner's Best Card",
        dealer: "3",
        trump: "High",
        partner: currentPlayer,
        teams: [
          {
            points: 0,
            players: [
              {
                name: "Julia",
                position: "1",
                hand: [
                  { rank: "Queen", suit: "Diamonds" },
                  { rank: "Jack", suit: "Diamonds" },
                  { rank: "9", suit: "Diamonds" },
                  { rank: "King", suit: "Hearts" },
                  { rank: "Ace", suit: "Diamonds" },
                ],
              },
              {
                name: "Larry",
                position: currentPlayer,
                hand,
              },
            ],
          },
          {
            points: 0,
            players: [
              {
                name: "Serena",
                position: "2",
                hand: [
                  { rank: "10", suit: "Hearts" },
                  { rank: "King", suit: "Clubs" },
                  { rank: "Queen", suit: "Clubs" },
                  { rank: "King", suit: "Diamonds" },
                  { rank: "Queen", suit: "Hearts" },
                  { rank: "King", suit: "Spades" },
                  { rank: "9", suit: "Clubs" },
                ],
              },
              {
                name: "Noodle",
                position: "4",
                hand: [
                  { rank: "Jack", suit: "Spades" },
                  { rank: "9", suit: "Hearts" },
                  { rank: "Queen", suit: "Spades" },
                  { rank: "10", suit: "Diamonds" },
                  { rank: "Ace", suit: "Clubs" },
                  { rank: "10", suit: "Spades" },
                ],
              },
            ],
          },
        ],
        winningBid: {
          choice: "Partner's Best Card",
          playerPosition: "1",
        },
      };
      const options = getOptions(phase, currentPlayer);
      assertArrayContains(options, hand);
      const expectedPhaseName = "Trick-Taking";
      options.forEach((option: Option) => {
        const nextPhase = chooseOption(option, phase, currentPlayer);
        assertEquals(
          nextPhase.name === expectedPhaseName,
          true,
          `Expected ${expectedPhaseName} but instead got ${nextPhase.name}`,
        );
      });
    },
  },
);

Deno.test({
  name: "Should not be able to do anything if partner is going alone",
  fn: () => {
    const phase: TrickTakingPhase = {
      name: "Trick-Taking",
      cardPosition: "4",
      currentTrick: [
        {
          owner: "2",
          card: { rank: "Jack", suit: "Clubs" },
        },
        {
          owner: "3",
          card: { rank: "Ace", suit: "Clubs" },
        },
      ],
      dealer: "1",
      finishedTricks: [],
      trump: "Clubs",
      winningBid: {
        choice: "Going Alone",
        playerPosition: "2",
      },
      playerSittingOut: "4",
      teams: [
        {
          players: [
            {
              name: "Julia",
              position: "1",
              hand: [
                { rank: "10", suit: "Hearts" },
                { rank: "Ace", suit: "Hearts" },
                { rank: "Queen", suit: "Spades" },
                { rank: "9", suit: "Hearts" },
                { rank: "Jack", suit: "Spades" },
                { rank: "Jack", suit: "Diamonds" },
              ],
            },
            {
              name: "Larry",
              position: "3",
              hand: [
                { rank: "Ace", suit: "Spades" },
                { rank: "Queen", suit: "Diamonds" },
                { rank: "10", suit: "Diamonds" },
                { rank: "King", suit: "Diamonds" },
                { rank: "Queen", suit: "Clubs" },
              ],
            },
          ],
          points: 0,
        },
        {
          players: [
            {
              name: "Serena",
              position: "2",
              hand: [
                { rank: "9", suit: "Spades" },
                { rank: "Queen", suit: "Hearts" },
                { rank: "King", suit: "Hearts" },
                { rank: "9", suit: "Clubs" },
                { rank: "King", suit: "Spades" },
              ],
            },
            {
              name: "Noodle",
              position: "4",
              hand: [
                { rank: "King", suit: "Clubs" },
                { rank: "10", suit: "Clubs" },
                { rank: "Jack", suit: "Hearts" },
                { rank: "Ace", suit: "Diamonds" },
                { rank: "9", suit: "Diamonds" },
                { rank: "10", suit: "Spades" },
              ],
            },
          ],
          points: 0,
        },
      ],
    };
    const [isPhaseLegal] = determineIfPhaseIsLegal(phase);
    assertEquals(isPhaseLegal, false);
  },
});

Deno.test({
  name: "Should skip the person who is sitting out",
  fn: () => {
    const currentPlayer: PlayerPosition = "3";
    const phase: TrickTakingPhase = {
      name: "Trick-Taking",
      cardPosition: currentPlayer,
      currentTrick: [
        {
          owner: "2",
          card: { rank: "Ace", suit: "Spades" },
        },
      ],
      dealer: "1",
      finishedTricks: [],
      trump: "Clubs",
      winningBid: {
        choice: "Going Alone",
        playerPosition: "2",
      },
      playerSittingOut: "4",
      teams: [
        {
          players: [
            {
              name: "Julia",
              position: "1",
              hand: [
                { rank: "10", suit: "Diamonds" },
                { rank: "Ace", suit: "Clubs" },
                { rank: "Queen", suit: "Clubs" },
                { rank: "10", suit: "Spades" },
                { rank: "Queen", suit: "Diamonds" },
                { rank: "Jack", suit: "Diamonds" },
              ],
            },
            {
              name: "Larry",
              position: "3",
              hand: [
                { rank: "Jack", suit: "Clubs" },
                { rank: "Ace", suit: "Hearts" },
                { rank: "King", suit: "Clubs" },
                { rank: "Jack", suit: "Spades" },
                { rank: "9", suit: "Clubs" },
                { rank: "10", suit: "Clubs" },
              ],
            },
          ],
          points: 0,
        },
        {
          players: [
            {
              name: "Serena",
              position: "2",
              hand: [
                { rank: "King", suit: "Hearts" },
                { rank: "Ace", suit: "Diamonds" },
                { rank: "9", suit: "Diamonds" },
                { rank: "10", suit: "Hearts" },
                { rank: "King", suit: "Spades" },
              ],
            },
            {
              name: "Noodle",
              position: "4",
              hand: [
                { rank: "9", suit: "Spades" },
                { rank: "Queen", suit: "Hearts" },
                { rank: "Queen", suit: "Spades" },
                { rank: "King", suit: "Diamonds" },
                { rank: "9", suit: "Hearts" },
                { rank: "Jack", suit: "Hearts" },
              ],
            },
          ],
          points: 0,
        },
      ],
    };
    const nextPhase = chooseOption(
      getOptions(phase, currentPlayer)[0],
      phase,
      currentPlayer,
    );
    assertNotEquals(phase, nextPhase);
  },
});

Deno.test(
  {
    name: "Should have tricks finish at three when a player is sitting out",
    fn: () => {
      const currentPlayer: PlayerPosition = "1";
      const phase: TrickTakingPhase = {
        name: "Trick-Taking",
        cardPosition: currentPlayer,
        currentTrick: [
          {
            owner: "2",
            card: { rank: "Ace", suit: "Diamonds" },
          },
          {
            owner: "3",
            card: { rank: "10", suit: "Diamonds" },
          },
        ],
        dealer: "1",
        finishedTricks: [],
        trump: "Diamonds",
        winningBid: {
          choice: "Partner's Best Card",
          playerPosition: "2",
        },
        playerSittingOut: "4",
        teams: [
          {
            players: [
              {
                name: "Julia",
                position: "1",
                hand: [
                  { rank: "King", suit: "Hearts" },
                  { rank: "Ace", suit: "Hearts" },
                  { rank: "Queen", suit: "Clubs" },
                  { rank: "Ace", suit: "Clubs" },
                  { rank: "Jack", suit: "Hearts" },
                  { rank: "Jack", suit: "Diamonds" },
                ],
              },
              {
                name: "Larry",
                position: "3",
                hand: [
                  { rank: "King", suit: "Spades" },
                  { rank: "9", suit: "Hearts" },
                  { rank: "9", suit: "Clubs" },
                  { rank: "10", suit: "Hearts" },
                  { rank: "9", suit: "Spades" },
                ],
              },
            ],
            points: 0,
          },
          {
            players: [
              {
                name: "Serena",
                position: "2",
                hand: [
                  { rank: "King", suit: "Clubs" },
                  { rank: "Jack", suit: "Spades" },
                  { rank: "Queen", suit: "Spades" },
                  { rank: "10", suit: "Clubs" },
                  { rank: "Queen", suit: "Hearts" },
                ],
              },
              {
                name: "Noodle",
                position: "4",
                hand: [
                  { rank: "King", suit: "Diamonds" },
                  { rank: "Queen", suit: "Diamonds" },
                  { rank: "10", suit: "Spades" },
                  { rank: "Ace", suit: "Spades" },
                  { rank: "9", suit: "Diamonds" },
                  { rank: "Jack", suit: "Clubs" },
                ],
              },
            ],
            points: 0,
          },
        ],
      };
      const options = getOptions(phase, currentPlayer);
      const nextPhase = chooseOption(options[0], phase, currentPlayer);
      if (
        nextPhase.name === "Trick-Taking"
      ) {
        assertEquals(nextPhase.currentTrick.length, 0);
      } else {
        fail(
          `The phase should be "Trick-Taking" but instead it was ${nextPhase.name}`,
        );
      }
    },
  },
);

Deno.test(
  {
    name:
      "Should have Larry only be able to select spades since the leading card is the left bower spades",
    fn: () => {
      const currentPlayer: PlayerPosition = "3";
      const phase: TrickTakingPhase = {
        name: "Trick-Taking",
        cardPosition: "3",
        currentTrick: [{ owner: "2", card: { rank: "Jack", suit: "Clubs" } }],
        dealer: "1",
        finishedTricks: [],
        trump: "Spades",
        winningBid: { choice: "3", playerPosition: "1" },
        teams: [
          {
            players: [
              {
                name: "Julia",
                position: "1",
                hand: [
                  { rank: "King", suit: "Diamonds" },
                  { rank: "Queen", suit: "Clubs" },
                  { rank: "10", suit: "Hearts" },
                  { rank: "9", suit: "Hearts" },
                  { rank: "Ace", suit: "Clubs" },
                  { rank: "Jack", suit: "Hearts" },
                ],
              },
              {
                name: "Larry",
                position: "3",
                hand: [
                  { rank: "Ace", suit: "Diamonds" },
                  { rank: "10", suit: "Clubs" },
                  { rank: "Queen", suit: "Hearts" },
                  { rank: "King", suit: "Clubs" },
                  { rank: "Jack", suit: "Spades" },
                  { rank: "Queen", suit: "Spades" },
                ],
              },
            ],
            points: 4,
          },
          {
            players: [
              {
                name: "Serena",
                position: "2",
                hand: [
                  { rank: "Ace", suit: "Hearts" },
                  { rank: "10", suit: "Diamonds" },
                  { rank: "Jack", suit: "Diamonds" },
                  { rank: "Ace", suit: "Spades" },
                  { rank: "Queen", suit: "Diamonds" },
                ],
              },
              {
                name: "Noodle",
                position: "4",
                hand: [
                  { rank: "9", suit: "Spades" },
                  { rank: "9", suit: "Diamonds" },
                  { rank: "9", suit: "Clubs" },
                  { rank: "10", suit: "Spades" },
                  { rank: "King", suit: "Spades" },
                  { rank: "King", suit: "Hearts" },
                ],
              },
            ],
            points: 2,
          },
        ],
      };
      const options: Option[] = getOptions(phase, currentPlayer);
      const cards: Card[] = options as Card[];
      cards.forEach((card) => {
        assertEquals(card.suit, "Spades");
      });
    },
  },
);

Deno.test({
  name: "Should have Julia be the next lead",
  fn: () => {
    const currentPlayer: PlayerPosition = "1";
    const chosenOption: Option = { rank: "Queen", suit: "Hearts" };
    const phase: TrickTakingPhase = {
      name: "Trick-Taking",
      cardPosition: "1",
      currentTrick: [
        { owner: "2", card: { rank: "Queen", suit: "Diamonds" } },
        { owner: "3", card: { rank: "9", suit: "Spades" } },
        { owner: "4", card: { rank: "9", suit: "Clubs" } },
      ],
      dealer: currentPlayer,
      finishedTricks: [
        [
          { owner: "2", card: { rank: "Ace", suit: "Diamonds" } },
          { owner: "3", card: { rank: "9", suit: "Diamonds" } },
          { owner: "4", card: { rank: "King", suit: "Diamonds" } },
          { owner: "1", card: { rank: "10", suit: "Diamonds" } },
        ],
      ],
      trump: "Hearts",
      winningBid: { choice: "3", playerPosition: "3" },
      teams: [
        {
          players: [
            {
              name: "Julia",
              position: "1",
              hand: [
                { rank: "King", suit: "Spades" },
                { rank: "Jack", suit: "Diamonds" },
                { rank: "Ace", suit: "Clubs" },
                { rank: "Queen", suit: "Hearts" },
                { rank: "Jack", suit: "Clubs" },
              ],
            },
            {
              name: "Larry",
              position: "3",
              hand: [
                { rank: "Jack", suit: "Hearts" },
                { rank: "10", suit: "Clubs" },
                { rank: "Ace", suit: "Hearts" },
                { rank: "10", suit: "Hearts" },
              ],
            },
          ],
          points: 0,
        },
        {
          players: [
            {
              name: "Serena",
              position: "2",
              hand: [
                { rank: "King", suit: "Hearts" },
                { rank: "King", suit: "Clubs" },
                { rank: "Jack", suit: "Spades" },
                { rank: "Queen", suit: "Spades" },
              ],
            },
            {
              name: "Noodle",
              position: "4",
              hand: [
                { rank: "Queen", suit: "Clubs" },
                { rank: "9", suit: "Hearts" },
                { rank: "10", suit: "Spades" },
                { rank: "Ace", suit: "Spades" },
              ],
            },
          ],
          points: 0,
        },
      ],
    };
    const options = getOptions(phase, currentPlayer);
    assertArrayContains(options, [chosenOption]);
    const nextPhase = chooseOption(chosenOption, phase, currentPlayer);
    if (nextPhase.name === "Trick-Taking") {
      const nextOptions = getOptions(nextPhase, currentPlayer);
      assertEquals(nextOptions.length > 0, true);
      assertEquals(nextPhase.cardPosition, currentPlayer);
      assertEquals(
        nextPhase.currentTrick.length,
        0,
        `Expected the current trick to be over but we found ${nextPhase.currentTrick.length} in the current trick`,
      );
    } else {
      fail("Expected Trick-Taking phase");
    }
  },
});

Deno.test({
  name: "Serena should be able to pick Spades for Trump when going alone",
  fn: () => {
    const phase: TrumpPickingPhase = {
      "name": "Picking Trump",
      "dealer": "4",
      "teams": [
        {
          "points": 30,
          "players": [
            {
              "name": "Alex Malcolm",
              "position": "1",
              "hand": [
                { "rank": "King", "suit": "Hearts" },
                { "rank": "Jack", "suit": "Hearts" },
                { "rank": "9", "suit": "Diamonds" },
                { "rank": "Ace", "suit": "Clubs" },
                { "rank": "Queen", "suit": "Clubs" },
                { "rank": "King", "suit": "Clubs" },
              ],
            },
            {
              "name": "Serena Howard",
              "position": "3",
              "hand": [
                { "rank": "Ace", "suit": "Diamonds" },
                { "rank": "Jack", "suit": "Clubs" },
                { "rank": "Jack", "suit": "Spades" },
                { "rank": "Ace", "suit": "Hearts" },
                { "rank": "10", "suit": "Spades" },
                { "rank": "Ace", "suit": "Spades" },
              ],
            },
          ],
        },
        {
          "points": 16,
          "players": [
            {
              "name": "Larry Mitchell",
              "position": "2",
              "hand": [
                { "rank": "Queen", "suit": "Spades" },
                { "rank": "10", "suit": "Hearts" },
                { "rank": "9", "suit": "Clubs" },
                { "rank": "Jack", "suit": "Diamonds" },
                { "rank": "King", "suit": "Spades" },
                { "rank": "Queen", "suit": "Hearts" },
              ],
            },
            {
              "name": "Julia Denman",
              "position": "4",
              "hand": [
                { "rank": "9", "suit": "Hearts" },
                { "rank": "Queen", "suit": "Diamonds" },
                { "rank": "King", "suit": "Diamonds" },
                { "rank": "10", "suit": "Clubs" },
                { "rank": "10", "suit": "Diamonds" },
                { "rank": "9", "suit": "Spades" },
              ],
            },
          ],
        },
      ],
      "winningBid": { "choice": "Going Alone", "playerPosition": "3" },
    };
    const currentPlayer: PlayerPosition = "3";
    const options = getOptions(phase, currentPlayer);
    assertEquals(options.length > 0, true);
    const option = "Spades";
    const nextPhase = chooseOption(option, phase, currentPlayer);
    assertNotEquals(
      nextPhase.name,
      phase.name,
      `Expected something other than ${phase.name} but got ${nextPhase.name} instead.`,
    );
  },
});

Deno.test({
  name: "Julia should be able to pick Queen of Hearts",
  fn: () => {
    const phase: PartnersBestCardPickingPhase = {
      "name": "Picking Partner's Best Card",
      "dealer": "1",
      "trump": "Hearts",
      "partner": "2",
      "teams": [
        {
          "points": 0,
          "players": [
            {
              "name": "Serena Howard",
              "position": "1",
              "hand": [
                { "rank": "King", "suit": "Hearts" },
                { "rank": "Jack", "suit": "Spades" },
                { "rank": "9", "suit": "Spades" },
                { "rank": "King", "suit": "Clubs" },
                { "rank": "Jack", "suit": "Clubs" },
                { "rank": "10", "suit": "Diamonds" },
              ],
            },
            {
              "name": "Alex Malcolm",
              "position": "3",
              "hand": [
                { "rank": "King", "suit": "Spades" },
                { "rank": "Ace", "suit": "Spades" },
                { "rank": "Ace", "suit": "Diamonds" },
                { "rank": "Queen", "suit": "Clubs" },
                { "rank": "Ace", "suit": "Clubs" },
                { "rank": "10", "suit": "Clubs" },
              ],
            },
          ],
        },
        {
          "points": 5,
          "players": [
            {
              "name": "Julia Denman",
              "position": "2",
              "hand": [
                { "rank": "Queen", "suit": "Diamonds" },
                { "rank": "9", "suit": "Clubs" },
                { "rank": "Queen", "suit": "Hearts" },
                { "rank": "10", "suit": "Spades" },
                { "rank": "9", "suit": "Diamonds" },
                { "rank": "10", "suit": "Hearts" },
                { "rank": "Queen", "suit": "Spades" },
              ],
            },
            {
              "name": "Alec Brickey",
              "position": "4",
              "hand": [
                { "rank": "Ace", "suit": "Hearts" },
                { "rank": "King", "suit": "Diamonds" },
                { "rank": "Jack", "suit": "Diamonds" },
                { "rank": "Jack", "suit": "Hearts" },
                { "rank": "9", "suit": "Hearts" },
              ],
            },
          ],
        },
      ],
      "winningBid": {
        "choice": "Partner's Best Card",
        "playerPosition": "4",
      },
    };
    const positionOfJulia: PlayerPosition = "2";
    const choice: Option = { rank: "Queen", suit: "Hearts" };
    const nextPhase = chooseOption(choice, phase, positionOfJulia);
    assertNotEquals(
      phase.name,
      nextPhase.name,
      `Expected not ${phase.name} but received ${nextPhase.name}`,
    );
  },
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
