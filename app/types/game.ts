export type Id = string

export type Player = {
  id: Id;
  name: string;
};

export type Team = {
  id: Id;
  name: string;
  players: Player[];
};

export type GameSetupForm = {
  gameName: string;
  turnDuration: number;
  numberOfRounds: number;
  teams: Team[];
}

export type GamePlayState = {
  currentTeamIndex: number;
  currentPlayerId: string | null;
  currentRound: number;
  playedPlayerIds: Record<string, string[]>
  playedWordIds: string[];
  scores: Record<string, number>;
  currentWord: string;
  isWordVisible: boolean;
  timeLeft: number;
  isGameOver: boolean;
  skippedWords: Record<string, number>;
  playerScores: Record<string, number>;
}

export type GameHistory = {
  id: Id;
  gameName: string;
  teams: {
    id: Id;
    name: string;
    score: number;
  }[];
}

export type Word = {
  id: string;
  text: string;
}