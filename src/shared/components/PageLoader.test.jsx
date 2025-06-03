import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import React from 'react';

// Mock logos
vi.mock('@/assets/images/logos/Logo_w_mode.png', () => ({ default: 'white-logo.png' }));
vi.mock('@/assets/images/logos/Logo_b_mode.png', () => ({ default: 'black-logo.png' }));

describe('PageLoader', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('renders with light logo when isDarkMode is false', async () => {
    vi.doMock('@/shared/context/ThemeContext', () => ({
      useTheme: () => ({ isDarkMode: false }),
    }));
    const { default: PageLoader } = await import('./PageLoader');
    render(<PageLoader />);
    const img = screen.getByAltText('Logo loader');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'white-logo.png');
  });

  it('renders with dark logo when isDarkMode is true', async () => {
    vi.doMock('@/shared/context/ThemeContext', () => ({
      useTheme: () => ({ isDarkMode: true }),
    }));
    const { default: PageLoader } = await import('./PageLoader');
    render(<PageLoader />);
    const img = screen.getByAltText('Logo loader');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'black-logo.png');
  });
});
