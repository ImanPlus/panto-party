import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

type playerPerformanceData = {
  name: string;
  score: number;
};

type playerPerformanceProps = {
  data: playerPerformanceData[];
  chartColors: string[];
};

export default function PlayerPerformance({
  data,
  chartColors,
}: playerPerformanceProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Player Performance</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 10, left: 10, bottom: 10 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} width="auto" />
              <Tooltip />
              <Bar
                dataKey="score"
                name="Score"
                radius={[6, 6, 0, 0]}
                barSize={40}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={chartColors[index % chartColors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
