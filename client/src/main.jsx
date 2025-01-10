import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/global.css'
import App from './App.jsx'
import "bootstrap/dist/css/bootstrap.min.css";
import SocketProvider from './context/SocketContext.jsx';
import { ToastContainer } from 'react-toastify';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SocketProvider>
      <App />
      <ToastContainer theme='dark' />
    </SocketProvider>
  </StrictMode>,
)
