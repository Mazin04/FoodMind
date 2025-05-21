import { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'

import App from '@/app/App'
import Home from '@/app/pages/Home'
import HomeLayout from '@/app/layout/HomeLayout'
import Profile from '@/app/pages/Profile'
import Settings from '@/app/pages/Settings'
import Pantry from '@/features/pantry/pages/Pantry'
import RecipeDetails from '@/features/recipes/pages/RecipeDetails'
import CreateRecipe from '@/features/recipes/pages/CreateRecipe'
import PageLoader from '@/shared/components/PageLoader'

import { ThemeProvider } from '@/shared/context/ThemeContext'
import GuestRoutes from '@/router/GuestRoutes'
import ProtectedRoutes from '@/router/ProtectedRoutes'

import { Toaster } from 'react-hot-toast'

import URLS from '@/constants/urls.js'
import '@/i18n.js'


createRoot(document.getElementById('root')).render(
    <ThemeProvider>
      <Suspense fallback={<PageLoader />}>
        <BrowserRouter>
          <Routes>

            {/* Rutas públicas */}
            <Route element={<GuestRoutes />}>
              <Route path={URLS.MAIN} element={<App />} />
            </Route>

            {/* Rutas protegidas */}
            <Route element={<ProtectedRoutes />}>
              <Route element={<HomeLayout />}>
                <Route path={URLS.HOME} element={<Home />} />
                <Route path={URLS.PROFILE} element={<Profile />} />
                <Route path={URLS.SETTINGS} element={<Settings />} />
                <Route path={URLS.PANTRY} element={<Pantry />} />
                <Route path={URLS.RECIPE_DETAILS} element={<RecipeDetails />} />
                <Route path={URLS.CREATE_RECIPE} element={<CreateRecipe />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to={URLS.MAIN} replace />} />
          </Routes>

          <Toaster
            position='bottom-center'
            reverseOrder={false}
            toastOptions={{
              className: 'bg-neutral-900 dark:bg-neutral-900 text-white',
              duration: 4000,
            }}
          />
        </BrowserRouter>
      </Suspense>
    </ThemeProvider>,
)
