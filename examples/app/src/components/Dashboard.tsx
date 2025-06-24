import React from "react";
import { Link } from "react-router-dom";

interface DashboardProps {
  walletResult: any;
}

export const Dashboard: React.FC<DashboardProps> = ({ walletResult }) => {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Welcome to Portkey</h2>
        <p>Your secure, passkey-powered multi-chain wallet</p>
      </div>

      {walletResult ? (
        <div className="wallet-status">
          <div className="status-card success">
            <h3>✅ Wallet Connected</h3>
            <div className="wallet-info">
              <div className="wallet-addresses">
                {walletResult.eth && (
                  <div className="address-item">
                    <span className="chain-label">🟦 Ethereum:</span>
                    <span className="address">
                      {walletResult.eth.publicAddress}
                    </span>
                  </div>
                )}
                {walletResult.solana && (
                  <div className="address-item">
                    <span className="chain-label">🟣 Solana:</span>
                    <span className="address">
                      {walletResult.solana.publicAddress}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <Link to="/sign" className="primary-button">
              Sign Transaction
            </Link>
          </div>
        </div>
      ) : (
        <div className="wallet-status">
          <div className="status-card">
            <h3>🔓 No Wallet Connected</h3>
            <p>Create a secure wallet to get started</p>
            <Link to="/create" className="primary-button">
              Create Wallet
            </Link>
          </div>
        </div>
      )}

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">🔐</div>
          <h4>Passkey Security</h4>
          <p>No seed phrases to remember. Your device is your key.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🌐</div>
          <h4>Multi-Chain</h4>
          <p>Support for Ethereum, Solana, and more blockchains.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h4>Fast & Secure</h4>
          <p>Sign transactions quickly with biometric authentication.</p>
        </div>
      </div>
    </div>
  );
};
