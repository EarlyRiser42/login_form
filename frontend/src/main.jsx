import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HashRouter as Router } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { QueryClient, QueryClientProvider } from 'react-query';
import { CookiesProvider } from 'react-cookie';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CookiesProvider>
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <Router>
            <App />
          </Router>
        </RecoilRoot>
      </QueryClientProvider>
    </CookiesProvider>
  </React.StrictMode>,
);
