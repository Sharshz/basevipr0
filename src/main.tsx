import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Web3Provider } from './components/Web3Provider.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { FarcasterProvider } from './context/FarcasterContext.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <Web3Provider>
        <FarcasterProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </FarcasterProvider>
      </Web3Provider>
    </ErrorBoundary>
  </StrictMode>,
);
