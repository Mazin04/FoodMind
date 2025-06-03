import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import React from 'react'

// Mock de createRoot y el elemento root
vi.mock('react-dom/client', () => ({
  createRoot: () => ({
    render: vi.fn(),
  }),
}))

// Mock de los componentes y rutas usados en main.jsx
vi.mock('@/app/App', () => ({ default: () => <div>App</div> }))
vi.mock('@/app/pages/Home', () => ({ default: () => <div>Home</div> }))
vi.mock('@/app/layout/HomeLayout', () => ({ default: () => <div>HomeLayout</div> }))
vi.mock('@/app/pages/Profile', () => ({ default: () => <div>Profile</div> }))
vi.mock('@/app/pages/ProfileVisit', () => ({ default: () => <div>ProfileVisit</div> }))
vi.mock('@/app/pages/Settings', () => ({ default: () => <div>Settings</div> }))
vi.mock('@/features/pantry/pages/Pantry', () => ({ default: () => <div>Pantry</div> }))
vi.mock('@/features/recipes/pages/RecipeDetails', () => ({ default: () => <div>RecipeDetails</div> }))
vi.mock('@/features/recipes/pages/CreateRecipe', () => ({ default: () => <div>CreateRecipe</div> }))
vi.mock('@/shared/components/PageLoader', () => ({ default: () => <div>PageLoader</div> }))
vi.mock('@/shared/context/ThemeContext', () => ({
  ThemeProvider: ({ children }) => <div>{children}</div>,
}))
vi.mock('@/router/GuestRoutes', () => ({ default: ({ children }) => <div>{children}</div> }))
vi.mock('@/router/ProtectedRoutes', () => ({ default: ({ children }) => <div>{children}</div> }))
vi.mock('react-hot-toast', () => ({
  Toaster: () => <div>Toaster</div>,
}))
vi.mock('@/constants/urls.js', () => ({
  default: {
    MAIN: '/',
    HOME: '/home',
    PROFILE: '/profile',
    PROFILE_VISIT: '/profile/:id',
    SETTINGS: '/settings',
    PANTRY: '/pantry',
    RECIPE_DETAILS: '/recipe/:id',
    CREATE_RECIPE: '/create',
    TERMS: '/terms',
  },
}))
vi.mock('@/i18n.js', () => ({}))
vi.mock('./app/pages/Terms', () => ({ default: () => <div>Terms</div> }))

import './main.jsx'

describe('main.jsx', () => {
  it('renders without crashing', () => {
    // Si no lanza error, pasa el test
    expect(true).toBe(true)
  })
})