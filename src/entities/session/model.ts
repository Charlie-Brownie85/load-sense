import type { SessionType } from "@/shared/types";

export const TYPE_CONFIG: Record<
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

export function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
