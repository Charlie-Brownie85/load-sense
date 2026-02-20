import { prisma } from "@/shared/lib/prisma";
import {
  computeAcuteLoad,
  computeChronicLoad,
  computeACWR,
  classifyStatus,
  computeWeeklyLoadRanges,
  getDataSufficiencyFlags,
} from "@/shared/lib/workload";
import { Navbar } from "@/shared/ui/Navbar";
import { DashboardClient } from "./DashboardClient";
import type { SessionType } from "@/shared/types";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

function computeWeekSpan(
  sessions: { date: Date | string }[],
  now: Date,
): number {
  if (sessions.length === 0) return 1;
  const dates = sessions.map((s) =>
    typeof s.date === "string" ? new Date(s.date) : s.date,
  );
  const earliest = new Date(Math.min(...dates.map((d) => d.getTime())));
  const diffMs = now.getTime() - earliest.getTime();
  const diffWeeks = Math.ceil(diffMs / (7 * 24 * 60 * 60 * 1000));
  return Math.max(diffWeeks + 1, 1);
}

export default async function DashboardPage() {
  const sessions = await prisma.session.findMany({
    orderBy: [{ date: "desc" }, { id: "desc" }],
  });

  const now = new Date();
  const sessionInputs = sessions.map((s) => ({
    date: s.date,
    duration: s.duration,
    rpe: s.rpe,
  }));

  const acuteLoad = computeAcuteLoad(sessionInputs, now);
  const chronicLoad = computeChronicLoad(sessionInputs, now);
  const acwr = computeACWR(acuteLoad, chronicLoad);
  const status = classifyStatus(acwr);
  const weekCount = computeWeekSpan(sessions, now);
  const weeklyLoadRanges = computeWeeklyLoadRanges(sessionInputs, now, weekCount);
  const { isAcuteIncomplete, isChronicUnstable } = getDataSufficiencyFlags(
    sessionInputs,
    now,
  );

  const serializedAll = sessions.map((s) => ({
    id: s.id,
    date: s.date.toISOString(),
    type: s.type as SessionType,
    duration: s.duration,
    rpe: s.rpe,
    notes: s.notes,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
  }));

  const firstPage = serializedAll.slice(0, PAGE_SIZE);
  const hasMore = serializedAll.length > PAGE_SIZE;
  const nextCursor = hasMore ? firstPage[firstPage.length - 1].id : null;

  return (
    <>
      <Navbar />
      <DashboardClient
        sessions={firstPage}
        hasMore={hasMore}
        nextCursor={nextCursor}
        acuteLoad={acuteLoad}
        chronicLoad={chronicLoad}
        acwr={acwr}
        status={status}
        weeklyLoadRanges={weeklyLoadRanges}
        isAcuteIncomplete={isAcuteIncomplete}
        isChronicUnstable={isChronicUnstable}
      />
    </>
  );
}
