import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import {
  computeAcuteLoad,
  computeChronicLoad,
  computeACWR,
  classifyStatus,
  computeWeeklyLoads,
  getDataSufficiencyFlags,
} from "@/shared/lib/workload";

export async function GET() {
  const sessions = await prisma.session.findMany();
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

  return NextResponse.json({
    acuteLoad,
    chronicLoad,
    acwr,
    status,
    isAcuteIncomplete,
    isChronicUnstable,
    weeklyLoads,
  });
}
