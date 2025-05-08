import { createRoot } from 'react-dom/client'
import { Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'

import HomeLayout from '@/layout/HomeLayout.jsx'
import App from '@/pages/App.jsx'
import Example from '@/pages/Example.jsx'
import Home from '@/pages/Home.jsx'
import Profile from '@/pages/Profile'
import Settings from '@/pages/Settings'
import Pantry from './pages/Pantry'

import { Toaster } from 'react-hot-toast'
import GuestRoutes from '@/utils/GuestRoutes'
import ProtectedRoutes from '@/utils/ProtectedRoutes.jsx'
import PageLoader from '@/components/PageLoader.jsx'

import { ThemeProvider } from '@/context/ThemeContext.jsx'

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
              </Route>

              <Route path={URLS.EXAMPLE} element={<Example />} />
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
