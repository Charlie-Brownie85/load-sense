'use client';

import type { UserProfile, BmiStatus } from '@/shared/types';
import { ProfileForm } from '@/features/profile-form';

interface ProfileClientProps {
  profile: UserProfile | null;
  bmi: number | null;
  bmiStatus: BmiStatus | null;
}

export function ProfileClient({ profile, bmi, bmiStatus }: ProfileClientProps) {
  return (
    <main className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">User Profile</h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage your biometric data and physical attributes.
        </p>
      </header>

      <ProfileForm initialProfile={profile} bmi={bmi} bmiStatus={bmiStatus} />

      <section className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
          <h3 className="text-blue-800 text-sm font-semibold mb-1">
            Analytical Note
          </h3>
          <p className="text-blue-700 text-xs leading-relaxed">
            Your BMI and body metrics are used to calculate training load
            thresholds and metabolic rates. Keep these updated for accurate
            performance tracking.
          </p>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
          <h3 className="text-slate-800 text-sm font-semibold mb-1">Privacy</h3>
          <p className="text-slate-500 text-xs leading-relaxed">
            Biometric data is stored locally and only visible to you.
          </p>
        </div>
      </section>
    </main>
  );
}
