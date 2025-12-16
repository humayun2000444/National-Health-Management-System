import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
  className?: string;
  iconColor?: string;
  iconBg?: string;
}

export function StatsCard({
  title,
  value,
  icon,
  trend,
  description,
  className,
  iconColor = "text-blue-600",
  iconBg = "bg-blue-100",
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl p-6 shadow-sm border border-slate-100",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              {trend.isPositive ? (
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span
                className={cn(
                  "text-sm font-medium",
                  trend.isPositive ? "text-emerald-600" : "text-red-600"
                )}
              >
                {trend.isPositive ? "+" : ""}
                {trend.value}%
              </span>
              <span className="text-sm text-slate-500">vs last month</span>
            </div>
          )}
          {description && (
            <p className="mt-2 text-sm text-slate-500">{description}</p>
          )}
        </div>
        <div className={cn("p-3 rounded-xl", iconBg)}>
          <div className={cn("h-6 w-6", iconColor)}>{icon}</div>
        </div>
      </div>
    </div>
  );
}
