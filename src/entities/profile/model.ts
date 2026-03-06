import type { BmiStatus, HeightUnit, WeightUnit } from '@/shared/types';

export const BMI_STATUS_CONFIG: Record<
  BmiStatus,
  { bg: string; text: string; label: string }
> = {
  Underweight: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Underweight' },
  Normal: { bg: 'bg-green-100', text: 'text-green-800', label: 'Normal' },
  Overweight: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Overweight' },
  Obese: { bg: 'bg-red-100', text: 'text-red-800', label: 'Obese' },
};

export function convertHeightToCm(
  height: number,
  heightInches: number | null,
  unit: HeightUnit
): number {
  if (unit === 'cm') return height;
  return (height * 12 + (heightInches ?? 0)) * 2.54;
}

export function convertWeightToKg(weight: number, unit: WeightUnit): number {
  if (unit === 'kg') return weight;
  return weight * 0.453592;
}

export function calculateBmi(profile: {
  height: number | null;
  heightInches: number | null;
  heightUnit: HeightUnit;
  weight: number | null;
  weightUnit: WeightUnit;
}): number | null {
  const { height, heightInches, heightUnit, weight, weightUnit } = profile;
  if (height == null || weight == null || height === 0 || weight === 0) {
    return null;
  }
  const heightCm = convertHeightToCm(height, heightInches, heightUnit);
  const weightKg = convertWeightToKg(weight, weightUnit);
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

export function classifyBmiStatus(bmi: number): BmiStatus {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}
