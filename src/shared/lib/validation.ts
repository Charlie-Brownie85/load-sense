import {
  SESSION_TYPES,
  GENDERS,
  HEIGHT_UNITS,
  WEIGHT_UNITS,
  type SessionType,
  type Gender,
  type HeightUnit,
  type WeightUnit,
} from '@/shared/types';

export interface ValidationError {
  field: string;
  message: string;
}

export interface SessionInput {
  date?: unknown;
  type?: unknown;
  duration?: unknown;
  rpe?: unknown;
  notes?: unknown;
}

export interface ProfileInput {
  age?: unknown;
  gender?: unknown;
  height?: unknown;
  heightUnit?: unknown;
  heightInches?: unknown;
  weight?: unknown;
  weightUnit?: unknown;
  bodyFatPercent?: unknown;
  restingHr?: unknown;
  avatarBase64?: unknown;
}

export function validateSession(
  data: SessionInput,
  partial = false,
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!partial || data.date !== undefined) {
    if (!data.date) {
      errors.push({ field: 'date', message: 'Date is required' });
    } else if (isNaN(new Date(data.date as string).getTime())) {
      errors.push({ field: 'date', message: 'Date must be a valid date' });
    }
  }

  if (!partial || data.type !== undefined) {
    if (!data.type) {
      errors.push({ field: 'type', message: 'Type is required' });
    } else if (!SESSION_TYPES.includes(data.type as SessionType)) {
      errors.push({
        field: 'type',
        message: `Type must be one of: ${SESSION_TYPES.join(', ')}`,
      });
    }
  }

  if (!partial || data.duration !== undefined) {
    const duration = Number(data.duration);
    if (data.duration === undefined || data.duration === null) {
      if (!partial) errors.push({ field: 'duration', message: 'Duration is required' });
    } else if (!Number.isInteger(duration) || duration <= 0) {
      errors.push({
        field: 'duration',
        message: 'Duration must be a positive integer',
      });
    }
  }

  if (!partial || data.rpe !== undefined) {
    const rpe = Number(data.rpe);
    if (data.rpe === undefined || data.rpe === null) {
      if (!partial) errors.push({ field: 'rpe', message: 'RPE is required' });
    } else if (!Number.isInteger(rpe) || rpe < 1 || rpe > 10) {
      errors.push({
        field: 'rpe',
        message: 'RPE must be an integer between 1 and 10',
      });
    }
  }

  return errors;
}

export function validateProfile(data: ProfileInput): ValidationError[] {
  const errors: ValidationError[] = [];

  if (data.age !== undefined) {
    const age = Number(data.age);
    if (!Number.isInteger(age) || age < 1 || age > 150) {
      errors.push({
        field: 'age',
        message: 'Age must be an integer between 1 and 150',
      });
    }
  }

  if (data.gender !== undefined) {
    if (!GENDERS.includes(data.gender as Gender)) {
      errors.push({
        field: 'gender',
        message: `Gender must be one of: ${GENDERS.join(', ')}`,
      });
    }
  }

  if (data.height !== undefined) {
    const height = Number(data.height);
    if (Number.isNaN(height) || height <= 0) {
      errors.push({
        field: 'height',
        message: 'Height must be a positive number',
      });
    }
  }

  if (data.heightUnit !== undefined) {
    if (!HEIGHT_UNITS.includes(data.heightUnit as HeightUnit)) {
      errors.push({
        field: 'heightUnit',
        message: `Height unit must be one of: ${HEIGHT_UNITS.join(', ')}`,
      });
    }
  }

  if (
    data.heightInches !== undefined &&
    data.heightUnit === 'ft-in'
  ) {
    const heightInches = Number(data.heightInches);
    if (!Number.isInteger(heightInches) || heightInches < 0 || heightInches > 11) {
      errors.push({
        field: 'heightInches',
        message: 'Height inches must be an integer between 0 and 11',
      });
    }
  }

  if (data.weight !== undefined) {
    const weight = Number(data.weight);
    if (Number.isNaN(weight) || weight <= 0) {
      errors.push({
        field: 'weight',
        message: 'Weight must be a positive number',
      });
    }
  }

  if (data.weightUnit !== undefined) {
    if (!WEIGHT_UNITS.includes(data.weightUnit as WeightUnit)) {
      errors.push({
        field: 'weightUnit',
        message: `Weight unit must be one of: ${WEIGHT_UNITS.join(', ')}`,
      });
    }
  }

  if (data.bodyFatPercent !== undefined) {
    const bodyFatPercent = Number(data.bodyFatPercent);
    if (Number.isNaN(bodyFatPercent) || bodyFatPercent < 0 || bodyFatPercent > 100) {
      errors.push({
        field: 'bodyFatPercent',
        message: 'Body fat percent must be a number between 0 and 100',
      });
    }
  }

  if (data.restingHr !== undefined) {
    const restingHr = Number(data.restingHr);
    if (!Number.isInteger(restingHr) || restingHr < 20 || restingHr > 250) {
      errors.push({
        field: 'restingHr',
        message: 'Resting heart rate must be an integer between 20 and 250',
      });
    }
  }

  if (data.avatarBase64 !== undefined) {
    if (typeof data.avatarBase64 !== 'string') {
      errors.push({ field: 'avatarBase64', message: 'Avatar must be a string' });
    } else if (data.avatarBase64.length > 2_800_000) {
      errors.push({
        field: 'avatarBase64',
        message: 'Avatar must be no longer than 2,800,000 characters',
      });
    }
  }

  return errors;
}
