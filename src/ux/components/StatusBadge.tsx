import type { TrainingStatus } from "@/lib/types";

const STATUS_CONFIG: Record<
  TrainingStatus,
  { bg: string; text: string; icon: string }
> = {
  "Undertraining": {
    bg: "bg-slate-100",
    text: "text-slate-700",
    icon: "trending_down",
  },
  "Optimal Zone": {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    icon: "check_circle",
  },
  "Fatigue Risk": {
    bg: "bg-amber-100",
    text: "text-amber-700",
    icon: "warning",
  },
  "High Injury Risk": {
    bg: "bg-red-100",
    text: "text-red-700",
    icon: "error",
  },
  "Insufficient Data": {
    bg: "bg-gray-100",
    text: "text-gray-500",
    icon: "help",
  },
};

export function StatusBadge({ status }: { status: TrainingStatus }) {
  const config = STATUS_CONFIG[status];

  return (
    <div
      className={`inline-flex items-center px-3 py-1 rounded-full ${config.bg} ${config.text} text-sm font-semibold`}
    >
      <span className="material-symbols-outlined mr-1 text-sm!">
        {config.icon}
      </span>
      {status}
    </div>
  );
}
