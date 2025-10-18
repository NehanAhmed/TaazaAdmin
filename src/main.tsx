import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { Toaster } from "./components/ui/sonner"
import { BrowserRouter } from 'react-router'
import { ThemeProvider } from "./components/theme-provider"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster position="top-right" richColors />
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey='vite-ui-theme'>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
)

  
