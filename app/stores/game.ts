import { nanoid } from "nanoid";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { words } from "~/data/words";
import { addToNumber } from "~/lib/addToNumber";
import type { GameHistory, GamePlayState, GameSetupForm } from "~/types/game"

interface GameState {
  gameSetup: GameSetupForm | null;
  gamePlay: GamePlayState;
  gameHistory: GameHistory[];

  setGameSetup: (gameSetup: GameSetupForm) => void;
  initializeGame: (gameSetup: GameSetupForm) => void;
  nextTurn: () => void;
  endTurn: () => void;
  decreaseTime: () => void;
  showWord: () => void;
  hideWord: () => void;
  getNewWord: () => void;
  correctAnswer: () => void;
  skipWord: () => void;
  playAgain: () => void;
  resetGame: () => void;
  addGameToHistory: () => void;
}

const DEFAULT_VALUE: Pick<GameState, "gameSetup" | "gamePlay"> = {
  gameSetup: null,

  gamePlay: {
    currentTeamIndex: 0,
    currentPlayerId: null,
    currentRound: 1,
    playedPlayerIds: {},
    playedWordIds: [],
    scores: {},
    currentWord: "",
    isWordVisible: false,
    timeLeft: 0,
    isGameOver: false,
    skippedWords: {},
    playerScores: {}
  }
}

const DEFAULT_GAME_HISTORY: GameHistory[] = [];

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_VALUE,
      gameHistory: DEFAULT_GAME_HISTORY,

      setGameSetup: (gameSetup) =>
        set({ gameSetup }),

      initializeGame: (gameSetup) => {
        if (!gameSetup) return;

        const scores: Record<string, number> = {};
        const playedPlayerIds: Record<string, string[]> = {};
        const skippedWords: Record<string, number> = {};
        const playerScores: Record<string, number> = {};

        gameSetup.teams.forEach((team) => {
          scores[team.id] = 0
          skippedWords[team.id] = 0;
          playedPlayerIds[team.id] = []
        });

        gameSetup.teams.forEach((team) => {
          team.players.forEach((player) => {
            playerScores[player.id] = 0;
          })
        })

        const firstTeam = gameSetup.teams[0];
        if (!firstTeam || firstTeam.players.length === 0) return;

        const randomPlayer = firstTeam.players[
          Math.floor(Math.random() * firstTeam.players.length)
        ];

        const randomWord = words[Math.floor(Math.random() * words.length)];

        set({
          gamePlay: {
            ...DEFAULT_VALUE.gamePlay,
            currentPlayerId: randomPlayer.id,
            playedPlayerIds: {
              ...playedPlayerIds,
              [firstTeam.id]: [randomPlayer.id],
            },
            scores,
            skippedWords,
            currentWord: randomWord.text,
            isWordVisible: false,

            timeLeft: gameSetup.turnDuration,
            playedWordIds: [randomWord.id]
          }
        })
      },

      nextTurn: () => {
        const { gameSetup, gamePlay } = get();

        if (!gameSetup) return;

        const currentTeamIndex = gamePlay.currentTeamIndex;

        // Go to next team
        const nextTeamIndex =
          (currentTeamIndex + 1) % gameSetup.teams.length;

        const isLastTeam = nextTeamIndex === 0;

        const nextTeam = gameSetup.teams[nextTeamIndex];
        if (!nextTeam || nextTeam.players.length === 0) return;

        const playedIds = gamePlay.playedPlayerIds[nextTeam.id] ?? [];

        // Players who have not yet played in this cycle
        const availablePlayers = nextTeam.players.filter(
          (player) => !playedIds.includes(player.id)
        );

        // If all players on this team have played, start the cycle over.
        const playersToChooseFrom =
          availablePlayers.length > 0
            ? availablePlayers
            : nextTeam.players;

        const randomPlayer =
          playersToChooseFrom[
          Math.floor(Math.random() * playersToChooseFrom.length)
          ];

        const randomWord =
          words[Math.floor(Math.random() * words.length)];

        set({
          gamePlay: {
            ...gamePlay,

            currentTeamIndex: nextTeamIndex,
            currentPlayerId: randomPlayer.id,

            playedPlayerIds: {
              ...gamePlay.playedPlayerIds,

              [nextTeam.id]:
                availablePlayers.length > 0
                  ? [...playedIds, randomPlayer.id]
                  : [randomPlayer.id]
            },

            currentRound: isLastTeam
              ? gamePlay.currentRound + 1
              : gamePlay.currentRound,

            currentWord: randomWord.text,
            isWordVisible: false,
            playedWordIds: [randomWord.id]
          },


        })
      },

      endTurn: () => {
        const { gameSetup, gamePlay, addGameToHistory } = get();
        if (!gameSetup) return;

        const isLastTurn =
          gamePlay.currentRound === gameSetup.numberOfRounds &&
          gamePlay.currentTeamIndex === gameSetup.teams.length - 1;

        if (isLastTurn) {
          addGameToHistory();

          set((state) => ({
            gamePlay: {
              ...state.gamePlay,
              timeLeft: 0,
              isGameOver: true
            }
          }))
          return;
        }

        set((state) => ({
          gamePlay: {
            ...state.gamePlay,
            timeLeft: gameSetup.turnDuration
          }
        }))

        get().nextTurn();
      },

      decreaseTime: () => {
        set((state) => ({
          gamePlay: {
            ...state.gamePlay,
            timeLeft: Math.max(0, state.gamePlay.timeLeft - 1),
          }
        }))
      },

      showWord: () => {
        set((state) => ({
          gamePlay: {
            ...state.gamePlay,
            isWordVisible: true
          }
        }))
      },

      toggleWord: (isWordVisible: boolean) => {
        set((state) => ({
          gamePlay: {
            ...state.gamePlay,
            isWordVisible
          }
        }))
      },

      hideWord: () => {
        set((state) => ({
          gamePlay: {
            ...state.gamePlay,
            isWordVisible: false
          }
        }))
      },

      correctAnswer: () => {
        const { gameSetup, gamePlay } = get();

        if (!gameSetup) return;

        const currentTeam = gameSetup.teams[gamePlay.currentTeamIndex];
        const currentPlayerId = gamePlay.currentPlayerId;

        if (!currentTeam || !currentPlayerId) return;

        set((state) => ({
          gamePlay: {
            ...state.gamePlay,
            scores: {
              ...state.gamePlay.scores,
              [currentTeam.id]: addToNumber(state.gamePlay.scores[currentTeam.id], 1)
            },
            playerScores: {
              ...state.gamePlay.playerScores,
              [currentPlayerId]: addToNumber(
                state.gamePlay.playerScores[currentPlayerId],
                1
              )

            }
          }
        }));
      },

      skipWord: () => {
        const { gameSetup, gamePlay } = get();

        if (!gameSetup) return;

        const currentTeam = gameSetup.teams[gamePlay.currentTeamIndex];

        if (!currentTeam) return;

        set((state) => ({
          gamePlay: {
            ...state.gamePlay,
            skippedWords: {
              ...state.gamePlay.skippedWords,
              [currentTeam.id]: addToNumber(
                state.gamePlay.skippedWords[currentTeam.id], 1)
            }
          }
        }))
      },

      getNewWord: () => {
        const { gamePlay } = get();
        const availableWords = words.filter(
          (word) => !gamePlay.playedWordIds.includes(word.id)
        )

        const wordsToChooseFrom =
          availableWords.length > 0
            ? availableWords
            : words;

        const randomWord =
          wordsToChooseFrom[Math.floor(Math.random() * wordsToChooseFrom.length)];

        set((state) => ({
          gamePlay: {
            ...state.gamePlay,
            currentWord: randomWord.text,
            isWordVisible: false,
            playedWordIds:
              availableWords.length > 0
                ? [...state.gamePlay.playedWordIds, randomWord.id]
                : [randomWord.id],
          }
        }))
      },

      playAgain: () => {
        const { gameSetup } = get();

        if (!gameSetup) return;

        get().initializeGame(gameSetup);
      },

      resetGame: () => {
        set(DEFAULT_VALUE)
      },

      addGameToHistory: () => {
        const { gameSetup, gamePlay } = get();
        if (!gameSetup) return;

        const historyItem = {
          id: nanoid(),
          gameName: gameSetup.gameName,
          teams: gameSetup?.teams.map((team) => ({
            id: team.id,
            name: team.name,
            score: gamePlay.scores[team.id] ?? 0,
          }))
        }

        set((state) => ({
          gameHistory: [historyItem, ...state.gameHistory]
        }))
      }

    }),
    { name: "game-storage" }
  )
);