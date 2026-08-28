import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

type FinalScoreProps = {
  teams: {
    id: string;
    name: string;
  }[];
  scores: Record<string, number>;
};

export default function FinalScore({ teams, scores }: FinalScoreProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Final Score</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {teams.map((team) => (
          <div
            key={team.id}
            className="flex justify-between items-center bg-muted rounded-lg px-4 py-3"
          >
            <span className="font-medium">{team.name}</span>
            <span className="text-xl font-bold tabular-nums">
              {scores[team.id] ?? 0}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
