"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { TrainingStatus, SessionType, Session } from "@/shared/types";
import type { WeeklyLoadRange } from "@/shared/lib/workload";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { MetricCard } from "@/shared/ui/MetricCard";
import { AcwrGauge } from "@/shared/ui/AcwrGauge";
import { Tooltip } from "@/shared/ui/Tooltip";
import { ConfirmModal } from "@/shared/ui/ConfirmModal";
import { WeeklyLoadChart } from "@/widgets/dashboard";
import { SessionCard } from "@/entities/session";
import { SessionModal } from "@/features/session-management";
import { FloatingActionButton } from "@/shared/ui/FloatingActionButton";

interface DashboardClientProps {
  sessions: Session[];
  acuteLoad: number;
  chronicLoad: number;
  acwr: number | null;
  status: TrainingStatus;
  weeklyLoadRanges: WeeklyLoadRange[];
  isAcuteIncomplete: boolean;
  isChronicUnstable: boolean;
}

export function DashboardClient({
  sessions,
  acuteLoad,
  chronicLoad,
  acwr,
  status,
  weeklyLoadRanges,
  isAcuteIncomplete,
  isChronicUnstable,
}: DashboardClientProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [editSession, setEditSession] = useState<{
    id: number;
    date: string;
    type: SessionType;
    duration: number;
    rpe: number;
    notes: string | null;
  } | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const handleEdit = (id: number) => {
    const session = sessions.find((s) => s.id === id);
    if (session) {
      setEditSession({
        id: session.id,
        date: session.date,
        type: session.type,
        duration: session.duration,
        rpe: session.rpe,
        notes: session.notes,
      });
      setModalOpen(true);
    }
  };

  const handleDeleteRequest = (id: number) => {
    setDeleteTargetId(id);
  };

  const handleDeleteConfirm = async () => {
    if (deleteTargetId === null) return;
    await fetch(`/api/sessions/${deleteTargetId}`, { method: "DELETE" });
    setDeleteTargetId(null);
    router.refresh();
  };

  const handleSaved = () => {
    setEditSession(null);
    router.refresh();
  };

  const handleOpenCreate = () => {
    setEditSession(null);
    setModalOpen(true);
  };

  const acwrDisplay = acwr !== null ? acwr.toFixed(2) : "—";
  const trendIcon =
    acwr !== null && acwr >= 0.8 && acwr <= 1.3 ? "trending_up" : "trending_flat";

  return (
    <main className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      {/* Status Overview Panel — sticky below navbar */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-200 sticky top-16 z-10 shadow-slate-200/60">
        <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-4 text-center md:text-left">
            <StatusBadge status={status} />
            <div>
              <Tooltip content="Acute:Chronic Workload Ratio — compares your recent load to your longer-term average. Optimal range is 0.8–1.3.">
                <p className="text-slate-500 text-sm font-medium uppercase tracking-wider cursor-help">
                  Current ACWR Ratio
                </p>
              </Tooltip>
              <div className="flex items-baseline gap-2 justify-center md:justify-start">
                <h2 className="text-6xl font-black text-primary">
                  {acwrDisplay}
                </h2>
                {acwr !== null && (
                  <span className="text-emerald-500 material-symbols-outlined">
                    {trendIcon}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full md:w-auto md:min-w-[400px]">
            <MetricCard
              label="Acute Load"
              value={acuteLoad}
              subtitle="Last 7 days"
              warning={isAcuteIncomplete}
              tooltip="Total training load (duration × RPE) from the last 7 days."
            />
            <MetricCard
              label="Chronic Load"
              value={Math.round(chronicLoad)}
              subtitle="Last 28 days avg"
              warning={isChronicUnstable}
              tooltip="Average weekly training load over the last 28 days (4 weeks)."
            />
            <AcwrGauge acwr={acwr} />
          </div>
        </div>
      </section>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 lg:sticky lg:top-[calc(4rem+1px+theme(spacing.8)+200px)] lg:self-start">
          <WeeklyLoadChart weeklyLoadRanges={weeklyLoadRanges} />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
              Recent Sessions
            </h3>
          </div>

          {sessions.length === 0 ? (
            <div className="bg-white p-12 rounded-xl shadow-sm border border-slate-200 text-center">
              <span className="material-symbols-outlined text-slate-300 text-5xl! mb-4 block">
                fitness_center
              </span>
              <p className="text-slate-500 font-medium">No sessions yet</p>
              <p className="text-slate-400 text-sm mt-1">
                Click &quot;Add Session&quot; to log your first workout
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <SessionCard
                  key={session.id}
                  id={session.id}
                  date={session.date}
                  type={session.type}
                  duration={session.duration}
                  rpe={session.rpe}
                  onEdit={handleEdit}
                  onDelete={handleDeleteRequest}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <FloatingActionButton onClick={handleOpenCreate} />

      <SessionModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditSession(null);
        }}
        onSaved={handleSaved}
        editSession={editSession}
      />

      <ConfirmModal
        isOpen={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Session"
        message="Are you sure you want to delete this session? This action cannot be undone."
      />
    </main>
  );
}
