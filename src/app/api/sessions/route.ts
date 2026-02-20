import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { validateSession } from '@/shared/lib/validation';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cursorParam = searchParams.get('cursor');
  const limitParam = searchParams.get('limit');
  const limit = Math.min(Math.max(Number(limitParam) || 20, 1), 100);

  const sessions = await prisma.session.findMany({
    orderBy: [{ date: 'desc' }, { id: 'desc' }],
    take: limit + 1,
    ...(cursorParam
      ? {
          cursor: { id: Number(cursorParam) },
          skip: 1,
        }
      : {}),
  });

  const hasMore = sessions.length > limit;
  const page = hasMore ? sessions.slice(0, limit) : sessions;
  const nextCursor = hasMore ? page[page.length - 1].id : null;

  return NextResponse.json({ sessions: page, nextCursor, hasMore });
}

export async function POST(request: Request) {
  const body = await request.json();
  const errors = validateSession(body);

  if (errors.length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const session = await prisma.session.create({
    data: {
      date: new Date(body.date),
      type: body.type,
      duration: Number(body.duration),
      rpe: Number(body.rpe),
      notes: body.notes || null,
    },
  });

  return NextResponse.json(session, { status: 201 });
}
