import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { validateProfile } from '@/shared/lib/validation';

export async function GET() {
  const profile = await prisma.userProfile.findFirst();
  return NextResponse.json(profile);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const errors = validateProfile(body);

  if (errors.length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const existing = await prisma.userProfile.findFirst();

  const data = {
    age: body.age != null ? Number(body.age) : null,
    gender: body.gender != null ? String(body.gender) : null,
    height: body.height != null ? Number(body.height) : null,
    heightUnit: String(body.heightUnit ?? 'cm'),
    heightInches: body.heightInches != null ? Number(body.heightInches) : null,
    weight: body.weight != null ? Number(body.weight) : null,
    weightUnit: String(body.weightUnit ?? 'kg'),
    bodyFatPercent: body.bodyFatPercent != null ? Number(body.bodyFatPercent) : null,
    restingHr: body.restingHr != null ? Number(body.restingHr) : null,
    avatarBase64: body.avatarBase64 != null ? String(body.avatarBase64) : null,
  };

  const profile = existing
    ? await prisma.userProfile.update({ where: { id: existing.id }, data })
    : await prisma.userProfile.create({ data });

  return NextResponse.json(profile);
}
