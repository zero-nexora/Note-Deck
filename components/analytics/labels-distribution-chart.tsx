"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LabelDistribution } from "@/domain/types/analytics.type";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface LabelsDistributionChartProps {
  data: LabelDistribution[];
}

type ChartDataInput = LabelDistribution & {
  [key: string]: any;
};

export const LabelsDistributionChart = ({
  data,
}: LabelsDistributionChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Labels Distribution</CardTitle>
        <CardDescription>Card categorization by labels</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data as ChartDataInput[]}
              dataKey="cardsCount"
              nameKey="labelName"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }) =>
                `${name} (${(percent! * 100).toFixed(1)}%)`
              }
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.labelColor} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
