import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router';
import ProtectedRoutes from './ProtectedRoutes';
import { getUser } from '@/features/auth/services/authService';

// Mock dependencias
vi.mock('@/features/auth/services/authService', () => ({
  getUser: vi.fn(),
}));
vi.mock('@/shared/components/PageLoader', () => ({
  __esModule: true,
  default: () => <div data-testid="loader">Loading...</div>,
}));

function DummyProtected() {
  return <div data-testid="protected">Protected Content</div>;
}
function DummyGuest() {
  return <div data-testid="guest">Guest Content</div>;
}

const renderWithRouter = (initialEntries = ['/protected']) =>
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route element={<ProtectedRoutes />}>
          <Route path="/protected" element={<DummyProtected />} />
        </Route>
        <Route path="/" element={<DummyGuest />} />
      </Routes>
    </MemoryRouter>
  );

describe('ProtectedRoutes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('muestra el loader mientras carga', async () => {
    getUser.mockReturnValue(new Promise(() => {})); // never resolves
    renderWithRouter();
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('renderiza el Outlet si hay usuario', async () => {
    getUser.mockResolvedValue({ id: 1, name: 'User' });
    renderWithRouter();
    await waitFor(() => {
      expect(screen.getByTestId('protected')).toBeInTheDocument();
    });
  });

  it('redirecciona a "/" si no hay usuario', async () => {
    getUser.mockResolvedValue(null);
    renderWithRouter();
    await waitFor(() => {
      expect(screen.getByTestId('guest')).toBeInTheDocument();
    });
  });
});