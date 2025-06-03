import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router';
import GuestRoutes from './GuestRoutes';
import URLS from '@/constants/urls';
import { getUser } from '@/features/auth/services/authService';

// Mock dependencias
vi.mock('@/features/auth/services/authService', () => ({
  getUser: vi.fn(),
}));
vi.mock('@/shared/components/PageLoader', () => ({
  __esModule: true,
  default: () => <div data-testid="loader">Loading...</div>,
}));

function DummyGuest() {
  return <div data-testid="guest">Guest Content</div>;
}
function DummyHome() {
  return <div data-testid="home">Home Content</div>;
}

const renderWithRouter = (initialEntries = [URLS.MAIN]) =>
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route element={<GuestRoutes />}>
          <Route path={URLS.MAIN} element={<DummyGuest />} />
        </Route>
        <Route path={URLS.HOME} element={<DummyHome />} />
      </Routes>
    </MemoryRouter>
  );

describe('GuestRoutes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('muestra el loader mientras carga', async () => {
    getUser.mockReturnValue(new Promise(() => {})); // never resolves
    renderWithRouter();
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('renderiza el Outlet si no hay usuario', async () => {
    getUser.mockResolvedValue(null);
    renderWithRouter();
    await waitFor(() => {
      expect(screen.getByTestId('guest')).toBeInTheDocument();
    });
  });

  it('redirecciona a HOME si hay usuario', async () => {
    getUser.mockResolvedValue({ id: 1, name: 'User' });
    renderWithRouter();
    await waitFor(() => {
      expect(screen.getByTestId('home')).toBeInTheDocument();
    });
  });
});