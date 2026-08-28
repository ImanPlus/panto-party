import clsx from "clsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { WordCard } from "~/components/game/WordCard";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { createTitle } from "~/lib/createTitle";
import { playSound, sounds } from "~/lib/sounds";
import { useGameStore } from "~/stores/game";

export function meta() {
  return [{ title: createTitle("Game Screen") }];
}

export default function Game() {
  const { gameSetup, gamePlay } = useGameStore();
  const timeLeft = useGameStore((state) => state.gamePlay.timeLeft);
  const decreaseTime = useGameStore((action) => action.decreaseTime);
  const endTurn = useGameStore((action) => action.endTurn);
  const isGameOver = useGameStore((state) => state.gamePlay.isGameOver);
  const currentWord = useGameStore((state) => state.gamePlay.currentWord);
  const isWordVisible = useGameStore((state) => state.gamePlay.isWordVisible);
  const showWord = useGameStore((action) => action.showWord);
  const hideWord = useGameStore((action) => action.hideWord);
  const correctAnswer = useGameStore((action) => action.correctAnswer);
  const skipWord = useGameStore((action) => action.skipWord);
  const getNewWord = useGameStore((action) => action.getNewWord);

  const [shouldGetNewWord, setShouldGetNewWord] = useState(false);
  const navigate = useNavigate();

  // Navigate to Game Over
  useEffect(() => {
    if (isGameOver) {
      navigate("/game-over");
    }
  }, [isGameOver, navigate]);

  // Timer
  useEffect(() => {
    if (!gameSetup || isGameOver) return;

    if (timeLeft <= 0) {
      const isLastTurn =
        gamePlay.currentRound === gameSetup.numberOfRounds &&
        gamePlay.currentTeamIndex === gameSetup.teams.length - 1;
      if (!isLastTurn) {
        playSound(sounds.timeUp);
      }

      endTurn();
      return;
    }

    const timer = setInterval(() => {
      if (timeLeft <= 6 && timeLeft > 1) {
        playSound(sounds.fastTickTock, 900);
      }

      decreaseTime();
    }, 1000);

    return () => clearInterval(timer);
  }, [gameSetup, timeLeft, decreaseTime, endTurn, isGameOver]);

  if (!gameSetup) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="p-10 text-center">
          <p className="text-muted-foreground">Game setup not found.</p>
        </CardContent>
      </Card>
    );
  }

  const currentTeam = gameSetup.teams[gamePlay.currentTeamIndex];
  const currentPlayer = currentTeam?.players.find(
    (player) => player.id === gamePlay.currentPlayerId,
  );

  const timerProgress = (timeLeft / gameSetup.turnDuration) * 100;

  const handleWordFlip = () => {
    if (!isWordVisible) {
      playSound(sounds.flip);
      showWord();
    }
  };

  const handleFlipEnd = () => {
    if (!shouldGetNewWord) return;

    getNewWord();
    setShouldGetNewWord(false);
  };

  const handleCorrect = () => {
    playSound(sounds.correct);
    correctAnswer();
    setShouldGetNewWord(true);
    hideWord();
  };

  const handleSkip = () => {
    playSound(sounds.skip);
    skipWord();
    setShouldGetNewWord(true);
    hideWord();
  };

  return (
    <div className="w-full max-w-5xl px-4 py-6">
      <div className="space-y-6">
        {/* Game Header */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Rounds */}
              <div>
                <p className="text-sm text-muted-foreground">Round</p>
                <p className="text-2xl font-bold">
                  {gamePlay.currentRound}
                  <span className="text-base font-normal text-muted-foreground">
                    {" "}
                    / {gameSetup.numberOfRounds}
                  </span>
                </p>
              </div>

              {/* Timeer */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Time Left</p>

                <p className="text-3xl font-bold tabular-nums">{timeLeft}s</p>
              </div>

              <Badge variant="secondary" className="self-start sm:self-auto">
                🎭 Panto Party
              </Badge>
            </div>

            {/* Progress */}
            <Progress
              value={timerProgress}
              className="mt-5"
              aria-label="Turn time remaining"
            />
          </CardContent>
        </Card>

        {/* Current Turn */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl sm:text-3xl">
              {currentTeam?.name} Is Playing
            </CardTitle>

            <p className="text-muted-foreground">
              {currentPlayer?.name} is acting
            </p>
          </CardHeader>

          <CardContent className="flex flex-col items-center gap-6">
            {/* Word Card */}
            <WordCard
              word={currentWord}
              isFlipped={isWordVisible}
              onFlip={handleWordFlip}
              onFlipEnd={handleFlipEnd}
            />

            {/* Action Buttons */}
            {isWordVisible && (
              <div className="grid w-full grid-cols-2 gap-3 max-w-md">
                <Button size="lg" onClick={handleCorrect}>
                  ✓ Correct
                </Button>

                <Button size="lg" onClick={handleSkip}>
                  → Skip
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Scoreboard */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">🏆 Scoreboard</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {gameSetup.teams.map((team, index) => {
              const isCurrentTeam = index === gamePlay.currentTeamIndex;

              return (
                <div
                  key={team.id}
                  className={clsx(
                    "flex justify-between items-center rounded-lg px-4 py-3",
                    isCurrentTeam
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted",
                  )}
                >
                  <span className="font-medium">{team.name}</span>

                  <span className="text-xl font-bold tabular-nums">
                    {gamePlay.scores[team.id] ?? 0}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
