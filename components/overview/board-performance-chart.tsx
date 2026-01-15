"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { BarChart3, Target, AlertCircle, CheckCircle2 } from "lucide-react";

interface BoardPerformance {
  boardName: string;
  totalCards: number;
  completedCards: number;
  overdueCards: number;
}

interface BoardPerformanceChartProps {
  data: BoardPerformance[];
}

const COLORS = [
  "rgb(59 130 246)", // blue-500
  "rgb(139 92 246)", // violet-500
  "rgb(236 72 153)", // pink-500
  "rgb(245 158 11)", // amber-500
  "rgb(16 185 129)", // emerald-500
  "rgb(6 182 212)", // cyan-500
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const total = payload[0]?.payload?.totalCards || 0;
    const completed = payload[0]?.payload?.completedCards || 0;
    const overdue = payload[0]?.payload?.overdueCards || 0;
    const completionRate =
      total > 0 ? ((completed / total) * 100).toFixed(1) : "0";

    return (
      <div className="bg-background border border-border p-4 rounded-lg shadow-xl min-w-[200px]">
        <p className="font-bold text-foreground mb-3 text-base">{label}</p>
        <div className="space-y-2">
          {payload.map((entry: any, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-muted-foreground">
                  {entry.name}
                </span>
              </div>
              <span className="font-semibold text-foreground">
                {entry.value}
              </span>
            </div>
          ))}
          <div className="pt-2 mt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Completion Rate
              </span>
              <span className="font-bold text-green-600 dark:text-green-400">
                {completionRate}%
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const BoardPerformanceChart = ({ data }: BoardPerformanceChartProps) => {
  const [selectedMetric, setSelectedMetric] = useState<"all" | "completion">(
    "all"
  );

  const totalCards = data.reduce((sum, item) => sum + item.totalCards, 0);
  const totalCompleted = data.reduce(
    (sum, item) => sum + item.completedCards,
    0
  );
  const totalOverdue = data.reduce((sum, item) => sum + item.overdueCards, 0);
  const avgCompletionRate =
    totalCards > 0 ? ((totalCompleted / totalCards) * 100).toFixed(1) : "0";

  const chartData = data.map((item) => ({
    ...item,
    completionRate:
      item.totalCards > 0
        ? ((item.completedCards / item.totalCards) * 100).toFixed(1)
        : 0,
  }));

  const getBarColor = (index: number) => {
    return COLORS[index % COLORS.length];
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="space-y-1 pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-primary" />
              Board Performance Dashboard
            </CardTitle>
            <CardDescription className="text-base">
              Compare completion rates and progress across all boards
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedMetric("all")}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                selectedMetric === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              All Metrics
            </button>
            <button
              onClick={() => setSelectedMetric("completion")}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                selectedMetric === "completion"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              Completion
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-4 gap-3 pt-4">
          <div className="bg-blue-50 dark:bg-blue-950/50 p-3 rounded-lg border border-blue-200 dark:border-blue-900">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-medium text-muted-foreground">
                Total Cards
              </span>
            </div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {totalCards}
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-950/50 p-3 rounded-lg border border-green-200 dark:border-green-900">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-xs font-medium text-muted-foreground">
                Completed
              </span>
            </div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {totalCompleted}
            </p>
          </div>
          <div className="bg-red-50 dark:bg-red-950/50 p-3 rounded-lg border border-red-200 dark:border-red-900">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
              <span className="text-xs font-medium text-muted-foreground">
                Overdue
              </span>
            </div>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {totalOverdue}
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-950/50 p-3 rounded-lg border border-purple-200 dark:border-purple-900">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold">
                %
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                Avg Rate
              </span>
            </div>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {avgCompletionRate}%
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            barGap={8}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-muted"
              vertical={false}
            />
            <XAxis
              dataKey="boardName"
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
              angle={-15}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "hsl(var(--muted))" }}
            />
            <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="square" />
            {selectedMetric === "all" ? (
              <>
                <Bar
                  dataKey="totalCards"
                  fill="rgb(59 130 246)"
                  name="Total Cards"
                  radius={[8, 8, 0, 0]}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getBarColor(index)}
                      opacity={0.7}
                    />
                  ))}
                </Bar>
                <Bar
                  dataKey="completedCards"
                  fill="rgb(34 197 94)"
                  name="Completed"
                  radius={[8, 8, 0, 0]}
                />
                <Bar
                  dataKey="overdueCards"
                  fill="rgb(239 68 68)"
                  name="Overdue"
                  radius={[8, 8, 0, 0]}
                />
              </>
            ) : (
              <Bar
                dataKey="completedCards"
                fill="rgb(34 197 94)"
                name="Completed Cards"
                radius={[8, 8, 0, 0]}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="rgb(34 197 94)" />
                ))}
              </Bar>
            )}
          </BarChart>
        </ResponsiveContainer>

        {/* Board Performance Table */}
        <div className="mt-6 overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-foreground">
                  Board
                </th>
                <th className="px-4 py-3 text-center font-semibold text-foreground">
                  Total
                </th>
                <th className="px-4 py-3 text-center font-semibold text-foreground">
                  Completed
                </th>
                <th className="px-4 py-3 text-center font-semibold text-foreground">
                  Overdue
                </th>
                <th className="px-4 py-3 text-center font-semibold text-foreground">
                  Rate
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {chartData.map((board, index) => (
                <tr key={index} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">
                    {board.boardName}
                  </td>
                  <td className="px-4 py-3 text-center text-muted-foreground">
                    {board.totalCards}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-400">
                      {board.completedCards}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-400">
                      {board.overdueCards}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center font-semibold text-purple-600 dark:text-purple-400">
                    {board.completionRate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
