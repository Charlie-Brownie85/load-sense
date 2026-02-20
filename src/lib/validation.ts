import { SESSION_TYPES, type SessionType } from "./types";

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

export function validateSession(
  data: SessionInput,
  partial = false,
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!partial || data.date !== undefined) {
    if (!data.date) {
      errors.push({ field: "date", message: "Date is required" });
    } else if (isNaN(new Date(data.date as string).getTime())) {
      errors.push({ field: "date", message: "Date must be a valid date" });
    }
  }

  if (!partial || data.type !== undefined) {
    if (!data.type) {
      errors.push({ field: "type", message: "Type is required" });
    } else if (!SESSION_TYPES.includes(data.type as SessionType)) {
      errors.push({
        field: "type",
        message: `Type must be one of: ${SESSION_TYPES.join(", ")}`,
      });
    }
  }

  if (!partial || data.duration !== undefined) {
    const duration = Number(data.duration);
    if (data.duration === undefined || data.duration === null) {
      if (!partial) errors.push({ field: "duration", message: "Duration is required" });
    } else if (!Number.isInteger(duration) || duration <= 0) {
      errors.push({
        field: "duration",
        message: "Duration must be a positive integer",
      });
    }
  }

  if (!partial || data.rpe !== undefined) {
    const rpe = Number(data.rpe);
    if (data.rpe === undefined || data.rpe === null) {
      if (!partial) errors.push({ field: "rpe", message: "RPE is required" });
    } else if (!Number.isInteger(rpe) || rpe < 1 || rpe > 10) {
      errors.push({
        field: "rpe",
        message: "RPE must be an integer between 1 and 10",
      });
    }
  }

  return errors;
}
