import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomeLayout from './HomeLayout';
import React from 'react';

// Mocks
vi.mock('@/shared/components/Navbar', () => ({
  default: () => <nav data-testid="navbar">Navbar</nav>,
}));
vi.mock('@/shared/components/NavbarSmall', () => ({
  default: () => <nav data-testid="navbar-small">NavbarSmall</nav>,
}));
vi.mock('@/shared/components/MockAd', () => ({
  default: (props) => <div data-testid="mock-ad" {...props}>MockAd</div>,
}));
vi.mock('react-router', () => ({
  Outlet: () => <div data-testid="outlet">Outlet content</div>,
}));

describe('HomeLayout', () => {
  it('renders Navbar on desktop (sm and up)', () => {
    render(<HomeLayout />);
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  it('renders NavbarSmall for mobile (always in DOM)', () => {
    render(<HomeLayout />);
    expect(screen.getByTestId('navbar-small')).toBeInTheDocument();
  });

  it('renders MockAd in the side content', () => {
    render(<HomeLayout />);
    expect(screen.getByTestId('mock-ad')).toBeInTheDocument();
    expect(screen.getByTestId('mock-ad')).toHaveAttribute('height', '50%');
    expect(screen.getByTestId('mock-ad')).toHaveAttribute('width', '80%');
  });

  it('renders Outlet for main content', () => {
    render(<HomeLayout />);
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
    expect(screen.getByTestId('outlet')).toHaveTextContent('Outlet content');
  });
});