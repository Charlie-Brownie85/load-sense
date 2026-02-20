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
