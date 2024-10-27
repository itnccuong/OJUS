import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.css'
import './App.scss';

createRoot(document.getElementById('root')!).render(
    <App />
)
