import { createRoot } from 'react-dom/client'
import { Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'

import App from '@/pages/App.jsx'
import Example from '@/pages/Example.jsx'
import Home from '@/pages/Home.jsx'

import ProtectedRoutes from '@/utils/ProtectedRoutes.jsx'
import PageLoader from '@/components/PageLoader.jsx'

import { ThemeProvider } from '@/context/ThemeContext.jsx'

import '@/i18n.js'
import GuestRoutes from './utils/GuestRoutes'

createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <Suspense fallback={<PageLoader />}>
      <BrowserRouter>
        <Routes>

          {/* Rutas públicas */}
          <Route element={<GuestRoutes />}>
            <Route path="/" element={<App />} />
          </Route>

          {/* Rutas protegidas */}
          <Route element={<ProtectedRoutes />}>
            <Route path="/home" element={<Home />} />
            <Route path="/example" element={<Example />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  </ThemeProvider>,
)
