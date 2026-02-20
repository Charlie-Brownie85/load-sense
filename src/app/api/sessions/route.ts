import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateSession } from "@/lib/validation";

export async function GET() {
  const sessions = await prisma.session.findMany({
    orderBy: { date: "desc" },
  });
  return NextResponse.json(sessions);
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
