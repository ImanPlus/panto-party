import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

type GameResultProps = {
  winningTeams: {
    id: string;
    name: string;
  }[];
  highestScore: number;
};

export default function GameResult({
  winningTeams,
  highestScore,
}: GameResultProps) {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-3xl">🏆 Game Over</CardTitle>
      </CardHeader>

      <CardContent className="text-center">
        {winningTeams.length === 1 ? (
          <>
            <p className="text-2xl font-bold">{winningTeams[0].name} Wins!</p>

            <p className="mt-2 text-muted-foreground">{highestScore} POINTS</p>
          </>
        ) : (
          <div>
            <p className="text-2xl font-bold">🤝 IT'S A DRAW!</p>
            <p className="mt-2 text-muted-foreground">
              {winningTeams.map((team) => team.name).join(" & ")} tied with{" "}
              {highestScore} points.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
