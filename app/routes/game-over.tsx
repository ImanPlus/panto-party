import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { createTitle } from "~/lib/createTitle";
import { playSound, sounds } from "~/lib/sounds";
import { useGameStore } from "~/stores/game";
import confetti from "canvas-confetti";
import GameResult from "~/components/game/GameResult";
import FinalScore from "~/components/game/FinalScore";
import TeamPerformance from "~/components/game/TeamPerformance";
import PlayerPerformance from "~/components/game/PlayerPerformance";
import CorrectVsSkipped from "~/components/game/CorrectVsSkipped";
import GameActions from "~/components/game/GameActions";
import { chartColors } from "~/lib/chartColors";
import GameHistory from "../components/game/GameHistory";

export function meta() {
  return [{ title: createTitle("Game Over") }];
}

export default function GameOver() {
  const gameSetup = useGameStore((state) => state.gameSetup);
  const scores = useGameStore((state) => state.gamePlay.scores);

  const skippedWords = useGameStore((state) => state.gamePlay.skippedWords);
  const playerScores = useGameStore((state) => state.gamePlay.playerScores);

  const navigate = useNavigate();

  const hasPlayedResultSound = useRef(false);

  useEffect(() => {
    if (!gameSetup || hasPlayedResultSound.current) return;

    hasPlayedResultSound.current = true;

    const highestScore = Math.max(
      ...gameSetup.teams.map((team) => scores[team.id] ?? 0),
    );

    const winningTeams = gameSetup.teams.filter(
      (team) => (scores[team.id] ?? 0) === highestScore,
    );

    if (winningTeams.length === 1) {
      playSound(sounds.victory);

      confetti({
        particleCount: 300,
        spread: 70,
        startVelocity: 45,
        origin: {
          x: 0.1,
          y: 0.6,
        },
      });

      confetti({
        particleCount: 100,
        spread: 70,
        startVelocity: 45,
        origin: {
          x: 0.9,
          y: 0.6,
        },
      });
    } else {
      playSound(sounds.draw);
    }
  }, [gameSetup, scores]);

  if (!gameSetup) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Game Setup Not Found</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">
            We couldn't find the game setup.
          </p>

          <Button onClick={() => navigate("/game-setup")}>
            Back to Game Setup
          </Button>
        </CardContent>
      </Card>
    );
  }

  const highestScore = Math.max(
    ...gameSetup.teams.map((team) => scores[team.id] ?? 0),
  );

  const winningTeams = gameSetup.teams.filter(
    (team) => (scores[team.id] ?? 0) === highestScore,
  );

  const teamPerformanceData = gameSetup.teams.map((team) => ({
    name: team.name,
    score: scores[team.id] ?? 0,
  }));

  const playerPerformanceData = gameSetup.teams.flatMap((team) =>
    team.players.map((player) => ({
      name: player.name,
      score: playerScores[player.id] ?? 0,
    })),
  );

  const correctVsSkippedData = [
    {
      name: "Correct",
      value: Object.values(scores).reduce((total, score) => total + score, 0),
    },
    {
      name: "Skipped",
      value: Object.values(skippedWords).reduce(
        (total, skipped) => total + skipped,
        0,
      ),
    },
  ];

  return (
    <div className="w-full max-w-6xl px-4 py-8">
      <div className="space-y-6">
        <GameResult winningTeams={winningTeams} highestScore={highestScore} />

        {/* Final Score */}
        <FinalScore teams={gameSetup.teams} scores={scores} />

        {/* Statistics */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Team Performance */}
          <TeamPerformance
            data={teamPerformanceData}
            chartColors={chartColors}
          />
          {/* Player Performance */}
          <PlayerPerformance
            data={playerPerformanceData}
            chartColors={chartColors}
          />
          {/* Correct vs Skipped */}
          <CorrectVsSkipped
            data={correctVsSkippedData}
            chartColors={chartColors}
          />
          {/* Game History */}
          <GameHistory />
        </div>

        {/* Buttons - Play Again/ New Game */}
        <GameActions />
      </div>
    </div>
  );
}
