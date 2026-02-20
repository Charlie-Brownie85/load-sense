import { prisma } from '@/shared/lib/prisma';
import {
  computeAcuteLoad,
  computeChronicLoad,
  computeACWR,
  classifyStatus,
  computeWeeklyLoadRanges,
  computeWeekSpan,
  getDataSufficiencyFlags,
} from '@/shared/lib/workload';
import { Navbar } from '@/shared/ui/Navbar';
import { DashboardClient } from './DashboardClient';
import type { SessionType } from '@/shared/types';

const PAGE_SIZE = 20;

export async function DashboardPage() {
  const sessions = await prisma.session.findMany({
    orderBy: [{ date: 'desc' }, { id: 'desc' }],
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
