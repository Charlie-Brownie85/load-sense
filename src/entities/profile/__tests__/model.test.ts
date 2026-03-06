import { describe, it, expect } from 'vitest';
import {
  convertHeightToCm,
  convertWeightToKg,
  calculateBmi,
  classifyBmiStatus,
} from '@/entities/profile';

describe('convertHeightToCm', () => {
  it('returns height directly when unit is cm', () => {
    expect(convertHeightToCm(178, null, 'cm')).toBe(178);
  });

  it('converts ft-in correctly (5ft 11in = 180.34cm)', () => {
    expect(convertHeightToCm(5, 11, 'ft-in')).toBeCloseTo(180.34, 2);
  });

  it('treats null inches as 0 for ft-in', () => {
    expect(convertHeightToCm(5, null, 'ft-in')).toBeCloseTo(152.4, 2);
  });
});

describe('convertWeightToKg', () => {
  it('returns weight directly when unit is kg', () => {
    expect(convertWeightToKg(78, 'kg')).toBe(78);
  });

  it('converts lb to kg correctly (170 lb ≈ 77.11 kg)', () => {
    expect(convertWeightToKg(170, 'lb')).toBeCloseTo(77.11, 2);
  });
});

describe('calculateBmi', () => {
  it('computes BMI for metric inputs (178cm, 78kg ≈ 24.6)', () => {
    const result = calculateBmi({
      height: 178,
      heightInches: null,
      heightUnit: 'cm',
      weight: 78,
      weightUnit: 'kg',
    });
    expect(result).toBeCloseTo(24.6, 1);
  });

  it('computes BMI for imperial inputs (5ft 11in, 172lb)', () => {
    const result = calculateBmi({
      height: 5,
      heightInches: 11,
      heightUnit: 'ft-in',
      weight: 172,
      weightUnit: 'lb',
    });
    expect(result).toBeCloseTo(24.0, 1);
  });

  it('returns null when height is null', () => {
    expect(
      calculateBmi({
        height: null,
        heightInches: null,
        heightUnit: 'cm',
        weight: 78,
        weightUnit: 'kg',
      })
    ).toBeNull();
  });

  it('returns null when weight is null', () => {
    expect(
      calculateBmi({
        height: 178,
        heightInches: null,
        heightUnit: 'cm',
        weight: null,
        weightUnit: 'kg',
      })
    ).toBeNull();
  });

  it('returns null when height is 0', () => {
    expect(
      calculateBmi({
        height: 0,
        heightInches: null,
        heightUnit: 'cm',
        weight: 78,
        weightUnit: 'kg',
      })
    ).toBeNull();
  });
});

describe('classifyBmiStatus', () => {
  it('returns Underweight for 17.0', () => {
    expect(classifyBmiStatus(17.0)).toBe('Underweight');
  });

  it('returns Normal at 18.5 boundary', () => {
    expect(classifyBmiStatus(18.5)).toBe('Normal');
  });

  it('returns Normal for 22.0', () => {
    expect(classifyBmiStatus(22.0)).toBe('Normal');
  });

  it('returns Overweight at 25.0 boundary', () => {
    expect(classifyBmiStatus(25.0)).toBe('Overweight');
  });

  it('returns Overweight for 28.0', () => {
    expect(classifyBmiStatus(28.0)).toBe('Overweight');
  });

  it('returns Obese at 30.0 boundary', () => {
    expect(classifyBmiStatus(30.0)).toBe('Obese');
  });

  it('returns Obese for 35.0', () => {
    expect(classifyBmiStatus(35.0)).toBe('Obese');
  });
});
