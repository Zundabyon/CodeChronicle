import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { QuestionBootstrap } from './QuestionBootstrap';
import './base.css';
import './style.css';
import './battle.css';
import './titleScreen.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {import.meta.env.MODE === 'staging' ? <QuestionBootstrap /> : <App />}
  </React.StrictMode>,
);
