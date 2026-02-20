import { prisma } from "@/lib/prisma";
import {
  computeAcuteLoad,
  computeChronicLoad,
  computeACWR,
  classifyStatus,
  computeWeeklyLoads,
  getDataSufficiencyFlags,
} from "@/lib/workload";
import { Navbar } from "@/ux/components/Navbar";
import { DashboardClient } from "./DashboardClient";
import type { SessionType } from "@/lib/types";

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
  const weeklyLoads = computeWeeklyLoads(sessionInputs, now, 5);
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
        weeklyLoads={weeklyLoads}
        isAcuteIncomplete={isAcuteIncomplete}
        isChronicUnstable={isChronicUnstable}
      />
    </>
  );
}
