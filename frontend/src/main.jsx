import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRoutes from './routes';
import './index.css';
import { SocketProvider } from '@/context/SocketContext'; // Socket context

ReactDOM.createRoot(document.getElementById('root')).render(
  <SocketProvider>
    <AppRoutes />
  </SocketProvider>
);
