import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ThemeProvider, useTheme } from './ThemeContext';

// Componente de prueba para consumir el contexto
function TestComponent() {
  const { isDarkMode, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="mode">{isDarkMode ? 'dark' : 'light'}</span>
      <button onClick={toggleTheme}>toggle</button>
    </div>
  );
}

describe('ThemeContext', () => {
  let matchMediaMock;
  let classListAddSpy;
  let classListRemoveSpy;
  let classListToggleSpy;
  let originalMatchMedia;

  beforeEach(() => {
    // Mock localStorage
    vi.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation(() => null);
    vi.spyOn(window.localStorage.__proto__, 'setItem').mockImplementation(() => {});

    // Mock matchMedia
    originalMatchMedia = window.matchMedia;
    matchMediaMock = vi.fn().mockReturnValue({ matches: false });
    window.matchMedia = matchMediaMock;

    // Mock classList
    classListAddSpy = vi.spyOn(document.documentElement.classList, 'add');
    classListRemoveSpy = vi.spyOn(document.documentElement.classList, 'remove');
    classListToggleSpy = vi.spyOn(document.documentElement.classList, 'toggle');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    window.matchMedia = originalMatchMedia;
  });

  it('should provide light mode by default', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    expect(screen.getByTestId('mode').textContent).toBe('light');
  });

  it('should provide dark mode if localStorage is dark', () => {
    window.localStorage.getItem.mockReturnValue('dark');
    matchMediaMock.mockReturnValue({ matches: false });
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    expect(screen.getByTestId('mode').textContent).toBe('dark');
  });

  it('should provide dark mode if prefers-color-scheme is dark and no localStorage', () => {
    window.localStorage.getItem.mockReturnValue(null);
    matchMediaMock.mockReturnValue({ matches: true });
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    expect(screen.getByTestId('mode').textContent).toBe('dark');
  });

  it('should toggle theme and update localStorage and classList', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    const button = screen.getByText('toggle');

    // Primer click: activa dark
    button.click();
    await Promise.resolve(); // Espera el ciclo de eventos
    expect(window.localStorage.setItem).toHaveBeenCalledWith('color-theme', 'dark');
    expect(classListToggleSpy).toHaveBeenCalledWith('dark', true);
    expect(screen.getByTestId('mode').textContent).toBe('dark');

    // Segundo click: activa light
    button.click();
    await Promise.resolve();
    expect(window.localStorage.setItem).toHaveBeenCalledWith('color-theme', 'light');
    expect(classListToggleSpy).toHaveBeenCalledWith('dark', false);
    expect(screen.getByTestId('mode').textContent).toBe('light');
  });
});