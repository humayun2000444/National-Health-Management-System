"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export function ChartCard({ title, children, action }: ChartCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        {action}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

interface LineChartData {
  name: string;
  [key: string]: string | number;
}

interface SimpleLineChartProps {
  data: LineChartData[];
  dataKey: string;
  xAxisKey?: string;
  color?: string;
  height?: number;
}

export function SimpleLineChart({
  data,
  dataKey,
  xAxisKey = "name",
  color = "#2563eb",
  height = 300,
}: SimpleLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey={xAxisKey}
          tick={{ fill: "#64748b", fontSize: 12 }}
          axisLine={{ stroke: "#e2e8f0" }}
        />
        <YAxis
          tick={{ fill: "#64748b", fontSize: 12 }}
          axisLine={{ stroke: "#e2e8f0" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          }}
        />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          dot={{ fill: color, strokeWidth: 2 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

interface SimpleAreaChartProps {
  data: LineChartData[];
  dataKey: string;
  xAxisKey?: string;
  color?: string;
  height?: number;
}

export function SimpleAreaChart({
  data,
  dataKey,
  xAxisKey = "name",
  color = "#2563eb",
  height = 300,
}: SimpleAreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey={xAxisKey}
          tick={{ fill: "#64748b", fontSize: 12 }}
          axisLine={{ stroke: "#e2e8f0" }}
        />
        <YAxis
          tick={{ fill: "#64748b", fontSize: 12 }}
          axisLine={{ stroke: "#e2e8f0" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          }}
        />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          fill={`url(#gradient-${dataKey})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

interface BarChartData {
  name: string;
  [key: string]: string | number;
}

interface SimpleBarChartProps {
  data: BarChartData[];
  dataKey: string;
  xAxisKey?: string;
  color?: string;
  height?: number;
}

export function SimpleBarChart({
  data,
  dataKey,
  xAxisKey = "name",
  color = "#2563eb",
  height = 300,
}: SimpleBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey={xAxisKey}
          tick={{ fill: "#64748b", fontSize: 12 }}
          axisLine={{ stroke: "#e2e8f0" }}
        />
        <YAxis
          tick={{ fill: "#64748b", fontSize: 12 }}
          axisLine={{ stroke: "#e2e8f0" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          }}
        />
        <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

interface PieChartData {
  name: string;
  value: number;
  color?: string;
  [key: string]: string | number | undefined;
}

interface SimplePieChartProps {
  data: PieChartData[];
  height?: number;
  showLegend?: boolean;
}

const DEFAULT_COLORS = [
  "#2563eb",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

export function SimplePieChart({
  data,
  height = 300,
  showLegend = true,
}: SimplePieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          }}
        />
        {showLegend && (
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => (
              <span className="text-sm text-slate-600">{value}</span>
            )}
          />
        )}
      </PieChart>
    </ResponsiveContainer>
  );
}

interface MultiLineChartProps {
  data: LineChartData[];
  lines: { dataKey: string; color: string; name?: string }[];
  xAxisKey?: string;
  height?: number;
}

export function MultiLineChart({
  data,
  lines,
  xAxisKey = "name",
  height = 300,
}: MultiLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey={xAxisKey}
          tick={{ fill: "#64748b", fontSize: 12 }}
          axisLine={{ stroke: "#e2e8f0" }}
        />
        <YAxis
          tick={{ fill: "#64748b", fontSize: 12 }}
          axisLine={{ stroke: "#e2e8f0" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          }}
        />
        <Legend />
        {lines.map((line) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            name={line.name || line.dataKey}
            stroke={line.color}
            strokeWidth={2}
            dot={{ fill: line.color, strokeWidth: 2 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
