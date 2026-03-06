import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import type { UserProfile, BmiStatus } from '@/shared/types';
import { ProfileForm } from '@/features/profile-form';

const mockRefresh = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: mockRefresh }),
}));

const defaultInitialProfile: UserProfile = {
  id: 1,
  age: 32,
  gender: 'Male',
  height: 178,
  heightUnit: 'cm',
  heightInches: null,
  weight: 78,
  weightUnit: 'kg',
  bodyFatPercent: 15,
  restingHr: 60,
  avatarBase64: null,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
};

describe('ProfileForm', () => {
  beforeEach(() => {
    mockRefresh.mockClear();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true }),
    );
  });

  describe('renders all form fields', () => {
    it('shows labels for Age, Resting HR, Weight, Height, Body Fat %, Gender, Calculated BMI', () => {
      render(
        <ProfileForm
          initialProfile={null}
          bmi={null}
          bmiStatus={null}
        />,
      );

      expect(screen.getByText('Age')).toBeInTheDocument();
      expect(screen.getByText('Resting HR')).toBeInTheDocument();
      expect(screen.getByText('Weight')).toBeInTheDocument();
      expect(screen.getByText('Height')).toBeInTheDocument();
      expect(screen.getByText('Body Fat %')).toBeInTheDocument();
      expect(screen.getByText('Gender')).toBeInTheDocument();
      expect(screen.getByText('Calculated BMI')).toBeInTheDocument();
    });
  });

  describe('populates form from initialProfile', () => {
    it('fills inputs with initial profile values', () => {
      render(
        <ProfileForm
          initialProfile={defaultInitialProfile}
          bmi={24.6}
          bmiStatus={'Normal' as BmiStatus}
        />,
      );

      expect(screen.getByLabelText('Age')).toHaveValue(32);
      expect(screen.getByLabelText('Resting HR')).toHaveValue(60);
      expect(screen.getByLabelText('Weight')).toHaveValue(78);
      expect(screen.getByLabelText('Height')).toHaveValue(178);
      expect(screen.getByLabelText('Body Fat %')).toHaveValue(15);
      expect(screen.getByLabelText('Gender')).toHaveValue('Male');
    });
  });

  describe('cancel resets form to initial values', () => {
    it('reverts age to initial value when Cancel is clicked', () => {
      render(
        <ProfileForm
          initialProfile={defaultInitialProfile}
          bmi={null}
          bmiStatus={null}
        />,
      );

      const ageInput = screen.getByLabelText('Age');
      fireEvent.change(ageInput, { target: { value: '99' } });
      expect(ageInput).toHaveValue(99);

      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
      expect(ageInput).toHaveValue(32);
    });
  });

  describe('height shows two inputs when ft-in selected', () => {
    it('displays inches input when height unit is ft-in', () => {
      render(
        <ProfileForm
          initialProfile={null}
          bmi={null}
          bmiStatus={null}
        />,
      );

      const heightUnitSelect = screen.getAllByRole('combobox')[1];
      fireEvent.change(heightUnitSelect, { target: { value: 'ft-in' } });

      expect(screen.getByPlaceholderText('in')).toBeInTheDocument();
    });
  });

  describe('submit calls API', () => {
    it('calls fetch with PUT to /api/profile and refreshes router on success', async () => {
      const mockFetch = vi.fn().mockResolvedValue({ ok: true });
      vi.stubGlobal('fetch', mockFetch);

      render(
        <ProfileForm
          initialProfile={null}
          bmi={null}
          bmiStatus={null}
        />,
      );

      fireEvent.change(screen.getByLabelText('Age'), {
        target: { value: '25' },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: expect.any(String),
        });
      });

      await waitFor(() => {
        expect(mockRefresh).toHaveBeenCalled();
      });
    });
  });
});
