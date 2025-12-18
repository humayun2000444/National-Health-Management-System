"use client";

import { AlertTriangle, AlertCircle, XCircle, Info } from "lucide-react";
import { Badge } from "./Badge";

interface InteractionWarning {
  severity: "mild" | "moderate" | "severe" | "contraindicated";
  drugs: string[];
  description: string;
  recommendation: string;
}

interface DrugInteractionAlertProps {
  warnings: InteractionWarning[];
  onDismiss?: () => void;
}

export function DrugInteractionAlert({ warnings, onDismiss }: DrugInteractionAlertProps) {
  if (warnings.length === 0) return null;

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case "contraindicated":
        return {
          bg: "bg-red-50 border-red-200",
          icon: <XCircle className="h-5 w-5 text-red-600" />,
          badge: "danger" as const,
          text: "text-red-800",
        };
      case "severe":
        return {
          bg: "bg-red-50 border-red-200",
          icon: <AlertCircle className="h-5 w-5 text-red-600" />,
          badge: "danger" as const,
          text: "text-red-800",
        };
      case "moderate":
        return {
          bg: "bg-amber-50 border-amber-200",
          icon: <AlertTriangle className="h-5 w-5 text-amber-600" />,
          badge: "warning" as const,
          text: "text-amber-800",
        };
      case "mild":
      default:
        return {
          bg: "bg-yellow-50 border-yellow-200",
          icon: <Info className="h-5 w-5 text-yellow-600" />,
          badge: "secondary" as const,
          text: "text-yellow-800",
        };
    }
  };

  const hasSevere = warnings.some(
    (w) => w.severity === "contraindicated" || w.severity === "severe"
  );

  return (
    <div className="space-y-3">
      {/* Summary Header */}
      <div
        className={`p-4 rounded-lg border ${
          hasSevere ? "bg-red-50 border-red-300" : "bg-amber-50 border-amber-300"
        }`}
      >
        <div className="flex items-start gap-3">
          {hasSevere ? (
            <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <h4 className={`font-semibold ${hasSevere ? "text-red-800" : "text-amber-800"}`}>
              {warnings.length} Drug Interaction{warnings.length > 1 ? "s" : ""} Detected
            </h4>
            <p className={`text-sm mt-1 ${hasSevere ? "text-red-700" : "text-amber-700"}`}>
              {hasSevere
                ? "CRITICAL: Severe interactions found. Review carefully before prescribing."
                : "Please review the interactions below before proceeding."}
            </p>
          </div>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-slate-400 hover:text-slate-600"
            >
              <XCircle className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Individual Warnings */}
      <div className="space-y-2">
        {warnings.map((warning, index) => {
          const styles = getSeverityStyles(warning.severity);
          return (
            <div
              key={index}
              className={`p-4 rounded-lg border ${styles.bg}`}
            >
              <div className="flex items-start gap-3">
                {styles.icon}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={styles.badge}>
                      {warning.severity.toUpperCase()}
                    </Badge>
                    <span className={`font-medium ${styles.text}`}>
                      {warning.drugs.join(" + ")}
                    </span>
                  </div>
                  <p className={`text-sm ${styles.text}`}>{warning.description}</p>
                  <p className="text-sm mt-2 font-medium text-slate-700">
                    Recommendation: {warning.recommendation}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Compact inline version for forms
 */
export function DrugInteractionBadge({
  severity,
  count,
}: {
  severity: "mild" | "moderate" | "severe" | "contraindicated";
  count: number;
}) {
  const variant =
    severity === "contraindicated" || severity === "severe"
      ? "danger"
      : severity === "moderate"
      ? "warning"
      : "secondary";

  return (
    <Badge variant={variant} className="flex items-center gap-1">
      <AlertTriangle className="h-3 w-3" />
      {count} {severity} interaction{count > 1 ? "s" : ""}
    </Badge>
  );
}
