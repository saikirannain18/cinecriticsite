import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import AdminAddMovie from './AdminAddMovie.jsx'

// Simple router — /admin loads admin page, everything else loads the main site
const isAdmin = window.location.pathname === '/admin'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isAdmin ? <AdminAddMovie /> : <App />}
  </StrictMode>
)