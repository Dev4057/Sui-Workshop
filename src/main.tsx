// src/main.tsx
// This file is the main entry point for your Vite React application.
// It sets up the React rendering, Sui Dapp Kit providers, and React Router.

import '@mysten/dapp-kit/dist/index.css'; // Import Dapp Kit's default styling
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react'; // Standard React import for JSX
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Import your main application component.
import App from './App';

// Initialize React Query client for data fetching and caching
const queryClient = new QueryClient();

// Define the Sui networks your DApp will connect to
const networks = {
  testnet: { url: getFullnodeUrl('testnet') }, // Sui Testnet fullnode URL
  mainnet: { url: getFullnodeUrl('mainnet') }, // Sui Mainnet fullnode URL
};

// Get the root DOM element where your React app will be mounted
const rootElement = document.getElementById('root');

// Create a React root and render your application
if (rootElement) { // Check if the root element exists to prevent errors
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      {/* Provide React Query client to the entire app */}
      <QueryClientProvider client={queryClient}>
        {/* Provide Sui client configuration to the Dapp Kit */}
        <SuiClientProvider networks={networks} defaultNetwork="testnet">
          {/* Provide wallet connection capabilities. No gas station URL for simple transactions. */}
          <WalletProvider>
            {/* Enable client-side routing for your React app */}
            <BrowserRouter>
              {/* Render your main application component */}
              <App />
            </BrowserRouter>
          </WalletProvider>
        </SuiClientProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
} else {
  console.error('Root element with ID "root" not found in the document.');
}