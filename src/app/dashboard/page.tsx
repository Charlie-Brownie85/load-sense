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

export default async function DashboardPage() {
  const sessions = await prisma.session.findMany({
    orderBy: { date: "desc" },
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
  const weeklyLoadRanges = computeWeeklyLoadRanges(sessionInputs, now, 5);
  const { isAcuteIncomplete, isChronicUnstable } = getDataSufficiencyFlags(
    sessionInputs,
    now,
  );

  const serializedSessions = sessions.map((s) => ({
    id: s.id,
    date: s.date.toISOString(),
    type: s.type as SessionType,
    duration: s.duration,
    rpe: s.rpe,
    notes: s.notes,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
  }));

  return (
    <>
      <Navbar />
      <DashboardClient
        sessions={serializedSessions}
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
