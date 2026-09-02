import type { GameHistory } from "~/types/game";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { useGameStore } from "~/stores/game";
import { CardContent } from "~/components/ui/card";

export default function GameHistory() {
  const gameHistory = useGameStore((state) => state.gameHistory);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Game History</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <h3 className="mb-5 text-lg font-semibold">Previous Games</h3>
        {gameHistory.map((game) => (
          <div key={game.id} className="bg-muted p-2 rounded-md">
            <p className="mb-1 font-medium">{game.gameName}</p>
            <p className="text-sm text-muted-foreground">
              {game.teams.map((team, index) => (
                <span key={team.id}>
                  {index > 0 && " - "}
                  {team.name} : {team.score}
                </span>
              ))}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
