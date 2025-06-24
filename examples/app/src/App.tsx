import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { WalletCreation } from "./components/WalletCreation";
import { TransactionSigning } from "./components/TransactionSigning";
import { Dashboard } from "./components/Dashboard";
import { createUnsignedSolanaTx } from "./utils/solana";
import {
  createBaseETHTransfer,
  broadcastTransaction,
  waitForTransactionConfirmation,
} from "./utils/ethereum";
import "./App.css";

interface WalletResult {
  pubkey: string;
  eth?: {
    publicAddress: string;
    cipherText: string;
    iv: string;
    salt: string;
  };
  solana?: {
    publicAddress: string;
    cipherText: string;
    iv: string;
    salt: string;
  };
}

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

const App = () => {
  const [walletResult, setWalletResult] = useState<WalletResult | null>(null);
  const [iframeWindow, setIframeWindow] = useState<Window | null>(null);
  const [solTx, setSolTx] = useState<string>("");
  const [ethTx, setEthTx] = useState<string>("");
  const [ethTxObject, setEthTxObject] = useState<any>(null);
  const [ethTxStatus, setEthTxStatus] = useState<TransactionStatus>({
    status: "idle",
  });
  const location = useLocation();

  useEffect(() => {
    const checkIframe = () => {
      const iframe = document.getElementById(
        "portkey"
      ) as HTMLIFrameElement | null;
      if (iframe?.contentWindow) {
        setIframeWindow(iframe.contentWindow);
      }
    };

    checkIframe();
    const retry = setInterval(() => {
      if (!iframeWindow) checkIframe();
    }, 500);
    const stopRetry = setTimeout(() => clearInterval(retry), 3000);

    return () => {
      clearInterval(retry);
      clearTimeout(stopRetry);
    };
  }, [iframeWindow]);

  // Create Solana transaction when wallet is ready
  useEffect(() => {
    const pubkey = walletResult?.solana?.publicAddress;
    if (!pubkey) return;

    createUnsignedSolanaTx(pubkey, pubkey)
      .then(setSolTx)
      .catch((err) => {
        console.error("Failed to create unsigned Solana tx", err);
        setSolTx("");
      });
  }, [walletResult?.solana?.publicAddress]);

  // Create Ethereum transaction when wallet is ready
  useEffect(() => {
    console.log("🔍 === ETHEREUM TRANSACTION USEEFFECT TRIGGERED ===");
    console.log("🔍 walletResult:", walletResult);
    console.log("🔍 walletResult?.eth:", walletResult?.eth);
    console.log(
      "🔍 walletResult?.eth?.publicAddress:",
      walletResult?.eth?.publicAddress
    );

    const ethAddress = walletResult?.eth?.publicAddress;

    if (!ethAddress) {
      console.log("🔍 ❌ No ETH address available, returning early");
      return;
    }

    console.log("🔍 ✅ ETH address found:", ethAddress);
    console.log("🔍 Calling createBaseETHTransfer...");

    // Create a self-transfer transaction using the Portkey wallet address
    createBaseETHTransfer(ethAddress, "0.00001")
      .then((result) => {
        console.log("🔍 ✅ createBaseETHTransfer SUCCESS!");
        console.log("🔍 Result:", result);
        console.log("🔍 SerializedTx:", result.serializedTx);
        console.log("🔍 Setting ethTx state...");

        setEthTx(result.serializedTx);
        setEthTxObject(result.transaction);

        console.log("🔍 ✅ ethTx state set! Value:", result.serializedTx);
        console.log("🔍 Created ETH transaction for address:", ethAddress);
      })
      .catch((err) => {
        console.error("🔍 ❌ createBaseETHTransfer FAILED:", err);
        console.error("🔍 Error details:", err.message);
        console.error("🔍 Error stack:", err.stack);
        setEthTx(""); // Clear on error
        setEthTxObject(null);
      });

    console.log("🔍 === ETHEREUM TRANSACTION USEEFFECT COMPLETE ===");
  }, [walletResult?.eth?.publicAddress]);

  // Debug useEffect to track ethTx state changes
  useEffect(() => {
    console.log("🔍 🔄 ethTx state changed:", ethTx);
    console.log("🔍 🔄 ethTx length:", ethTx ? ethTx.length : 0);
    console.log("🔍 🔄 ethTx type:", typeof ethTx);
  }, [ethTx]);

  // Handle broadcast transaction
  const handleBroadcastEthTransaction = async () => {
    if (!ethTxStatus.signedTx) {
      console.error("No signed transaction to broadcast");
      return;
    }

    setEthTxStatus((prev) => ({ ...prev, status: "broadcasting" }));

    try {
      const result = await broadcastTransaction(ethTxStatus.signedTx);

      if (result.status === "pending") {
        setEthTxStatus((prev) => ({
          ...prev,
          status: "pending",
          txHash: result.txHash,
        }));

        // Wait for confirmation
        const confirmation = await waitForTransactionConfirmation(
          result.txHash
        );

        setEthTxStatus((prev) => ({
          ...prev,
          status: confirmation.status,
          error: confirmation.error,
        }));
      } else {
        setEthTxStatus((prev) => ({
          ...prev,
          status: "failed",
          error: result.error,
        }));
      }
    } catch (error) {
      setEthTxStatus((prev) => ({
        ...prev,
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown error",
      }));
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.source !== iframeWindow) return;

      if (event.data?.source === "iframe") {
        // Handle wallet creation
        if (event.data?.command === "signup" && event.data?.result?.wallet) {
          const result = event.data.result;
          setWalletResult({
            pubkey: result.passkey?.credentialId ?? "",
            eth: result.wallet.eth,
            solana: result.wallet.solana,
          });
          console.log("Wallet created:", {
            eth: result.wallet.eth?.publicAddress,
            solana: result.wallet.solana?.publicAddress,
          });
        }

        // Handle Ethereum transaction signing
        if (
          event.data?.command === "signedEthereumTransaction" &&
          event.data?.result
        ) {
          console.log("Ethereum transaction signed!", event.data.result);
          const signedTx =
            event.data.result.signedTx ||
            event.data.result.rawTx ||
            event.data.result;
          setEthTxStatus({
            status: "signed",
            signedTx: signedTx,
          });
        }

        // Handle Ethereum transaction signing error
        if (
          event.data?.command === "signEthereumTransaction" &&
          event.data?.error
        ) {
          console.error(
            "Ethereum transaction signing failed:",
            event.data.error
          );
          setEthTxStatus({
            status: "failed",
            error: event.data.error,
          });
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [iframeWindow]);

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-brand">
          <h1>🔐 Portkey Wallet</h1>
        </div>
        <div className="nav-links">
          <Link
            to="/"
            className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
          >
            Dashboard
          </Link>
          <Link
            to="/create"
            className={`nav-link ${
              location.pathname === "/create" ? "active" : ""
            }`}
          >
            Create Wallet
          </Link>
          <Link
            to="/sign"
            className={`nav-link ${
              location.pathname === "/sign" ? "active" : ""
            }`}
          >
            Sign Transaction
          </Link>
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard walletResult={walletResult} />} />
          <Route path="/create" element={<WalletCreation />} />
          <Route
            path="/sign"
            element={
              <TransactionSigning
                walletResult={walletResult}
                solTx={solTx}
                ethTx={ethTx}
                ethTxObject={ethTxObject}
                ethTxStatus={ethTxStatus}
                onBroadcastEthTx={handleBroadcastEthTransaction}
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;
