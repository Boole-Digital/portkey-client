import React from "react";
import { PortkeyButton } from "react-background-iframe";

export const WalletCreation: React.FC = () => {
  return (
    <div className="wallet-creation">
      <div className="card">
        <div className="card-header">
          <h2>Create Your Secure Wallet</h2>
          <p>
            Generate a new wallet secured by your device's biometric
            authentication
          </p>
        </div>
        <div className="card-body">
          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-icon">🔐</span>
              <span>Secured by passkey technology</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🌐</span>
              <span>Multi-chain support (Ethereum & Solana)</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔒</span>
              <span>No seed phrases to remember</span>
            </div>
          </div>
          <div className="button-container">
            <PortkeyButton
              label="Create Secure Wallet"
              buttonType="signup"
              origin="http://localhost:3002"
              command="signup"
              data={{ pubkey: "abc123", skipVerification: true }}
              hide={false}
              className="create-wallet-btn"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
