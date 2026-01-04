"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ActivityTimeline } from "@/domain/types/analytics.type";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ActivityTimelineChartProps {
  data: ActivityTimeline[];
}

export const ActivityTimelineChart = ({ data }: ActivityTimelineChartProps) => {
  const formattedData = data.map((item) => ({
    ...item,
    hourLabel: `${item.hour}:00`,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Timeline</CardTitle>
        <CardDescription>Team activity distribution by hour</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hourLabel" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8b5cf6" name="Activities" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
