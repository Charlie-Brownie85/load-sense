import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { validateSession } from "@/shared/lib/validation";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const sessionId = parseInt(id, 10);

  if (isNaN(sessionId)) {
    return NextResponse.json({ error: "Invalid session ID" }, { status: 400 });
  }

  const body = await request.json();
  const errors = validateSession(body, true);

  if (errors.length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  try {
    const data: Record<string, unknown> = {};
    if (body.date !== undefined) data.date = new Date(body.date);
    if (body.type !== undefined) data.type = body.type;
    if (body.duration !== undefined) data.duration = Number(body.duration);
    if (body.rpe !== undefined) data.rpe = Number(body.rpe);
    if (body.notes !== undefined) data.notes = body.notes || null;

    const session = await prisma.session.update({
      where: { id: sessionId },
      data,
    });

    return NextResponse.json(session);
  } catch {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const sessionId = parseInt(id, 10);

  if (isNaN(sessionId)) {
    return NextResponse.json({ error: "Invalid session ID" }, { status: 400 });
  }

  try {
    await prisma.session.delete({ where: { id: sessionId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }
}
