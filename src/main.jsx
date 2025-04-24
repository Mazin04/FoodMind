import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import App from './pages/App.jsx'
import './i18n.js'
import { BrowserRouter, Routes, Route } from 'react-router'
import Example from './pages/Example.jsx'
import PageLoader from './components/PageLoader.jsx'

createRoot(document.getElementById('root')).render(
  <Suspense fallback={<PageLoader />}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/example" element={<Example />} />
          <Route path="/loading" element={<PageLoader />} />
          <Route path="*" element={<App />} />
        </Routes>
      </BrowserRouter>
  </Suspense>,
)
