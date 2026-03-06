import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BmiIndicator } from '@/entities/profile';

describe('BmiIndicator', () => {
  it('renders BMI value and Normal status', () => {
    render(<BmiIndicator bmi={24.6} status="Normal" />);
    expect(screen.getByText('24.6')).toBeInTheDocument();
    expect(screen.getByText('Normal')).toBeInTheDocument();
  });

  it('renders Underweight status with correct styling', () => {
    const { container } = render(
      <BmiIndicator bmi={17.5} status="Underweight" />
    );
    expect(screen.getByText('Underweight')).toBeInTheDocument();
    const badge = container.querySelector('.bg-yellow-100');
    expect(badge).toBeInTheDocument();
  });

  it('renders Overweight status', () => {
    render(<BmiIndicator bmi={27.0} status="Overweight" />);
    expect(screen.getByText('27')).toBeInTheDocument();
    expect(screen.getByText('Overweight')).toBeInTheDocument();
  });

  it('renders Obese status', () => {
    render(<BmiIndicator bmi={32.0} status="Obese" />);
    expect(screen.getByText('32')).toBeInTheDocument();
    expect(screen.getByText('Obese')).toBeInTheDocument();
  });

  it('renders N/A when bmi is null', () => {
    render(<BmiIndicator bmi={null} status={null} />);
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });
});
