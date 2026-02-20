"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { TrainingStatus, SessionType, Session } from "@/lib/types";
import { StatusBadge } from "@/ux/components/StatusBadge";
import { MetricCard } from "@/ux/components/MetricCard";
import { AcwrGauge } from "@/ux/components/AcwrGauge";
import { WeeklyLoadChart } from "@/ux/components/WeeklyLoadChart";
import { SessionCard } from "@/ux/components/SessionCard";
import { SessionModal } from "@/ux/components/SessionModal";
import { FloatingActionButton } from "@/ux/components/FloatingActionButton";

interface DashboardClientProps {
  sessions: Session[];
  acuteLoad: number;
  chronicLoad: number;
  acwr: number | null;
  status: TrainingStatus;
  weeklyLoads: number[];
  isAcuteIncomplete: boolean;
  isChronicUnstable: boolean;
}

export function DashboardClient({
  sessions,
  acuteLoad,
  chronicLoad,
  acwr,
  status,
  weeklyLoads,
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

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this session?")) return;
    await fetch(`/api/sessions/${id}`, { method: "DELETE" });
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
      {/* Status Overview Panel */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-4 text-center md:text-left">
            <StatusBadge status={status} />
            <div>
              <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">
                Current ACWR Ratio
              </p>
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
            />
            <MetricCard
              label="Chronic Load"
              value={Math.round(chronicLoad)}
              subtitle="Last 28 days avg"
              warning={isChronicUnstable}
            />
            <AcwrGauge acwr={acwr} />
          </div>
        </div>
      </section>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <WeeklyLoadChart weeklyLoads={weeklyLoads} />
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
                  onDelete={handleDelete}
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
    </main>
  );
}
