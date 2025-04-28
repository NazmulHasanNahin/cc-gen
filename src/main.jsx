import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AdvancedCardGenerator from './components/AdvancedCardGenerator.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
<AdvancedCardGenerator></AdvancedCardGenerator>
  </StrictMode>,
)
