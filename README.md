
# 🪪 Sui Loyalty DApp

A decentralized application for minting NFT-based loyalty cards on the [Sui Blockchain](https://sui.io). This DApp demonstrates how businesses can use blockchain technology to issue immutable, secure, and unique digital loyalty cards.

---

## 📌 Introduction

The Sui Loyalty DApp is designed for organizations to issue **NFT Loyalty Cards** to users, leveraging the **Sui Testnet** and a custom **Move smart contract**. It features wallet integration, transaction simulation, and real-time feedback for secure minting.

---

## 🚀 Features

- 🔐 **Sui Wallet Integration** — Connect with the official Sui Wallet browser extension.
- 🖼️ **NFT Minting** — Issue loyalty card NFTs directly to any valid Sui address.
- 🔍 **Transaction Simulation** — Preview estimated gas and transaction effects using `devInspectTransactionBlock`.
- 📦 **Move Smart Contract Integration** — Interact with the deployed `loyalty_card` module for minting NFTs.

---

## 🛠 Tech Stack

| Tech        | Description                           |
|-------------|---------------------------------------|
| Sui Blockchain | Layer 1 blockchain used for NFT storage |
| Move Language | Smart contract development          |
| React.js     | Frontend framework                   |
| TypeScript   | App logic and API interactions       |
| Sui.js       | SDK for wallet & blockchain APIs     |
| Tailwind CSS | Styling (optional but supported)     |

---

## 📋 Prerequisites

- Node.js & npm
- Sui Wallet extension installed in browser
- Access to deployed Move package ID
- (Optional) Sui CLI configured with Testnet

---

## 🔧 Installation & Running Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/sui-loyalty-dapp.git
   cd sui-loyalty-dapp
````

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory:

   ```env
   VITE_PACKAGE_ID=your_package_id_here
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. Visit the app at: `http://localhost:5173`

---

## 📁 Project Structure

```
src/
├── components/        # Reusable UI components
├── pages/             # Page-specific views (e.g., MintPage)
├── utils/             # Wallet helpers, transaction builders
├── App.tsx            # Main app entry
├── main.tsx           # React root mount
└── index.css          # Tailwind or global styles
```

---

## 💎 NFT Minting Flow

1. Connect your Sui Wallet.
2. Input the recipient's Sui address.
3. Click **Simulate Transaction** to preview:

   * Expected gas usage
   * Object creation/mutation
4. Click **Mint Loyalty Card**.
5. Wallet prompts user to sign and execute.
6. Display digest and object ID after confirmation.

---

## 🧪 Transaction Simulation

This app uses:

```ts
devInspectTransactionBlock()
```

To provide:

* Gas estimation
* Object effects (created, mutated, deleted)
* Dry-run security checks before signing

---

## ✅ Example .env File

```
VITE_PACKAGE_ID=0x123abc456def7890abcdef0123456789
```

Make sure the package ID matches your deployed Move contract on Sui Testnet.

---

## ⚠️ Notes

* This app only works on the **Sui Testnet**.
* Make sure the wallet is on **Testnet** and has enough SUI tokens.
* Mint logic is defined in the `mint_loyalty_card` function in your Move module `loyalty_card`.
