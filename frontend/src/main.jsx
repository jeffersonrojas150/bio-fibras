import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'

// Importar React Query
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

// Crear el cliente de consultas
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos (datos considerados "frescos")
      cacheTime: 1000 * 60 * 60 * 24, // 24 horas (mantiene la caché)
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Proveedor global de React Query */}
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
