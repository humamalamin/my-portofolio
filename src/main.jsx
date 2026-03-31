console.log("main.jsx executing");
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

try {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
} catch (e) {
  console.error("Render failed", e);
  document.getElementById('root').innerHTML = `<h1>Render Error: ${e.message}</h1>`;
}
