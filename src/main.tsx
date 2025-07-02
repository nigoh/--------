import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { ThemeInitScript } from './contexts/ThemeContext'
import { LogProvider } from './logging'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* MUI v7のカラースキーム初期化スクリプト */}
    <ThemeInitScript />
    <LogProvider>
      <App />
    </LogProvider>
  </React.StrictMode>
);
