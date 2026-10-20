import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css';
import { AuthProvider } from './authContext.jsx'
import ProjectRoutes from './Routes.jsx';
import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider, BaseStyles } from '@primer/react'

import axios from "axios";

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

if (import.meta.env.DEV) {
  const originalError = console.error;
  console.error = (...args) => {
    const text = args.map((a) => String(a)).join(" ");
    if (text.includes("`key` is not a prop")) return;
    originalError(...args);
  };
}

createRoot(document.getElementById('root')).render(
  <ThemeProvider colorMode="dark">
    <BaseStyles>
      <AuthProvider>
        <Router>
          <ProjectRoutes />
        </Router>
      </AuthProvider>
    </BaseStyles>
  </ThemeProvider>,
)