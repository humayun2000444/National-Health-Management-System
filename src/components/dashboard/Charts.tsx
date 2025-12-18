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
  RadialBarChart,
  RadialBar,
  ComposedChart,
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

// Stacked Bar Chart
interface StackedBarChartProps {
  data: BarChartData[];
  bars: { dataKey: string; color: string; name?: string }[];
  xAxisKey?: string;
  height?: number;
}

export function StackedBarChart({
  data,
  bars,
  xAxisKey = "name",
  height = 300,
}: StackedBarChartProps) {
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
        <Legend />
        {bars.map((bar, index) => (
          <Bar
            key={bar.dataKey}
            dataKey={bar.dataKey}
            name={bar.name || bar.dataKey}
            stackId="stack"
            fill={bar.color}
            radius={index === bars.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

// Radial Progress Chart
interface RadialProgressChartProps {
  data: { name: string; value: number; fill: string }[];
  height?: number;
}

export function RadialProgressChart({
  data,
  height = 300,
}: RadialProgressChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadialBarChart
        cx="50%"
        cy="50%"
        innerRadius="30%"
        outerRadius="100%"
        barSize={20}
        data={data}
        startAngle={180}
        endAngle={0}
      >
        <RadialBar
          background
          dataKey="value"
          cornerRadius={10}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          }}
        />
        <Legend
          iconSize={10}
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
        />
      </RadialBarChart>
    </ResponsiveContainer>
  );
}

// Composed Chart (Bar + Line)
interface ComposedChartProps {
  data: LineChartData[];
  barDataKey: string;
  lineDataKey: string;
  barColor?: string;
  lineColor?: string;
  xAxisKey?: string;
  height?: number;
}

export function SimpleComposedChart({
  data,
  barDataKey,
  lineDataKey,
  barColor = "#2563eb",
  lineColor = "#10b981",
  xAxisKey = "name",
  height = 300,
}: ComposedChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data}>
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
        <Bar dataKey={barDataKey} fill={barColor} radius={[4, 4, 0, 0]} />
        <Line
          type="monotone"
          dataKey={lineDataKey}
          stroke={lineColor}
          strokeWidth={2}
          dot={{ fill: lineColor, strokeWidth: 2 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

// Mini Sparkline Chart
interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
}

export function Sparkline({
  data,
  color = "#2563eb",
  height = 40,
}: SparklineProps) {
  const chartData = data.map((value, index) => ({ value, index }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="sparklineGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill="url(#sparklineGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// Gauge Chart
interface GaugeChartProps {
  value: number;
  max?: number;
  color?: string;
  label?: string;
  height?: number;
}

export function GaugeChart({
  value,
  max = 100,
  color = "#2563eb",
  label,
  height = 200,
}: GaugeChartProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const data = [
    { name: "value", value: percentage, fill: color },
    { name: "remaining", value: 100 - percentage, fill: "#e2e8f0" },
  ];

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            startAngle={180}
            endAngle={0}
            innerRadius="60%"
            outerRadius="100%"
            paddingAngle={0}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ marginTop: height * 0.15 }}>
        <span className="text-3xl font-bold text-slate-900">{value}</span>
        {label && <span className="text-sm text-slate-500">{label}</span>}
      </div>
    </div>
  );
}
