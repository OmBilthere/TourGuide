import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import  {BrowserRouter} from 'react-router-dom'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/clerk-react'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
if(!PUBLISHABLE_KEY) {
  throw new Error('Missing publishable key.')
}


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl={'/'}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>,
)
