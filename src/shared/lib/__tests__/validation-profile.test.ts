import { describe, it, expect } from 'vitest';
import { validateProfile, type ValidationError } from '@/shared/lib/validation';

function hasErrorForField(errors: ValidationError[], field: string): boolean {
  return errors.some((e) => e.field === field);
}

describe('validateProfile', () => {
  describe('valid inputs', () => {
    it('empty object returns no errors', () => {
      expect(validateProfile({})).toEqual([]);
    });

    it('complete valid profile returns no errors', () => {
      const result = validateProfile({
        age: 32,
        gender: 'Male',
        height: 178,
        heightUnit: 'cm',
        weight: 78,
        weightUnit: 'kg',
        bodyFatPercent: 15,
        restingHr: 60,
      });
      expect(result).toEqual([]);
    });

    it('partial valid profile returns no errors', () => {
      const result = validateProfile({ age: 25, height: 170 });
      expect(result).toEqual([]);
    });
  });

  describe('age validation', () => {
    it('age: 0 → error', () => {
      const result = validateProfile({ age: 0 });
      expect(hasErrorForField(result, 'age')).toBe(true);
    });

    it('age: 151 → error', () => {
      const result = validateProfile({ age: 151 });
      expect(hasErrorForField(result, 'age')).toBe(true);
    });

    it('age: 25.5 → error (not integer)', () => {
      const result = validateProfile({ age: 25.5 });
      expect(hasErrorForField(result, 'age')).toBe(true);
    });

    it('age: 1 → no error (boundary)', () => {
      const result = validateProfile({ age: 1 });
      expect(hasErrorForField(result, 'age')).toBe(false);
    });

    it('age: 150 → no error (boundary)', () => {
      const result = validateProfile({ age: 150 });
      expect(hasErrorForField(result, 'age')).toBe(false);
    });
  });

  describe('gender validation', () => {
    it("gender: 'Other' → error", () => {
      const result = validateProfile({ gender: 'Other' });
      expect(hasErrorForField(result, 'gender')).toBe(true);
    });

    it("gender: 'Male' → no error", () => {
      const result = validateProfile({ gender: 'Male' });
      expect(hasErrorForField(result, 'gender')).toBe(false);
    });

    it("gender: 'Female' → no error", () => {
      const result = validateProfile({ gender: 'Female' });
      expect(hasErrorForField(result, 'gender')).toBe(false);
    });
  });

  describe('height/weight validation', () => {
    it('height: -5 → error', () => {
      const result = validateProfile({ height: -5 });
      expect(hasErrorForField(result, 'height')).toBe(true);
    });

    it('height: 0 → error', () => {
      const result = validateProfile({ height: 0 });
      expect(hasErrorForField(result, 'height')).toBe(true);
    });

    it('weight: -10 → error', () => {
      const result = validateProfile({ weight: -10 });
      expect(hasErrorForField(result, 'weight')).toBe(true);
    });

    it('weight: 0 → error', () => {
      const result = validateProfile({ weight: 0 });
      expect(hasErrorForField(result, 'weight')).toBe(true);
    });
  });

  describe('unit validation', () => {
    it("heightUnit: 'inches' → error", () => {
      const result = validateProfile({ heightUnit: 'inches' });
      expect(hasErrorForField(result, 'heightUnit')).toBe(true);
    });

    it("weightUnit: 'stone' → error", () => {
      const result = validateProfile({ weightUnit: 'stone' });
      expect(hasErrorForField(result, 'weightUnit')).toBe(true);
    });
  });

  describe('heightInches validation', () => {
    it("heightUnit: 'ft-in', heightInches: 12 → error (must be 0-11)", () => {
      const result = validateProfile({
        heightUnit: 'ft-in',
        heightInches: 12,
      });
      expect(hasErrorForField(result, 'heightInches')).toBe(true);
    });

    it("heightUnit: 'ft-in', heightInches: -1 → error", () => {
      const result = validateProfile({
        heightUnit: 'ft-in',
        heightInches: -1,
      });
      expect(hasErrorForField(result, 'heightInches')).toBe(true);
    });

    it("heightUnit: 'ft-in', heightInches: 5.5 → error (not integer)", () => {
      const result = validateProfile({
        heightUnit: 'ft-in',
        heightInches: 5.5,
      });
      expect(hasErrorForField(result, 'heightInches')).toBe(true);
    });

    it("heightUnit: 'cm', heightInches: 15 → no error (ignored when cm)", () => {
      const result = validateProfile({
        heightUnit: 'cm',
        heightInches: 15,
      });
      expect(hasErrorForField(result, 'heightInches')).toBe(false);
    });
  });

  describe('bodyFatPercent validation', () => {
    it('bodyFatPercent: -1 → error', () => {
      const result = validateProfile({ bodyFatPercent: -1 });
      expect(hasErrorForField(result, 'bodyFatPercent')).toBe(true);
    });

    it('bodyFatPercent: 101 → error', () => {
      const result = validateProfile({ bodyFatPercent: 101 });
      expect(hasErrorForField(result, 'bodyFatPercent')).toBe(true);
    });

    it('bodyFatPercent: 0 → no error (boundary)', () => {
      const result = validateProfile({ bodyFatPercent: 0 });
      expect(hasErrorForField(result, 'bodyFatPercent')).toBe(false);
    });

    it('bodyFatPercent: 100 → no error (boundary)', () => {
      const result = validateProfile({ bodyFatPercent: 100 });
      expect(hasErrorForField(result, 'bodyFatPercent')).toBe(false);
    });
  });

  describe('restingHr validation', () => {
    it('restingHr: 19 → error', () => {
      const result = validateProfile({ restingHr: 19 });
      expect(hasErrorForField(result, 'restingHr')).toBe(true);
    });

    it('restingHr: 251 → error', () => {
      const result = validateProfile({ restingHr: 251 });
      expect(hasErrorForField(result, 'restingHr')).toBe(true);
    });

    it('restingHr: 20 → no error (boundary)', () => {
      const result = validateProfile({ restingHr: 20 });
      expect(hasErrorForField(result, 'restingHr')).toBe(false);
    });

    it('restingHr: 250 → no error (boundary)', () => {
      const result = validateProfile({ restingHr: 250 });
      expect(hasErrorForField(result, 'restingHr')).toBe(false);
    });
  });

  describe('avatarBase64 validation', () => {
    it('string of length 2_800_001 → error', () => {
      const result = validateProfile({
        avatarBase64: 'x'.repeat(2_800_001),
      });
      expect(hasErrorForField(result, 'avatarBase64')).toBe(true);
    });

    it('string of length 100 → no error', () => {
      const result = validateProfile({
        avatarBase64: 'x'.repeat(100),
      });
      expect(hasErrorForField(result, 'avatarBase64')).toBe(false);
    });
  });
});
