// src/App.tsx
// This file defines your main application component,
// responsible for the UI and direct transaction with the Sui blockchain.

import React, { useState } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import {
  useSignAndExecuteTransaction, // Hook for signing and executing Sui transactions
  ConnectButton,                // UI component for connecting Sui wallets
  useCurrentAccount             // Hook to get the currently connected Sui account
} from '@mysten/dapp-kit';
import './App.css'; // Import styling specific to this component

// Main application component
const App = () => {
  const currentAccount = useCurrentAccount(); // Get the active Sui wallet account
  const [loading, setLoading] = useState(false); // State to manage loading status during transactions
  const [packageId, setPackageId] = useState(''); // State to store the Sui package ID

  // Form states for minting a new loyalty card
  const [mintForm, setMintForm] = useState({
    customerId: '', // Sui address of the customer who will receive the NFT
    imageUrl: ''    // URL for the NFT image
  });

  // Hook from dapp-kit to get the function for signing and executing transactions
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  // Handler for form input changes
  const handleMintChange = (e) => {
    setMintForm({ ...mintForm, [e.target.name]: e.target.value });
  };

  // Asynchronous function to mint a new Loyalty NFT
  const mintLoyalty = async () => {
    // Check if a wallet is connected
    if (!currentAccount) {
      alert('Please connect your wallet to mint an NFT.');
      return;
    }

    // Basic validation for required fields
    if (!packageId.trim() || !mintForm.customerId.trim() || !mintForm.imageUrl.trim()) {
      alert('Please fill in all required fields (Package ID, Customer Address, Image URL).');
      return;
    }

    setLoading(true); // Set loading state to true

    try {
      const tx = new Transaction(); // Create a new Sui transaction object

      // Define the move call to mint a loyalty card
      // Target format: `package_id::module_name::function_name`
      tx.moveCall({
        target: `${packageId}::loyalty_card::mint_loyalty`, // Dynamic package ID
        arguments: [
          tx.pure.address(mintForm.customerId), // Pass customer Sui address as a pure argument
          tx.pure.string(mintForm.imageUrl)    // Pass image URL as a pure argument
        ]
      });

      // Sign and execute the transaction using the connected wallet
      // The user's wallet will prompt them to pay for gas fees.
      await signAndExecute({ transaction: tx });

      // Clear the form fields upon successful minting
      setMintForm({ customerId: '', imageUrl: '' });
      alert('NFT minted successfully!'); // Success message
    } catch (error) {
      console.error('Error minting loyalty card:', error);
      // Provide user-friendly error feedback
      alert(`Minting failed: ${error.message || 'An unknown error occurred.'}`);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="container">
      <h1>Mint Your NFT on SUI</h1>
      {/* Connect button from dapp-kit */}
      <ConnectButton />

      {/* Input for the Sui Package ID */}
      <div className="package-input">
        <label htmlFor="packageId">Package ID</label>
        <input
          id="packageId"
          type="text"
          value={packageId}
          onChange={(e) => setPackageId(e.target.value)}
          placeholder="Enter the deployed Sui Package ID (e.g., 0x...)"
          disabled={loading} // Disable input during loading
        />
      </div>

      {/* Section for Minting a Loyalty Card */}
      <section className="form-section">
        <h2>Mint New Loyalty NFT</h2>
        <label htmlFor="customerId">Customer Wallet Address</label>
        <input
          id="customerId"
          type="text"
          name="customerId"
          value={mintForm.customerId}
          onChange={handleMintChange}
          placeholder="Enter Customer's Sui Address (e.g., 0x...)"
          disabled={loading} // Disable input during loading
        />
        <label htmlFor="imageUrl">NFT Image URL</label>
        <input
          id="imageUrl"
          type="text"
          name="imageUrl"
          value={mintForm.imageUrl}
          onChange={handleMintChange}
          placeholder="Enter Image URL (e.g., https://example.com/nft.png or ipfs://Qm...)"
          disabled={loading} // Disable input during loading
        />

        {/* Mint Button: Directly triggers the transaction, user pays gas */}
        <button
          onClick={mintLoyalty}
          disabled={
            loading ||
            !packageId.trim() ||
            !mintForm.customerId.trim() ||
            !mintForm.imageUrl.trim()
          }
        >
          {loading ? 'Minting...' : 'Mint your NFT'}
        </button>
      </section>
    </div>
  );
};

export default App;