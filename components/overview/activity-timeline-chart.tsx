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
  ResponsiveContainer,
  Cell,
  Line,
  ComposedChart,
} from "recharts";
import { Clock, TrendingUp, Activity } from "lucide-react";

interface ActivityTimeline {
  hour: number;
  count: number;
}

interface ActivityTimelineChartProps {
  data: ActivityTimeline[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border p-4 rounded-lg shadow-xl">
        <p className="font-semibold text-foreground mb-2">{label}</p>
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">Activities:</span>
          <span className="font-semibold text-foreground">
            {payload[0].value}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export const ActivityTimelineChart = ({ data }: ActivityTimelineChartProps) => {
  const [showTrend, setShowTrend] = useState(false);

  const formattedData = data.map((item) => ({
    ...item,
    hourLabel: `${item.hour.toString().padStart(2, "0")}:00`,
  }));

  const totalActivities = data.reduce((sum, item) => sum + item.count, 0);
  const avgActivities = (totalActivities / data.length).toFixed(1);
  const peakHour = data.reduce((prev, current) =>
    prev.count > current.count ? prev : current
  );
  const maxActivity = Math.max(...data.map((d) => d.count));

  const getBarColor = (value: number) => {
    const intensity = value / maxActivity;
    if (intensity > 0.7) return "rgb(139 92 246)"; // violet-500
    if (intensity > 0.4) return "rgb(59 130 246)"; // blue-500
    return "rgb(148 163 184)"; // slate-400
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="space-y-1 pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Clock className="w-6 h-6 text-primary" />
              Activity Timeline
            </CardTitle>
            <CardDescription className="text-base">
              Team activity distribution by hour
            </CardDescription>
          </div>
          <button
            onClick={() => setShowTrend(!showTrend)}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              showTrend
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {showTrend ? "Hide" : "Show"} Trend
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4 pt-4">
          <div className="bg-blue-50 dark:bg-blue-950/50 p-3 rounded-lg border border-blue-200 dark:border-blue-900">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-medium text-muted-foreground">
                Total Activities
              </span>
            </div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {totalActivities}
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-950/50 p-3 rounded-lg border border-purple-200 dark:border-purple-900">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              <span className="text-xs font-medium text-muted-foreground">
                Average/Hour
              </span>
            </div>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {avgActivities}
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-950/50 p-3 rounded-lg border border-green-200 dark:border-green-900">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-3 h-3 text-green-600 dark:text-green-400" />
              <span className="text-xs font-medium text-muted-foreground">
                Peak Hour
              </span>
            </div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {peakHour.hour.toString().padStart(2, "0")}:00
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          {showTrend ? (
            <ComposedChart
              data={formattedData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-muted"
                vertical={false}
              />
              <XAxis
                dataKey="hourLabel"
                tick={{ fontSize: 11 }}
                className="text-muted-foreground"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "hsl(var(--muted))" }}
              />
              <Bar dataKey="count" fill="rgb(59 130 246)" radius={[8, 8, 0, 0]}>
                {formattedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.count)} />
                ))}
              </Bar>
              <Line
                type="monotone"
                dataKey="count"
                stroke="rgb(139 92 246)"
                strokeWidth={3}
                dot={false}
              />
            </ComposedChart>
          ) : (
            <BarChart
              data={formattedData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-muted"
                vertical={false}
              />
              <XAxis
                dataKey="hourLabel"
                tick={{ fontSize: 11 }}
                className="text-muted-foreground"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "hsl(var(--muted))" }}
              />
              <Bar
                dataKey="count"
                fill="rgb(59 130 246)"
                radius={[8, 8, 0, 0]}
                name="Activities"
              >
                {formattedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getBarColor(entry.count)}
                    className="cursor-pointer transition-opacity hover:opacity-80"
                  />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>

        {/* Activity Breakdown */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground">
              Morning (6-12)
            </h4>
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {data
                  .filter((d) => d.hour >= 6 && d.hour < 12)
                  .reduce((sum, d) => sum + d.count, 0)}
              </p>
              <p className="text-xs text-muted-foreground">activities</p>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground">
              Afternoon (12-18)
            </h4>
            <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-900">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {data
                  .filter((d) => d.hour >= 12 && d.hour < 18)
                  .reduce((sum, d) => sum + d.count, 0)}
              </p>
              <p className="text-xs text-muted-foreground">activities</p>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground">
              Evening (18-24)
            </h4>
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-900">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {data
                  .filter((d) => d.hour >= 18 || d.hour < 6)
                  .reduce((sum, d) => sum + d.count, 0)}
              </p>
              <p className="text-xs text-muted-foreground">activities</p>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground">
              Night (0-6)
            </h4>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-900">
              <p className="text-2xl font-bold text-slate-600 dark:text-slate-400">
                {data
                  .filter((d) => d.hour >= 0 && d.hour < 6)
                  .reduce((sum, d) => sum + d.count, 0)}
              </p>
              <p className="text-xs text-muted-foreground">activities</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
