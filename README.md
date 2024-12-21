# NFT Minting Application

## Overview
This is a simple frontend application that allows users to connect their MetaMask wallet and mint an NFT using a smart contract deployed on the Sepolia test network.

## Technology Stack
- **React** for frontend
- **Node.js** for backend
- **ethers.js** for blockchain interactions
- **Smart Contract** deployed on Sepolia Testnet

## Setup Instructions

### Prerequisites
- Node.js and npm installed
- MetaMask browser extension installed and set up

### Installation

#### Cloning the Repository
1. Clone the repository:
    ```sh
    git clone https://github.com/terymoney/Kuverse-Test.git
    ```

2. Navigate to the project directory:
    ```sh
    cd Kuverse-Test
    ```

#### Installing Dependencies

**Frontend:**
1. Navigate to the frontend directory:
    ```sh
    cd frontend
    ```
2. Install frontend dependencies:
    ```sh
    npm install
    ```

**Backend:**
1. Navigate to the backend directory:
    ```sh
    cd backend
    ```
2. Install backend dependencies:
    ```sh
    npm install
    ```

### Environment Variables
Create a `.env` file in the root of your project and add the following variables:

**Frontend `.env` file**:
```env
GENERATE_SOURCEMAP=false
REACT_APP_NETWORK="Sepolia Testnet"
REACT_APP_NETWORK_ID=11155111
REACT_APP_COIN=ETH
REACT_APP_NODE="https://rpc.sepolia.org"
REACT_APP_NODE_1="https://rpc.sepolia.org"
REACT_APP_NODE_2="https://rpc.sepolia.org"
REACT_APP_NODE_3="https://rpc.sepolia.org"
REACT_APP_BLOCK_EXPLORER="https://explorer.sepolia.etherscan.io"
REACT_APP_BASE_URL="https://test.kuverse.app"

**start server**
cd backend
npm start

# cd frontend
npm start

Kuverse-Test
