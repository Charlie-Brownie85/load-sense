import { prisma } from '@/shared/lib/prisma';
import { calculateBmi, classifyBmiStatus } from '@/entities/profile';
import { Navbar } from '@/shared/ui/Navbar';
import { ProfileClient } from './ProfileClient';
import type { UserProfile, HeightUnit, WeightUnit, Gender } from '@/shared/types';

export async function ProfilePage() {
  const raw = await prisma.userProfile.findFirst();

  let profile: UserProfile | null = null;
  let bmi: number | null = null;
  let bmiStatus: ReturnType<typeof classifyBmiStatus> | null = null;

  if (raw) {
    profile = {
      id: raw.id,
      age: raw.age,
      gender: raw.gender as Gender | null,
      height: raw.height,
      heightUnit: raw.heightUnit as HeightUnit,
      heightInches: raw.heightInches,
      weight: raw.weight,
      weightUnit: raw.weightUnit as WeightUnit,
      bodyFatPercent: raw.bodyFatPercent,
      restingHr: raw.restingHr,
      avatarBase64: raw.avatarBase64,
      createdAt: raw.createdAt.toISOString(),
      updatedAt: raw.updatedAt.toISOString(),
    };

    bmi = calculateBmi(profile);
    if (bmi !== null) {
      bmiStatus = classifyBmiStatus(bmi);
    }
  }

  return (
    <>
      <Navbar avatarBase64={profile?.avatarBase64} />
      <ProfileClient profile={profile} bmi={bmi} bmiStatus={bmiStatus} />
    </>
  );
}
