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
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Sector,
} from "recharts";
import { Tag, TrendingUp } from "lucide-react";

interface LabelDistribution {
  labelName: string;
  cardsCount: number;
  labelColor: string;
}

interface LabelsDistributionChartProps {
  data: LabelDistribution[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-background border border-border p-4 rounded-lg shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-4 h-4 rounded"
            style={{ backgroundColor: data.payload.labelColor }}
          />
          <p className="font-semibold text-foreground">{data.name}</p>
        </div>
        <p className="text-sm text-muted-foreground">
          Cards:{" "}
          <span className="font-semibold text-foreground">{data.value}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          Percentage:{" "}
          <span className="font-semibold text-foreground">
            {data.payload.percent}%
          </span>
        </p>
      </div>
    );
  }
  return null;
};

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
    props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

export const LabelsDistributionChart = ({
  data,
}: LabelsDistributionChartProps) => {
  const [chartType, setChartType] = useState<"pie" | "donut">("donut");

  const total = data.reduce((sum, item) => sum + item.cardsCount, 0);
  const mostUsedLabel = data.reduce((prev, current) =>
    prev.cardsCount > current.cardsCount ? prev : current
  );

  const chartData = data.map((item) => ({
    ...item,
    percent: ((item.cardsCount / total) * 100).toFixed(1),
  }));

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="space-y-1 pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Tag className="w-6 h-6 text-primary" />
              Labels Distribution
            </CardTitle>
            <CardDescription className="text-base">
              Card categorization by labels
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setChartType("donut")}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                chartType === "donut"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              Donut
            </button>
            <button
              onClick={() => setChartType("pie")}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                chartType === "pie"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              Pie
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4 pt-4">
          <div className="bg-blue-50 dark:bg-blue-950/50 p-3 rounded-lg border border-blue-200 dark:border-blue-900">
            <div className="flex items-center gap-2 mb-1">
              <Tag className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-medium text-muted-foreground">
                Total Labels
              </span>
            </div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {data.length}
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-950/50 p-3 rounded-lg border border-green-200 dark:border-green-900">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs font-medium text-muted-foreground">
                Total Cards
              </span>
            </div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {total}
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-950/50 p-3 rounded-lg border border-purple-200 dark:border-purple-900">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              <span className="text-xs font-medium text-muted-foreground">
                Most Used
              </span>
            </div>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400 truncate">
              {mostUsedLabel.labelName}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="cardsCount"
              nameKey="labelName"
              cx="50%"
              cy="50%"
              innerRadius={chartType === "donut" ? 80 : 0}
              outerRadius={140}
              paddingAngle={2}
              activeShape={renderActiveShape}
              label={({ name, percent }) => `${name} (${percent}%)`}
              labelLine={{
                stroke: "hsl(var(--muted-foreground))",
                strokeWidth: 1,
              }}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.labelColor}
                  className="cursor-pointer transition-opacity hover:opacity-80"
                />
              ))}
            </Pie>

            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>

        {/* Labels List */}
        <div className="mt-6 space-y-3">
          <h4 className="font-semibold text-foreground">Label Details</h4>
          <div className="grid gap-2">
            {chartData.map((label, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: label.labelColor }}
                  />
                  <span className="font-medium text-foreground">
                    {label.labelName}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {label.cardsCount} cards
                  </span>
                  <span className="font-semibold text-primary min-w-[50px] text-right">
                    {label.percent}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
