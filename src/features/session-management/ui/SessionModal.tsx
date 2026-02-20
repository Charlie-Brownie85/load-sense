"use client";

import { useState, useEffect } from "react";
import type { SessionType } from "@/shared/types";
import { SESSION_TYPES } from "@/shared/types";

interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  editSession?: {
    id: number;
    date: string;
    type: SessionType;
    duration: number;
    rpe: number;
    notes: string | null;
  } | null;
}

export function SessionModal({
  isOpen,
  onClose,
  onSaved,
  editSession,
}: SessionModalProps) {
  const [date, setDate] = useState("");
  const [type, setType] = useState<SessionType | "">("");
  const [duration, setDuration] = useState("");
  const [rpe, setRpe] = useState(5);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editSession) {
      setDate(new Date(editSession.date).toISOString().split("T")[0]);
      setType(editSession.type);
      setDuration(String(editSession.duration));
      setRpe(editSession.rpe);
      setNotes(editSession.notes || "");
    } else {
      setDate(new Date().toISOString().split("T")[0]);
      setType("");
      setDuration("");
      setRpe(5);
      setNotes("");
    }
  }, [editSession, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!date || !type || !duration) return;

    setSaving(true);
    try {
      const body = {
        date,
        type,
        duration: Number(duration),
        rpe,
        notes: notes || null,
      };

      if (editSession) {
        await fetch(`/api/sessions/${editSession.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        await fetch("/api/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      onSaved();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-[520px] rounded-xl shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {editSession ? "Edit Session" : "Add New Session"}
            </h2>
            <p className="text-sm text-slate-500">
              {editSession
                ? "Update your workout details"
                : "Log your latest workout details"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="px-6 py-6 space-y-5 overflow-y-auto max-h-[80vh]">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-11 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Duration (min)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 45"
                min="1"
                className="w-full h-11 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Session Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as SessionType)}
              className="w-full h-11 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer"
            >
              <option disabled value="">
                Select session type
              </option>
              {SESSION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t === "HIIT" ? "HIIT / Metcon" : t === "Strength" ? "Strength Training" : "Cardio / Endurance"}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-4 py-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-700">
                RPE (Exertion)
              </label>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-primary text-white">
                {rpe} / 10
              </span>
            </div>
            <div className="relative px-2">
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={rpe}
                onChange={(e) => setRpe(Number(e.target.value))}
                className="w-full rpe-slider"
                style={{
                  background: `linear-gradient(to right, var(--color-primary) ${((rpe - 1) / 9) * 100}%, #e2e8f0 ${((rpe - 1) / 9) * 100}%)`,
                }}
              />
              <div className="flex justify-between mt-2 text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                <span>Very Easy</span>
                <span>Moderate</span>
                <span>Max Effort</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How did it feel? Any specific focus or injuries?"
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
            />
          </div>
        </div>

        <div className="px-6 py-5 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50">
          <button
            onClick={onClose}
            className="px-5 h-11 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || !date || !type || !duration}
            className="px-6 h-11 rounded-lg text-sm font-bold text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">check</span>
            {saving ? "Saving..." : "Save Session"}
          </button>
        </div>
      </div>
    </div>
  );
}
