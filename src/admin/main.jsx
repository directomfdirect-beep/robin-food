import React from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/index.css';
import { AdminApp } from './AdminApp';

createRoot(document.getElementById('admin-root')).render(<AdminApp />);
