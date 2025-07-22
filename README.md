# Sui NFT Loyalty System

Sui Loyalty DAppA decentralized application for minting unique NFT loyalty cards on the Sui blockchain.IntroductionThe Sui Loyalty DApp is a demonstration of how Non-Fungible Tokens (NFTs) can be leveraged to create a modern, transparent, and secure loyalty program. Instead of traditional points systems or physical cards, businesses can issue unique digital loyalty cards as NFTs on the Sui blockchain, providing immutable proof of ownership and benefits.This DApp allows for the minting of these loyalty NFTs to specific customer addresses, providing a seamless and verifiable way to manage customer loyalty in a decentralized environment.FeaturesSui Wallet Integration: Seamlessly connect your Sui wallet (e.g., Sui Wallet by Mysten Labs) to interact with the DApp.NFT Loyalty Card Minting: Mint new Loyalty NFT objects directly to a specified customer's Sui address on the Testnet.Enhanced Security via Transaction Simulation: (This is your newly implemented feature!)Before executing an actual minting transaction, users can simulate the transaction.The simulation provides a detailed preview of estimated gas costs (computation and storage) and transaction effects (e.g., objects created, mutated).This feature enhances user trust and security by preventing "blind signing" and allowing users to verify transaction outcomes before committing on-chain.Move Contract Interaction: Directly interacts with a custom loyalty_card Move module deployed on the Sui Testnet.Technologies UsedSui Blockchain: The underlying decentralized ledger.Move Language: For the smart contract (loyalty_card module) deployed on Sui.React: Frontend JavaScript library for building the user interface.Vite: Fast frontend build tool for development.@mysten/dapp-kit: Sui's official React hooks and components for DApp development.@mysten/sui: The core Sui TypeScript SDK for interacting with the Sui blockchain.Getting StartedFollow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.PrerequisitesNode.js (v18 or higher recommended)npm (Node Package Manager)A Sui Wallet browser extension (e.g., Sui Wallet by Mysten Labs) configured for Sui Testnet.Your loyalty_card Move contract deployed to Sui Testnet. (You will need its Package ID).InstallationClone the repository:git clone https://github.com/Dev4057/Sui-Workshop.git
cd Sui-Workshop/sui-loyalty-app # Assuming your DApp is in this subfolder

Install NPM dependencies:It's crucial to perform a clean install to avoid dependency conflicts.rm -rf node_modules
rm package-lock.json
npm install

Running the DAppStart the development server:npm run dev

The DApp will typically open in your browser at http://localhost:5173 (or a similar port).UsageConnect Your Wallet:Open the DApp in your browser.Click the "Connect" button and connect your Sui Wallet (ensure it's set to Sui Testnet).Enter Package ID:In the "Package ID" field, enter the ID of your deployed loyalty_card Move package on Sui Testnet.(Example ID: 0xea435ab4c0e16af509f363e18298fd67d813ea463f53a39eca1e7cf36ead35d8 - Verify this is your actual deployed ID)Enter Customer Wallet Address:In the "Customer Wallet Address" field, enter the Sui address of the recipient for the loyalty NFT. This can be your own connected wallet address for testing.Simulate Transaction:Click the "Simulate Transaction" button.The DApp will perform an off-chain simulation. If successful, you will see a "Transaction simulated successfully!" alert and a "Simulation Results" section displaying estimated gas costs and transaction effects (e.g., "Objects Created: 1").(Note: For simulation, the DApp temporarily uses your connected wallet's address as the customer address and a default image URL, as these are common points of failure in dry-run RPCs.)Confirm & Mint NFT:After a successful simulation, the "Confirm & Mint NFT" button will become active.Click this button to send the actual minting transaction to your wallet for approval.Approve the transaction in your Sui Wallet.Upon successful minting, you'll receive a confirmation. You can then check your Sui Wallet or the Sui Testnet Explorer to see the newly minted Loyalty NFT.Move Contract DetailsThe DApp interacts with a Move module named loyalty_card within a package. The key function is mint_loyalty, which takes a customer_id: address and an image_url: String to create and transfer a new Loyalty NFT object.module loyalty_card::loyalty_card {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::package::{Self};
    use sui::transfer;
    use std::string::{String, utf8};

    public struct Loyalty has key, store {
        id: UID,
        customer_id: address,
        image_url: String
    }

    public fun mint_loyalty(customer_id: address, image_url: String, ctx: &mut TxContext) {
        let loyalty = Loyalty {
            id: object::new(ctx),
            customer_id,
            image_url
        };
        transfer::transfer(loyalty, customer_id);
    }
    // ... (other parts of your contract like AdminCap, init function)
}

Known Issues / Troubleshooting"Simulation failed: Invalid params": If this error persists after following the usage steps, ensure:Your packageId is absolutely correct and deployed on Sui Testnet.Your connected wallet has sufficient Testnet SUI for gas.You have performed a clean npm install and restarted your editor.Browser Extension Conflicts: If the DApp doesn't load or shows cryptic errors, try running it in Chrome's Incognito mode (remember to enable your Sui Wallet extension for Incognito via chrome://extensions).Future EnhancementsDisplaying minted NFTs directly within the DApp.Adding more attributes to the Loyalty NFT (e.g., loyalty points, tier level).Implementing admin functionalities (e.g., pausing minting, burning NFTs).Integrating with a backend for managing loyalty benefits.LicenseThis project is licensed under the MIT License - see the LICENSE file for details.AcknowledgementsThe Sui Blockchain team for their excellent SDK and documentation.The dapp-kit library for simplifying DApp development.
