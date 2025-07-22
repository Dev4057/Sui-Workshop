// src/App.tsx
// This file defines your main application component,
// responsible for the UI and interaction with the Sui blockchain.

import React, { useState } from 'react';
import { Transaction } from '@mysten/sui/transactions'; // Transaction is an alias for TransactionBlock
import {
  useSignAndExecuteTransaction, // Hook for signing and executing Sui wallets
  ConnectButton,                // UI component for connecting Sui wallets
  useCurrentAccount,            // Hook to get the currently connected Sui account
  useSuiClient                  // Hook to get the Sui client instance for RPC calls
} from '@mysten/dapp-kit';
// IMPORTANT: Import the specific type for the dryRunTransactionBlock result
import type { DryRunTransactionBlockResponse } from '@mysten/sui/client';
// REMOVED: All imports related to 'bcs' (e.g., import { bcs } from '@mysten/sui/bcs'; or import getBcs from '@mysten/sui/bcs';)
// We will now rely on Transaction.serialize() directly.

import './App.css'; // Import styling specific to this component

// Main application component
const App = () => {
  const currentAccount = useCurrentAccount(); // Get the active Sui wallet account
  const suiClient = useSuiClient();           // Get the Sui client instance for direct RPC calls (like dryRun)
  const [loading, setLoading] = useState(false); // State to manage loading status during transactions
  const [packageId, setPackageId] = useState(''); // State to store the Sui package ID

  // Form states for minting a new loyalty card
  const [mintForm, setMintForm] = useState({
    customerId: '', // Sui address of the customer who will receive the NFT
    // imageUrl is no longer a user input, so it's removed from mintForm state
  });

  // State to store transaction simulation results for display
  // Typed with DryRunTransactionBlockResponse for TypeScript correctness
  const [simulationResult, setSimulationResult] = useState<DryRunTransactionBlockResponse | null>(null);
  // State to store the Transaction object after simulation, ready for actual execution
  // Typed with Transaction for TypeScript correctness
  const [transactionToExecute, setTransactionToExecute] = useState<Transaction | null>(null);

  // Hook from dapp-kit to get the function for signing and executing transactions
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  // Handler for form input changes (only for customerId now)
  const handleMintChange = (e) => {
    setMintForm({ ...mintForm, [e.target.name]: e.target.value });
    // Reset simulation results and transaction object if form fields change
    setSimulationResult(null);
    setTransactionToExecute(null);
  };

  /**
   * Function to simulate the transaction before actual execution.
   * This provides a preview of gas costs and effects, enhancing security and user trust.
   */
  const simulateLoyaltyMint = async () => {
    // Basic validation: ensure wallet is connected
    if (!currentAccount) {
      alert('Please connect your wallet to simulate the transaction.');
      return;
    }
    // Basic validation: ensure all required form fields are filled (only Package ID and Customer ID now)
    if (!packageId.trim() || !mintForm.customerId.trim()) {
      alert('Please fill in all required fields (Package ID, Customer Address) before simulating.');
      return;
    }

    setLoading(true); // Set loading state to true
    setSimulationResult(null); // Clear any previous simulation results
    setTransactionToExecute(null); // Clear any previously stored transaction

    try {
      // Create a new Sui Transaction object
      const tx = new Transaction();

      // Explicitly set the sender on the Transaction object for simulation
      tx.setSender(currentAccount.address);

      // Define the move call to mint a loyalty card
      // Target format: `package_id::module_name::function_name`
      tx.moveCall({
        target: `${packageId}::loyalty_card::mint_loyalty`, // Dynamic package ID provided by user
        arguments: [
          // For simulation, use the connected wallet's address as customerId
          tx.pure.address(currentAccount.address),
          // IMPORTANT: Sending a default string for image_url, as the Move contract expects it.
          tx.pure.string("default_image_url_for_simulation") // Default string for image_url
        ]
      });

      // --- START: Added Logging for Debugging ---
      console.log('--- SIMULATION DEBUGGING LOGS ---');
      console.log('Package ID (from input):', packageId);
      console.log('Customer ID (for simulation):', currentAccount.address);
      console.log('Image URL (for simulation):', "default_image_url_for_simulation");
      console.log('Sender for dryRun (from currentAccount):', currentAccount.address);
      console.log('Transaction object before build:', tx); // Log the raw transaction object
      // --- END: Added Logging for Debugging ---

      // CORRECTED: Build the transaction block and use its output directly.
      // The .build() method itself returns the serialized transaction block (Uint8Array or base64 string).
      const serializedTxBlock = await tx.build({ client: suiClient }); // <--- CORRECTED: Use await and pass client

      console.log('Serialized Transaction Block (for dryRun):', serializedTxBlock); // Log the serialized string

      // Perform the dry run (simulation) of the transaction block
      const result = await suiClient.dryRunTransactionBlock({
        transactionBlock: serializedTxBlock, // Using the serialized built transaction block directly
        sender: currentAccount.address // Keep sender here as well, for redundancy/completeness
      });

      console.log('Simulation Result:', result); // Log the full simulation result to console for debugging
      setSimulationResult(result); // Store the simulation result in state
      setTransactionToExecute(tx); // Store the original transaction object for actual execution later

      // Provide user feedback based on simulation outcome
      if (result.error) {
        alert(`Simulation failed: ${result.error.message}`);
      } else {
        alert('Transaction simulated successfully! Review details below before minting.');
      }

    } catch (error) {
      console.error('Error simulating transaction:', error); // Log detailed error to console
      alert(`Simulation failed: ${error.message || 'An unknown error occurred during simulation.'}`);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  /**
   * Function to execute the actual minting transaction after a successful simulation.
   * The transaction object is taken from the pre-simulated `transactionToExecute` state.
   */
  const mintLoyalty = async () => {
    // Ensure wallet is connected and a transaction has been successfully simulated
    if (!currentAccount || !transactionToExecute) {
      alert('Please connect your wallet and simulate the transaction first.');
      return;
    }
    setLoading(true); // Set loading state to true

    try {
      // For actual execution, use the customerId from the form, as the target recipient might not be the sender
      const txForExecution = new Transaction();
      txForExecution.moveCall({
        target: `${packageId}::loyalty_card::mint_loyalty`,
        arguments: [
          txForExecution.pure.address(mintForm.customerId), // ORIGINAL CUSTOMER ID FROM FORM FOR ACTUAL MINT
          // IMPORTANT: Sending a default string for image_url, as the Move contract expects it.
          txForExecution.pure.string("default_image_url_for_actual_mint") // Default string for image_url
        ]
      });

      // Sign and execute the transaction using the connected wallet
      await signAndExecute({ transaction: txForExecution }); // Use txForExecution here

      // Reset form and simulation states upon successful minting
      setMintForm({ customerId: '' }); // Reset only customerId
      setSimulationResult(null);
      setTransactionToExecute(null);
      alert('NFT minted successfully!'); // Success message
    } catch (error) {
      console.error('Error minting loyalty card:', error); // Log detailed error to console
      alert(`Minting failed: ${error.message || 'An unknown error occurred during minting.'}`);
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
          disabled={loading} // Disable input during loading to prevent changes mid-process
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
        {/* UI Hint for Simulation (updated) */}
        <p style={{ fontSize: '0.8em', color: '#aaa', marginTop: '-0.5rem', marginBottom: '0.5rem' }}>
          (Note: For simulation, the customer address will use your connected wallet's address. Image URL is defaulted.)
        </p>

        {/* Removed the Image URL input field */}
        {/* Original Image URL input was here */}

        {/* Button to simulate the transaction */}
        <button
          onClick={simulateLoyaltyMint}
          disabled={
            loading ||
            !packageId.trim() ||
            !mintForm.customerId.trim() // Only check customerId now
          }
          style={{ marginBottom: '1rem' }} // Add some spacing for better UI
        >
          {loading && !simulationResult ? 'Simulating...' : 'Simulate Transaction'}
        </button>

        {/* Display area for transaction simulation results */}
        {simulationResult && (
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem',
            border: simulationResult.error ? '1px solid #ff6f61' : '1px solid #0077cc' // Red border for error, blue for success
          }}>
            <h3>Simulation Results:</h3>
            {simulationResult.error ? (
              // Display error message if simulation failed
              <p style={{ color: '#ff6f61' }}>Error: {simulationResult.error.message}</p>
            ) : (
              // Display key simulation details if successful
              <>
                <p>Gas Used: {simulationResult.effects?.gasUsed?.computationCost} (computation), {simulationResult.effects?.gasUsed?.storageCost} (storage)</p>
                <p>Status: {simulationResult.effects?.status?.status}</p>
                {simulationResult.effects?.created && simulationResult.effects.created.length > 0 && (
                  <p>Objects Created: {simulationResult.effects.created.length}</p>
                )}
                {/* Expandable section to view full raw effects for advanced debugging */}
                <details>
                  <summary>View Full Effects</summary>
                  <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: '0.8em' }}>
                    {JSON.stringify(simulationResult.effects, null, 2)}
                  </pre>
                </details>
              </>
            )}
          </div>
        )}

        {/* Button to confirm and mint the NFT (enabled only after successful simulation) */}
        <button
          onClick={mintLoyalty}
          disabled={
            loading ||
            !transactionToExecute || // Disable if no transaction has been successfully simulated
            simulationResult?.error  // Disable if simulation resulted in an error
          }
        >
          {loading && transactionToExecute ? 'Minting...' : 'Confirm & Mint NFT'}
        </button>
      </section>
    </div>
  );
};

export default App;
