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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { TrendingUp, Activity } from "lucide-react";

interface CardsTrend {
  date: string;
  created: number;
  completed: number;
  inProgress: number;
}

interface CardsTrendChartProps {
  data: CardsTrend[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border p-4 rounded-lg shadow-lg">
        <p className="font-semibold text-foreground mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-semibold text-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const CardsTrendChart = ({ data }: CardsTrendChartProps) => {
  const [chartType, setChartType] = useState<"line" | "area">("area");

  const totalCreated = data.reduce((sum, item) => sum + item.created, 0);
  const totalCompleted = data.reduce((sum, item) => sum + item.completed, 0);
  const completionRate =
    totalCreated > 0 ? ((totalCompleted / totalCreated) * 100).toFixed(1) : "0";

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="space-y-1 pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Activity className="w-6 h-6 text-primary" />
              Cards Trend Analysis
            </CardTitle>
            <CardDescription className="text-base">
              Track card creation and completion over time
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setChartType("area")}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                chartType === "area"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              Area
            </button>
            <button
              onClick={() => setChartType("line")}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                chartType === "line"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              Line
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4 pt-4">
          <div className="bg-blue-50 dark:bg-blue-950/50 p-3 rounded-lg border border-blue-200 dark:border-blue-900">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-xs font-medium text-muted-foreground">
                Total Created
              </span>
            </div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {totalCreated}
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-950/50 p-3 rounded-lg border border-green-200 dark:border-green-900">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs font-medium text-muted-foreground">
                Total Completed
              </span>
            </div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {totalCompleted}
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-950/50 p-3 rounded-lg border border-purple-200 dark:border-purple-900">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              <span className="text-xs font-medium text-muted-foreground">
                Completion Rate
              </span>
            </div>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {completionRate}%
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          {chartType === "area" ? (
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="rgb(59 130 246)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="rgb(59 130 246)"
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="rgb(34 197 94)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="rgb(34 197 94)"
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient
                  id="colorInProgress"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="rgb(245 158 11)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="rgb(245 158 11)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="circle" />
              <Area
                type="monotone"
                dataKey="created"
                stroke="rgb(59 130 246)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCreated)"
                name="Created"
              />
              <Area
                type="monotone"
                dataKey="completed"
                stroke="rgb(34 197 94)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCompleted)"
                name="Completed"
              />
              <Area
                type="monotone"
                dataKey="inProgress"
                stroke="rgb(245 158 11)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorInProgress)"
                name="In Progress"
              />
            </AreaChart>
          ) : (
            <LineChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="circle" />
              <Line
                type="monotone"
                dataKey="created"
                stroke="rgb(59 130 246)"
                strokeWidth={3}
                dot={{ r: 4, fill: "rgb(59 130 246)" }}
                activeDot={{ r: 6 }}
                name="Created"
              />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="rgb(34 197 94)"
                strokeWidth={3}
                dot={{ r: 4, fill: "rgb(34 197 94)" }}
                activeDot={{ r: 6 }}
                name="Completed"
              />
              <Line
                type="monotone"
                dataKey="inProgress"
                stroke="rgb(245 158 11)"
                strokeWidth={3}
                dot={{ r: 4, fill: "rgb(245 158 11)" }}
                activeDot={{ r: 6 }}
                name="In Progress"
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
