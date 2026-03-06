import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Navbar } from '../Navbar';

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('Navbar', () => {
  it('renders logo as a link to /dashboard', () => {
    render(<Navbar />);
    const link = screen.getByRole('link', { name: /loadsense/i });
    expect(link).toHaveAttribute('href', '/dashboard');
  });

  it('shows person icon', () => {
    render(<Navbar />);
    expect(screen.getByText('person')).toBeInTheDocument();
  });

  it('renders LoadSense text', () => {
    render(<Navbar />);
    expect(screen.getByText('LoadSense')).toBeInTheDocument();
  });
});
