# 🌟 StellaRep: The Cross-Chain Reputation Protocol

> **The Trust Layer for the Decentralized Internet**

---

## 👥 Team Information

**Team Number:** Team 6

**Team Members:**

- Eren Şen, erensenn15@gmail.com
- Yiğit Güneş, yigitgunes26@gmail.com

**Project Description:**
StellaRep is a pioneering cross-chain reputation protocol that bridges the gap between the Stellar network and the broader DeFi ecosystem (EVM Compatible Chains). By aggregating on-chain activity from multiple blockchains into a unified, immutable trust score stored on Soroban smart contracts, StellaRep enables under-collateralized lending, trusted marketplaces, and Sybil-resistant governance without relying on centralized credit bureaus.

---

## 📖 Table of Contents

1. [The Problem & Solution](#-the-problem--solution)
2. [System Architecture](#-system-architecture)
3. [Technology Stack](#-technology-stack)
4. [Key Features](#-key-features)
5. [Reputation Algorithm](#-reputation-algorithm)
6. [Installation & Setup](#-installation--setup)
7. [API Documentation](#-api-documentation)
8. [Future Roadmap](#-future-roadmap)

---

## 🎯 The Problem & Solution

### The Problem: The "Trust Gap"

In traditional finance, credit bureaus (like FICO) facilitate trust. In DeFi, a wallet with $1M history looks identical to a brand-new scammer's wallet. This "anonymity tax" forces protocols to demand massive over-collateralization (often 150%+) and prevents real-world adoption.

### The Solution: StellaRep

StellaRep creates a **portable, decentralized credit score (0-1000)**.

- **Cross-Chain:** We don't just look at Stellar; we analyze Cross-Chain history (Ethereum, etc.) to build a holistic profile.
- **Immutable:** Scores are not just calculated; they are verified and stored on-chain using **Soroban**.
- **Composable:** Other dApps can query the StellaRep smart contract to gate access or offer better rates.

---

## 🏗️ System Architecture

StellaRep employs a 3-tier architecture designed for security, scalability, and performance.

```text
graph TD
    User[User Wallet<br/>Freighter/Meta] <--> Frontend[React Frontend<br/>Vite + UI]
    Frontend <--> Backend[Spring Boot Backend<br/>REST API Engine]
    
    Backend <--> DB[(PostgreSQL Database<br/>Off-Chain Index)]
    
    Backend <--> Stellar[Stellar Chain<br/>Horizon API]
    Stellar <--> Soroban[Soroban Contract<br/>On-Chain Data]
    
    Backend --> Eth[Ethereum API<br/>Etherscan]
    
    classDef box fill:#1e1e1e,stroke:#9370db,stroke-width:2px,color:#fff;
    class User,Frontend,Backend,Stellar,Soroban,Eth,DB box;
```

1.  **Data Aggregation Layer (Backend):** The Java Spring Boot engine connects to Stellar Horizon and Etherscan APIs to fetch raw transaction history, asset holdings, and account age.
2.  **Computation Layer (Service):** Our proprietary weighted algorithm normalizes data from different chains into a unified standardized score.
3.  **Verification Layer (Smart Contract):** The final score is signed and committed to the Stellar network via a Soroban smart contract, making it publicly verifiable and immutable.

---

## 💻 Technology Stack

### ⚡ Smart Contract & Blockchain

- **Network:** Stellar (Testnet/Mainnet)
- **Contract:** Rust (Soroban SDK)
- **Wallet Integration:** Freighter (Stellar), Metamask (EVM Chains)

### 🔙 Backend API

- **Language:** Java 17
- **Framework:** Spring Boot 3.2.0 (Web, JPA, Validation)
- **Database:** PostgreSQL 14+
- **External APIs:** Stellar Horizon, Etherscan
- **Build Tool:** Maven 3.8+

### 🎨 Frontend

- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS
- **State Management:** React Hooks
- **Animations:** Framer Motion for high-end fintech feel

---

## 🚀 Key Features

### 1. Cross-Chain Identity Bridging

Links a user's Stellar identity with their Cross-Chain identity. High reputation on external networks (e.g., long-standing DeFi usage) boosts the Stellar reputation, solving the "cold start" problem for new Stellar users.

### 2. Soroban On-Chain Storage

Unlike web2 reputation systems, StellaRep writes the score to the blockchain. This means:

- **Immutability:** Scores cannot be tampered with.
- **Interoperability:** Other Soroban contracts can read the score directly on-chain.

### 3. Dynamic Scoring Engine

Real-time calculation that adapts to user behavior.

- **Asset Diversity:** Rewards holding multiple meaningful assets.
- **Longevity:** Rewards long-term holding ("Diamond Hands").
- **Activity:** Rewards consistent, non-spam transaction volume.

---

## 🧮 Reputation Algorithm

The **StellaRep Score (0-1000)** is calculated using a weighted sum model:

| Component               | Weight | Metrics Analyzed                                             | Max Points |
| ----------------------- | ------ | ------------------------------------------------------------ | ---------- |
| **Stellar History**     | 40%    | Account Age (2/day), Tx Count, XLM Balance, Asset Trustlines | 400        |
| **Cross-Chain History** | 40%    | Asset Balance (ETH, etc.), Account Age, Tx Volume, Gas Usage | 400        |
| **Social/Bonus**        | 20%    | "Power User" Status, Cross-chain Linkage Verification        | 200        |

> _Note: The algorithm includes sybil-resistance measures to prevent spam transactions from artificially inflating scores._

---

## 🛠 Installation & Setup

### Prerequisites

- Java 17+
- Maven 3.8+
- Node.js 18+
- PostgreSQL 14+
- Rust & Soroban CLI (version 21.0.1+)

### 1. Database Setup

```bash
# Option A: Using Docker (Recommended)
docker-compose up -d postgres

# Option B: Manual Setup
psql -c "CREATE DATABASE stellarep;"
```

### 2. Backend Setup

1.  Navigate to `backend/` directory.
2.  Configure `src/main/resources/application.yml` if not using Docker defaults.
3.  Set required Environment Variables:
    ```bash
    export ETHERSCAN_API_KEY="your_key_here"
    # Optional if using defaults:
    # export DB_USERNAME="postgres"
    # export DB_PASSWORD="postgres"
    ```
4.  Run the application:
    ```bash
    mvn spring-boot:run
    ```
    _Server starts at `http://localhost:8080`_

### 3. Frontend Setup

1.  Navigate to `frontend/` directory.
2.  Install dependencies and start:
    ```bash
    npm install
    npm run dev
    ```
    _Frontend opens at `http://localhost:3000`_

### 4. Smart Contract Setup (Optional)

To deploy your own instance of the reputation contract:

```bash
cd smart-contract
soroban contract build
soroban contract deploy --wasm target/wasm32-unknown-unknown/release/stellarep_contract.wasm --source-account YOUR_ADMIN_KEY --network testnet
```

### 🐛 Troubleshooting

- **Backend won't start?** Check if PostgreSQL is running (`docker ps`) and port 5432 is accessible. Ensure Java 17 is your active Java version (`java -version`).
- **No Reputation Score?** Ensure your `ETHERSCAN_API_KEY` is valid. Free tier keys have rate limits.
- **Freighter Wallet Issues?** Refresh the page after unlocking Freighter. Ensure you are on Testnet if testing contract interactions.

---

## 📝 API Documentation

### Calculate Reputation

`POST /api/reputation/calculate`

**Request:**

```json
{
  "stellarAddress": "GB...",
  "ethereumAddress": "0x..."
}
```

**Response:**

```json
{
  "totalScore": 750,
  "breakdown": {
    "stellarScore": 350,
    "ethereumScore": 300,
    "socialScore": 100
  },
  "riskLevel": "LOW"
}
```

---

## 🔮 Future Roadmap

- **Q1 2026:** Integration with **Solana** and **Polygon** for multi-chain scoring.
- **Q2 2026:** Launch **Reputation Marketplace** where high-score users can access exclusive DeFi rates.
- **Q3 2026:** Decentralized Identity (DID) integration for privacy-preserving proofs.

---

## 🏆 Hackathon Achievement

Built specifically for the **HackStellar Hackathon**.

- **Innovation:** First reputation protocol bridging Stellar & EVM Chains.
- **Completeness:** Fully functional full-stack application with blockchain integration.
- **Design:** Professional, responsive, and accessible UI.

---
