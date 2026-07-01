import * as React from "react";
import { cn } from "../utils";

export type StatusType =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "PAID"
  | "FAILED"
  | "REFUNDED"
  | "AVAILABLE"
  | "LOW_STOCK"
  | "OUT_OF_STOCK"
  | "ACTIVE"
  | "INACTIVE";

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: StatusType | string;
  size?: "sm" | "md";
}

export const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ className, status, size = "md", ...props }, ref) => {
    const formattedStatus = status.toUpperCase();

    const getStatusStyles = (st: string) => {
      switch (st) {
        case "DELIVERED":
        case "PAID":
        case "AVAILABLE":
        case "ACTIVE":
          return "bg-emerald-100 text-emerald-800 border-emerald-200";
        case "PREPARING":
        case "CONFIRMED":
        case "READY":
        case "OUT_FOR_DELIVERY":
        case "LOW_STOCK":
          return "bg-amber-100 text-amber-800 border-amber-200";
        case "PENDING":
          return "bg-blue-100 text-blue-800 border-blue-200";
        case "CANCELLED":
        case "FAILED":
        case "REFUNDED":
        case "OUT_OF_STOCK":
        case "INACTIVE":
          return "bg-red-100 text-red-800 border-red-200";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    };

    const getReadableLabel = (st: string) => {
      return st.replace(/_/g, " ");
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center font-semibold rounded-full border px-2.5 py-0.5",
          size === "sm" ? "text-[10px]" : "text-xs",
          getStatusStyles(formattedStatus),
          className
        )}
        {...props}
      >
        <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-75" />
        {getReadableLabel(formattedStatus)}
      </span>
    );
  }
);
StatusBadge.displayName = "StatusBadge";
