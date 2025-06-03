import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router';
import NavbarSmall from './NavbarSmall';
import URLS from '@/constants/urls';
import { ThemeContext } from '@/shared/context/ThemeContext';
import { vi } from 'vitest';

// Mock phosphor-icons
vi.mock('@phosphor-icons/react', () => ({
  House: (props) => <svg data-testid="icon-house" {...props} />,
  User: (props) => <svg data-testid="icon-user" {...props} />,
  Gear: (props) => <svg data-testid="icon-gear" {...props} />,
  Basket: (props) => <svg data-testid="icon-basket" {...props} />,
  BookBookmark: (props) => <svg data-testid="icon-book" {...props} />,
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

// Mock react-router
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => (route) => { window.history.pushState({}, '', route); },
    useLocation: () => ({ pathname: window.location.pathname }),
  };
});

// Helper to render with router and theme
const renderWithRouter = (ui, { route = URLS.HOME, isDarkMode = false } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(
    <MemoryRouter initialEntries={[route]}>
      <ThemeContext.Provider value={{ isDarkMode }}>
        <Routes>
          <Route path="*" element={ui} />
        </Routes>
      </ThemeContext.Provider>
    </MemoryRouter>
  );
};

const buttons = [
  { id: 'nav-home-button', icon: 'icon-house', route: URLS.HOME },
  { id: 'nav-profile-button', icon: 'icon-user', route: URLS.PROFILE },
  { id: 'nav-pantry-button', icon: 'icon-basket', route: URLS.PANTRY },
  { id: 'nav-create-recipe-button', icon: 'icon-book', route: URLS.CREATE_RECIPE },
  { id: 'nav-settings-button', icon: 'icon-gear', route: URLS.SETTINGS },
];

describe('NavbarSmall', () => {
  afterEach(() => cleanup());

  it('renders all nav buttons', () => {
    renderWithRouter(<NavbarSmall />);
    buttons.forEach(({ id }) => {
      expect(screen.getByTestId(id)).toBeInTheDocument();
    });
  });

  it('applies "font-bold" and weight="fill" only to the active route button', () => {
    buttons.forEach(({ id, icon, route }) => {
      cleanup();
      renderWithRouter(<NavbarSmall />, { route });
      const button = screen.getByTestId(id);
      const iconEl = screen.getByTestId(icon);
      expect(button).toHaveClass('font-bold');
      expect(iconEl).toHaveAttribute('weight', 'fill');
      // Los demás no deben tener font-bold ni weight fill
      buttons.filter(b => b.id !== id).forEach(({ id: otherId, icon: otherIcon }) => {
        expect(screen.getByTestId(otherId)).not.toHaveClass('font-bold');
        expect(screen.getByTestId(otherIcon)).toHaveAttribute('weight', 'bold');
      });
    });
  });

  it('renders icons with white color when isDarkMode is true', () => {
    renderWithRouter(<NavbarSmall />, { isDarkMode: true });
    buttons.forEach(({ icon }) => {
      const iconEl = screen.getByTestId(icon);
      expect(iconEl).toHaveAttribute('color', '#fff');
    });
  });

  it('renders icons with black color when isDarkMode is false', () => {
    renderWithRouter(<NavbarSmall />, { isDarkMode: false });
    buttons.forEach(({ icon }) => {
      const iconEl = screen.getByTestId(icon);
      expect(iconEl).toHaveAttribute('color', '#000');
    });
  });

  it('navigates to correct route on button click', () => {
    renderWithRouter(<NavbarSmall />);
    buttons.forEach(({ id, route }) => {
      fireEvent.click(screen.getByTestId(id));
      expect(window.location.pathname).toBe(route);
    });
  });
});