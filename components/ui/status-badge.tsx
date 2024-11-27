import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "active" | "completed" | "error";
  label: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "px-2.5 py-0.5 rounded-full text-xs font-medium",
        {
          "status-active": status === "active",
          "status-completed": status === "completed",
          "status-error": status === "error",
        },
        className
      )}
    >
      {label}
    </span>
  );
}