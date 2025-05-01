import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClientProviderWrapper } from './components'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProviderWrapper>
      <App />
    </QueryClientProviderWrapper>
  </StrictMode>,
)
