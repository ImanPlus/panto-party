import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

type correctVsSkippedData = {
  name: string;
  value: number;
};

type correctVsSkippedProps = {
  data: correctVsSkippedData[];
  chartColors: string[];
};

export default function CorrectVsSkipped({
  data,
  chartColors,
}: correctVsSkippedProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Correct vs Skipped</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mx-auto h-72 w-full max-w-sm">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius="80%"
                label={({ percent = 0 }) => `${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={chartColors[index % chartColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
