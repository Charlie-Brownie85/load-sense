export type SessionType = 'Strength' | 'HIIT' | 'Cardio';

export const SESSION_TYPES: SessionType[] = ['Strength', 'HIIT', 'Cardio'];

export type TrainingStatus =
  | 'Undertraining'
  | 'Optimal Zone'
  | 'Fatigue Risk'
  | 'High Injury Risk'
  | 'Insufficient Data';

export interface Session {
  id: number;
  date: string;
  type: SessionType;
  duration: number;
  rpe: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkloadMetrics {
  acuteLoad: number;
  chronicLoad: number;
  acwr: number | null;
  status: TrainingStatus;
  isAcuteIncomplete: boolean;
  isChronicUnstable: boolean;
  weeklyLoads: number[];
}

export interface PaginatedSessionsResponse {
  sessions: Session[];
  nextCursor: number | null;
  hasMore: boolean;
}

export type HeightUnit = 'cm' | 'ft-in';
export type WeightUnit = 'kg' | 'lb';
export type Gender = 'Male' | 'Female';
export type BmiStatus = 'Underweight' | 'Normal' | 'Overweight' | 'Obese';

export const HEIGHT_UNITS: HeightUnit[] = ['cm', 'ft-in'];
export const WEIGHT_UNITS: WeightUnit[] = ['kg', 'lb'];
export const GENDERS: Gender[] = ['Male', 'Female'];

export interface UserProfile {
  id: number;
  age: number | null;
  gender: Gender | null;
  height: number | null;
  heightUnit: HeightUnit;
  heightInches: number | null;
  weight: number | null;
  weightUnit: WeightUnit;
  bodyFatPercent: number | null;
  restingHr: number | null;
  avatarBase64: string | null;
  createdAt: string;
  updatedAt: string;
}
