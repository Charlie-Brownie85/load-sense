import type { SessionType } from "@/lib/types";
import { computeSessionLoad } from "@/lib/workload";

const TYPE_CONFIG: Record<
  SessionType,
  { icon: string; bg: string; text: string; label: string }
> = {
  HIIT: {
    icon: "bolt",
    bg: "bg-orange-100",
    text: "text-orange-600",
    label: "High Intensity Intervals",
  },
  Strength: {
    icon: "fitness_center",
    bg: "bg-blue-100",
    text: "text-blue-600",
    label: "Strength Training",
  },
  Cardio: {
    icon: "directions_run",
    bg: "bg-emerald-100",
    text: "text-emerald-600",
    label: "Cardio Session",
  },
};

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

interface SessionCardProps {
  id: number;
  date: string;
  type: SessionType;
  duration: number;
  rpe: number;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function SessionCard({
  id,
  date,
  type,
  duration,
  rpe,
  onEdit,
  onDelete,
}: SessionCardProps) {
  const config = TYPE_CONFIG[type];
  const load = computeSessionLoad(duration, rpe);

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 group transition-all hover:border-primary/50">
      <div
        className={`h-12 w-12 rounded-lg ${config.bg} ${config.text} flex items-center justify-center shrink-0`}
      >
        <span className="material-symbols-outlined text-2xl!">
          {config.icon}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-sm font-bold text-slate-900 truncate">
            {config.label}
          </h4>
          <span className="text-[10px] font-bold text-slate-400 uppercase">
            {formatRelativeDate(date)}
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm!">schedule</span>
            {duration}m
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm!">
              pulse_alert
            </span>
            RPE {rpe}/10
          </span>
          <span className="px-1.5 py-0.5 rounded bg-slate-100 font-bold text-primary">
            {load} Load
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(id)}
          className="p-1.5 text-slate-400 hover:text-primary rounded hover:bg-slate-100"
        >
          <span className="material-symbols-outlined">edit</span>
        </button>
        <button
          onClick={() => onDelete(id)}
          className="p-1.5 text-slate-400 hover:text-red-500 rounded hover:bg-slate-100"
        >
          <span className="material-symbols-outlined">delete</span>
        </button>
      </div>
    </div>
  );
}
