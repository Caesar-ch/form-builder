import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// import SimpleForm from './components/SimpleForm.tsx'
// import { Designer } from './components/Designer.tsx'
// import { Viewer } from './components/Viewer.tsx'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <App />
  // <SimpleForm />
  // <Designer />
  // <Viewer />
  // </StrictMode>,
)
