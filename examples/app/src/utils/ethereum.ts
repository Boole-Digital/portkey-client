import { ethers } from "ethers";

// Base mainnet configuration
const BASE_MAINNET_CONFIG = {
  chainId: 8453,
  name: "Base",
  rpcUrl: "RPC_URL_HERE",
  currency: "ETH",
};

export interface EthereumTransaction {
  to: string;
  value: string;
  data: string;
  gasLimit?: string;
  gasPrice?: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  nonce?: number;
  chainId: number;
  type: number;
}

// UPDATED VERSION - Fetch real nonce and gas prices
export async function createBaseETHTransfer(
  walletAddress: string,
  amountInETH: string = "0.00001"
): Promise<{
  transaction: EthereumTransaction;
  serializedTx: string;
}> {
  console.log("🔧 === createBaseETHTransfer CALLED ===");
  console.log("🔧 walletAddress:", walletAddress);
  console.log("🔧 amountInETH:", amountInETH);

  try {
    console.log("🔧 Validating address...");

    // Validate address
    if (!ethers.isAddress(walletAddress)) {
      console.error("🔧 ❌ Invalid Ethereum address:", walletAddress);
      throw new Error("Invalid Ethereum address");
    }

    console.log("🔧 ✅ Address validation passed");

    // Connect to network to get real data
    const provider = new ethers.JsonRpcProvider(BASE_MAINNET_CONFIG.rpcUrl, {
      chainId: BASE_MAINNET_CONFIG.chainId,
      name: BASE_MAINNET_CONFIG.name,
    });

    console.log("🔧 Fetching nonce and gas prices from network...");

    // Get real nonce and gas prices
    const [nonce, feeData] = await Promise.all([
      provider.getTransactionCount(walletAddress),
      provider.getFeeData(),
    ]);

    console.log("🔧 ✅ Network data fetched:", {
      nonce,
      maxFeePerGas: feeData.maxFeePerGas?.toString(),
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas?.toString(),
    });

    const amountInWei = ethers.parseEther(amountInETH);
    console.log("🔧 ✅ Amount in wei:", amountInWei.toString());

    // Create transaction with real network data
    const transaction: EthereumTransaction = {
      to: walletAddress, // Self-transfer
      value: amountInWei.toString(),
      data: "0x",
      gasLimit: "21000",
      maxFeePerGas: feeData.maxFeePerGas?.toString() || "20000000000",
      maxPriorityFeePerGas:
        feeData.maxPriorityFeePerGas?.toString() || "1000000000",
      nonce: nonce, // Real nonce from network
      chainId: BASE_MAINNET_CONFIG.chainId,
      type: 2,
    };

    console.log("🔧 ✅ Transaction object created:", transaction);

    // Create transaction for serialization
    const txForSerialization = {
      to: transaction.to,
      value: transaction.value,
      data: transaction.data,
      gasLimit: transaction.gasLimit,
      maxFeePerGas: transaction.maxFeePerGas,
      maxPriorityFeePerGas: transaction.maxPriorityFeePerGas,
      nonce: transaction.nonce,
      chainId: transaction.chainId,
      type: transaction.type,
    };

    console.log("🔧 ✅ txForSerialization created:", txForSerialization);

    // Serialize the transaction
    console.log("🔧 About to serialize transaction...");
    const ethersTransaction = ethers.Transaction.from(txForSerialization);
    console.log("🔧 ✅ ethers.Transaction.from() success");

    const serializedTx = ethersTransaction.unsignedSerialized;
    console.log("🔧 ✅ Transaction serialized:", serializedTx);

    console.log("🔧 ✅ Base ETH transaction created successfully");

    const result = {
      transaction,
      serializedTx,
    };

    console.log("🔧 ✅ About to resolve with result:", result);

    return result;
  } catch (error) {
    console.error("🔧 ❌ Error in createBaseETHTransfer:", error);
    console.error(
      "🔧 ❌ Error message:",
      error instanceof Error ? error.message : "Unknown error"
    );
    console.error(
      "🔧 ❌ Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );
    throw error;
  }
}

export async function broadcastTransaction(signedTx: string): Promise<{
  txHash: string;
  status: "pending" | "confirmed" | "failed";
  error?: string;
}> {
  try {
    console.log("🚀 Broadcasting transaction to Base network...");
    console.log("🚀 Signed transaction:", signedTx);

    // Connect to Base mainnet with Alchemy RPC
    const provider = new ethers.JsonRpcProvider(BASE_MAINNET_CONFIG.rpcUrl, {
      chainId: BASE_MAINNET_CONFIG.chainId,
      name: BASE_MAINNET_CONFIG.name,
    });

    // Test connection and verify chain ID
    const network = await provider.getNetwork();
    console.log(`🚀 Connected to network:`, network);
    console.log(
      `🚀 Expected chain ID: ${BASE_MAINNET_CONFIG.chainId}, Actual: ${network.chainId}`
    );

    if (network.chainId !== BigInt(BASE_MAINNET_CONFIG.chainId)) {
      throw new Error(
        `Chain ID mismatch: expected ${BASE_MAINNET_CONFIG.chainId}, got ${network.chainId}`
      );
    }

    // Broadcast the signed transaction
    const txResponse = await provider.broadcastTransaction(signedTx);

    console.log("🚀 ✅ Transaction broadcasted! Hash:", txResponse.hash);
    console.log(
      "🚀 View on BaseScan:",
      `https://basescan.org/tx/${txResponse.hash}`
    );

    return {
      txHash: txResponse.hash,
      status: "pending",
    };
  } catch (error) {
    console.error("🚀 ❌ Error broadcasting transaction:", error);
    return {
      txHash: "",
      status: "failed",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function waitForTransactionConfirmation(txHash: string): Promise<{
  status: "confirmed" | "failed";
  receipt?: any;
  error?: string;
}> {
  try {
    const provider = new ethers.JsonRpcProvider(BASE_MAINNET_CONFIG.rpcUrl);

    console.log("Waiting for transaction confirmation...");
    const receipt = await provider.waitForTransaction(txHash, 1);

    if (receipt && receipt.status === 1) {
      console.log("Transaction confirmed!", receipt);
      return {
        status: "confirmed",
        receipt,
      };
    } else {
      return {
        status: "failed",
        error: "Transaction failed",
      };
    }
  } catch (error) {
    console.error("Error waiting for confirmation:", error);
    return {
      status: "failed",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Helper function to get wallet balance
export async function getWalletBalance(address: string): Promise<string> {
  try {
    const provider = new ethers.JsonRpcProvider(BASE_MAINNET_CONFIG.rpcUrl);
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error("Error getting wallet balance:", error);
    return "0";
  }
}
