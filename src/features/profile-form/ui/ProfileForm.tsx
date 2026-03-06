'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type {
  UserProfile,
  BmiStatus,
  Gender,
  HeightUnit,
  WeightUnit,
} from '@/shared/types';
import { GENDERS, HEIGHT_UNITS, WEIGHT_UNITS } from '@/shared/types';
import { BmiIndicator } from '@/entities/profile';

interface ProfileFormProps {
  initialProfile: UserProfile | null;
  bmi: number | null;
  bmiStatus: BmiStatus | null;
}

const INPUT_CLASS =
  'w-full h-11 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all';

function toStr(val: number | null | undefined): string {
  return val != null ? String(val) : '';
}

export function ProfileForm({
  initialProfile,
  bmi,
  bmiStatus,
}: ProfileFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [age, setAge] = useState('');
  const [gender, setGender] = useState<Gender | ''>('');
  const [height, setHeight] = useState('');
  const [heightUnit, setHeightUnit] = useState<HeightUnit>('cm');
  const [heightInches, setHeightInches] = useState('');
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg');
  const [bodyFatPercent, setBodyFatPercent] = useState('');
  const [restingHr, setRestingHr] = useState('');
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function loadFromProfile(profile: UserProfile | null) {
    if (profile) {
      setAge(toStr(profile.age));
      setGender(profile.gender || '');
      setHeight(toStr(profile.height));
      setHeightUnit(profile.heightUnit);
      setHeightInches(toStr(profile.heightInches));
      setWeight(toStr(profile.weight));
      setWeightUnit(profile.weightUnit);
      setBodyFatPercent(toStr(profile.bodyFatPercent));
      setRestingHr(toStr(profile.restingHr));
      setAvatarBase64(profile.avatarBase64);
    } else {
      setAge('');
      setGender('');
      setHeight('');
      setHeightUnit('cm');
      setHeightInches('');
      setWeight('');
      setWeightUnit('kg');
      setBodyFatPercent('');
      setRestingHr('');
      setAvatarBase64(null);
    }
    setErrors({});
  }

  useEffect(() => {
    loadFromProfile(initialProfile);
  }, [initialProfile]);

  function handleCancel() {
    loadFromProfile(initialProfile);
  }

  function handleHeightUnitChange(unit: HeightUnit) {
    setHeightUnit(unit);
    if (unit === 'cm') {
      setHeightInches('');
    }
  }

  function handleAvatarClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    const body = {
      age: age ? Number(age) : null,
      gender: gender || null,
      height: height ? Number(height) : null,
      heightUnit,
      heightInches: heightInches ? Number(heightInches) : null,
      weight: weight ? Number(weight) : null,
      weightUnit,
      bodyFatPercent: bodyFatPercent ? Number(bodyFatPercent) : null,
      restingHr: restingHr ? Number(restingHr) : null,
      avatarBase64,
    };

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        if (data.errors && Array.isArray(data.errors)) {
          const fieldErrors: Record<string, string> = {};
          for (const err of data.errors) {
            const field = err.field ?? 'general';
            fieldErrors[field] = err.message ?? err;
          }
          setErrors(fieldErrors);
        }
      } else {
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  }

  const selectClass =
    'bg-transparent border-none focus:ring-0 text-sm py-0 text-slate-500 cursor-pointer';

  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleAvatarClick}
            className="h-20 w-20 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0 cursor-pointer"
          >
            {avatarBase64 ? (
              /* eslint-disable-next-line @next/next/no-img-element -- base64 data URI, not optimizable by next/image */
              <img
                src={avatarBase64}
                alt="Avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="material-symbols-outlined text-3xl text-slate-400">
                person
              </span>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={handleAvatarClick}
            className="text-sm font-medium text-primary hover:text-blue-700 transition-colors cursor-pointer"
          >
            Change photo
          </button>
        </div>

        {/* Fields grid */}
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          {/* Age */}
          <div className="sm:col-span-3">
            <label
              className="block text-sm font-medium text-slate-700"
              htmlFor="profile-age"
            >
              Age
            </label>
            <div className="mt-1">
              <input
                id="profile-age"
                type="number"
                min="1"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className={INPUT_CLASS}
              />
              {errors.age && (
                <p className="mt-1 text-sm text-red-600">{errors.age}</p>
              )}
            </div>
          </div>

          {/* Resting HR */}
          <div className="sm:col-span-3">
            <label
              className="block text-sm font-medium text-slate-700"
              htmlFor="profile-resting-hr"
            >
              Resting HR
            </label>
            <div className="mt-1 flex rounded-lg shadow-sm">
              <input
                id="profile-resting-hr"
                type="number"
                min="20"
                max="220"
                value={restingHr}
                onChange={(e) => setRestingHr(e.target.value)}
                placeholder="60"
                className={`${INPUT_CLASS} rounded-r-none border-r-0`}
              />
              <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-slate-200 bg-slate-50 text-slate-500 text-sm">
                bpm
              </span>
            </div>
            {errors.restingHr && (
              <p className="mt-1 text-sm text-red-600">{errors.restingHr}</p>
            )}
          </div>

          {/* Weight */}
          <div className="sm:col-span-3">
            <label
              className="block text-sm font-medium text-slate-700"
              htmlFor="profile-weight"
            >
              Weight
            </label>
            <div className="mt-1 flex rounded-lg shadow-sm">
              <input
                id="profile-weight"
                type="number"
                min="1"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className={`${INPUT_CLASS} rounded-r-none border-r-0`}
              />
              <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-slate-200 bg-slate-50 text-slate-500 sm:text-sm">
                <select
                  value={weightUnit}
                  onChange={(e) =>
                    setWeightUnit(e.target.value as WeightUnit)
                  }
                  className={selectClass}
                >
                  {WEIGHT_UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </span>
            </div>
            {errors.weight && (
              <p className="mt-1 text-sm text-red-600">{errors.weight}</p>
            )}
          </div>

          {/* Height */}
          <div className="sm:col-span-3">
            <label
              className="block text-sm font-medium text-slate-700"
              htmlFor="profile-height"
            >
              Height
            </label>
            <div className="mt-1 flex rounded-lg shadow-sm">
              {heightUnit === 'cm' ? (
                <input
                  id="profile-height"
                  type="number"
                  min="1"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className={`${INPUT_CLASS} rounded-r-none border-r-0`}
                />
              ) : (
                <>
                  <input
                    id="profile-height"
                    type="number"
                    min="1"
                    max="8"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="ft"
                    className={`${INPUT_CLASS} rounded-r-none border-r-0 flex-1`}
                  />
                  <input
                    type="number"
                    min="0"
                    max="11"
                    value={heightInches}
                    onChange={(e) => setHeightInches(e.target.value)}
                    placeholder="in"
                    className={`${INPUT_CLASS} rounded-none border-r-0 flex-1`}
                  />
                </>
              )}
              <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-slate-200 bg-slate-50 text-slate-500 sm:text-sm">
                <select
                  value={heightUnit}
                  onChange={(e) =>
                    handleHeightUnitChange(e.target.value as HeightUnit)
                  }
                  className={selectClass}
                >
                  {HEIGHT_UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </span>
            </div>
            {errors.height && (
              <p className="mt-1 text-sm text-red-600">{errors.height}</p>
            )}
          </div>

          {/* Body Fat % */}
          <div className="sm:col-span-3">
            <label
              className="block text-sm font-medium text-slate-700"
              htmlFor="profile-body-fat"
            >
              Body Fat %
            </label>
            <div className="mt-1 flex rounded-lg shadow-sm">
              <input
                id="profile-body-fat"
                type="number"
                min="1"
                max="60"
                step="0.1"
                value={bodyFatPercent}
                onChange={(e) => setBodyFatPercent(e.target.value)}
                placeholder="15"
                className={`${INPUT_CLASS} rounded-r-none border-r-0`}
              />
              <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-slate-200 bg-slate-50 text-slate-500 text-sm">
                %
              </span>
            </div>
            {errors.bodyFatPercent && (
              <p className="mt-1 text-sm text-red-600">
                {errors.bodyFatPercent}
              </p>
            )}
          </div>

          {/* Gender */}
          <div className="sm:col-span-3">
            <label
              className="block text-sm font-medium text-slate-700"
              htmlFor="profile-gender"
            >
              Gender
            </label>
            <div className="mt-1">
              <select
                id="profile-gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender | '')}
                className={`${INPUT_CLASS} appearance-none cursor-pointer`}
              >
                <option value="">Select gender</option>
                {GENDERS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              {errors.gender && (
                <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
              )}
            </div>
          </div>

          {/* Calculated BMI */}
          <div className="sm:col-span-3">
            <label className="block text-sm font-medium text-slate-700">
              Calculated BMI
            </label>
            <div className="mt-1 flex items-center h-11">
              <BmiIndicator bmi={bmi} status={bmiStatus} />
            </div>
          </div>
        </div>

        {/* Form actions */}
        <div className="pt-6 border-t border-slate-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-white py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </section>
  );
}
