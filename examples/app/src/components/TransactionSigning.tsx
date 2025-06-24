import React from "react";
import { PortkeyButton } from "react-background-iframe";

interface TransactionStatus {
  txHash?: string;
  status:
    | "idle"
    | "signing"
    | "signed"
    | "broadcasting"
    | "pending"
    | "confirmed"
    | "failed";
  error?: string;
  signedTx?: string;
}

interface TransactionSigningProps {
  walletResult: any;
  solTx: string;
  ethTx: string;
  ethTxObject: any; // The actual transaction object
  ethTxStatus: TransactionStatus;
  onBroadcastEthTx: () => void;
}

export const TransactionSigning: React.FC<TransactionSigningProps> = ({
  walletResult,
  solTx,
  ethTx,
  ethTxObject,
  ethTxStatus,
  onBroadcastEthTx,
}) => {
  const renderTransactionStatus = (status: TransactionStatus) => {
    if (status.status === "idle") return null;

    const getStatusColor = () => {
      switch (status.status) {
        case "signed":
          return "#10b981";
        case "broadcasting":
          return "#f59e0b";
        case "pending":
          return "#3b82f6";
        case "confirmed":
          return "#059669";
        case "failed":
          return "#ef4444";
        default:
          return "#64748b";
      }
    };

    const getStatusText = () => {
      switch (status.status) {
        case "signed":
          return "✅ Transaction Signed - Ready to Broadcast";
        case "broadcasting":
          return "📡 Broadcasting to Base Network...";
        case "pending":
          return "⏳ Transaction Pending Confirmation...";
        case "confirmed":
          return "🎉 Transaction Confirmed!";
        case "failed":
          return "❌ Transaction Failed";
        default:
          return "Unknown Status";
      }
    };

    return (
      <div
        className="transaction-status"
        style={{
          marginTop: "1rem",
          padding: "1rem",
          borderRadius: "0.5rem",
          backgroundColor: `${getStatusColor()}20`,
          border: `1px solid ${getStatusColor()}`,
          color: getStatusColor(),
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>
          {getStatusText()}
        </div>

        {status.txHash && (
          <div style={{ fontSize: "0.9rem" }}>
            <strong>Transaction Hash:</strong>
            <br />
            <a
              href={`https://basescan.org/tx/${status.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: getStatusColor(), textDecoration: "underline" }}
            >
              {status.txHash}
            </a>
          </div>
        )}

        {status.error && (
          <div style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
            <strong>Error:</strong> {status.error}
          </div>
        )}

        {status.status === "signed" && (
          <button
            onClick={onBroadcastEthTx}
            style={{
              marginTop: "1rem",
              padding: "0.75rem 1.5rem",
              backgroundColor: getStatusColor(),
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            🚀 Broadcast Transaction
          </button>
        )}
      </div>
    );
  };

  const renderSignButton = (
    type: string,
    command: string,
    label: string,
    tx: string,
    chain: "ethereum" | "solana",
    description: string
  ) => {
    const walletData =
      type === "signSolTx" ? walletResult?.solana : walletResult?.eth;
    const pubkey = walletResult?.pubkey;

    if (!walletData || !pubkey) {
      return (
        <div className="warning-message">
          <span className="warning-icon">⚠️</span>
          <span>Please create a wallet first to sign transactions</span>
        </div>
      );
    }

    if (!tx && chain === "ethereum") {
      return (
        <div className="warning-message">
          <span className="warning-icon">⏳</span>
          <span>Loading transaction data from Base network...</span>
        </div>
      );
    }

    return (
      <div className="transaction-card">
        <h3>
          {chain === "ethereum" ? "🟦" : "🟣"}{" "}
          {chain.charAt(0).toUpperCase() + chain.slice(1)} Transaction
        </h3>
        <p>{description}</p>
        <div className="transaction-details">
          <div className="detail-item">
            <span className="detail-label">Wallet Address:</span>
            <span className="detail-value">{walletData.publicAddress}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">From:</span>
            <span className="detail-value">{walletData.publicAddress}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">To:</span>
            <span className="detail-value">{walletData.publicAddress}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Network:</span>
            <span className="detail-value">
              {chain === "ethereum" ? "Base Mainnet" : "Solana Devnet"}
            </span>
          </div>
          {chain === "ethereum" && (
            <div className="detail-item">
              <span className="detail-label">Amount:</span>
              <span className="detail-value">0.00001 ETH</span>
            </div>
          )}
          <div className="detail-item">
            <span className="detail-label">Transaction Type:</span>
            <span className="detail-value">Self-Transfer</span>
          </div>
        </div>

        {tx && (
          <PortkeyButton
            label={label}
            buttonType={type}
            origin="http://localhost:3002"
            command={command}
            data={{
              pubkey,
              wid: "static-wid",
              address: walletData.publicAddress,
              cipherText: walletData.cipherText,
              iv: walletData.iv,
              salt: walletData.salt,
              chain: type === "signSolTx" ? "solana" : "evm",
              transaction:
                chain === "ethereum" && ethTxObject
                  ? ethTxObject
                  : {
                      to: walletData.publicAddress, // Self-transfer for Solana
                      data: tx,
                    },
            }}
            hide={false}
            className="sign-transaction-btn"
          />
        )}

        {chain === "ethereum" && renderTransactionStatus(ethTxStatus)}
      </div>
    );
  };

  return (
    <div className="transaction-signing">
      <div className="page-header">
        <h2>Sign Transactions</h2>
        <p>Securely sign blockchain transactions with your Portkey wallet</p>
      </div>

      <div className="transactions-grid">
        {renderSignButton(
          "signSolTx",
          "signSolanaTransaction",
          "Sign Solana Transaction",
          solTx,
          "solana",
          "Transfer SOL tokens to yourself on Solana devnet"
        )}

        {renderSignButton(
          "signEthTx",
          "signEthereumTransaction",
          "Sign Base ETH Transaction",
          ethTx,
          "ethereum",
          "Send 0.00001 ETH to yourself on Base mainnet"
        )}
      </div>
    </div>
  );
};
