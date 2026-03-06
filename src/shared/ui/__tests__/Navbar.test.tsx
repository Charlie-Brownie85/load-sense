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
  it('renders with link to /profile', () => {
    render(<Navbar />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/profile');
  });

  it('shows person icon when no avatar provided', () => {
    render(<Navbar />);
    expect(screen.getByText('person')).toBeInTheDocument();
  });

  it('shows avatar image when avatarBase64 provided', () => {
    const avatarBase64 = 'data:image/png;base64,abc123';
    render(<Navbar avatarBase64={avatarBase64} />);
    const img = screen.getByRole('img', { name: 'Profile' });
    expect(img).toHaveAttribute('src', avatarBase64);
  });

  it('renders LoadSense text', () => {
    render(<Navbar />);
    expect(screen.getByText('LoadSense')).toBeInTheDocument();
  });
});
