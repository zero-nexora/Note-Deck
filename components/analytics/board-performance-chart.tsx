"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BoardPerformance } from "@/domain/types/analytics.type";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface BoardPerformanceChartProps {
  data: BoardPerformance[];
}

export const BoardPerformanceChart = ({ data }: BoardPerformanceChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Board Performance</CardTitle>
        <CardDescription>
          Compare completion rates across all boards
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="boardName" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalCards" fill="#3b82f6" name="Total Cards" />
            <Bar dataKey="completedCards" fill="#22c55e" name="Completed" />
            <Bar dataKey="overdueCards" fill="#ef4444" name="Overdue" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
