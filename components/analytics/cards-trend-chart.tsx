"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CardsTrend } from "@/domain/types/analytics.type";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface CardsTrendChartProps {
  data: CardsTrend[];
}

export const CardsTrendChart = ({ data }: CardsTrendChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cards Trend</CardTitle>
        <CardDescription>
          Track card creation and completion over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="created"
              stroke="#3b82f6"
              name="Created"
            />
            <Line
              type="monotone"
              dataKey="completed"
              stroke="#22c55e"
              name="Completed"
            />
            <Line
              type="monotone"
              dataKey="inProgress"
              stroke="#f59e0b"
              name="In Progress"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
