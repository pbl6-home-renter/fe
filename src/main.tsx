import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '@/i18n/i18n'
import App from './App.tsx'
import { useAuthStore } from '@/stores/auth-store'
import { apiClient } from '@/lib/axios'

if (import.meta.env.DEV) {
  (window as unknown as { authStore: typeof useAuthStore; apiClient: typeof apiClient }).authStore = useAuthStore;
  (window as unknown as { authStore: typeof useAuthStore; apiClient: typeof apiClient }).apiClient = apiClient;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
