import { Connection, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import bs58 from 'bs58';

/**
 * Create an unsigned Solana transaction and return it as a base64 string.
 * @param toAddress The recipient's Solana address (base58-encoded)
 * @param fromAddress The sender's Solana address (base58-encoded)
 * @param lamports Amount to send in lamports (1 SOL = 1_000_000_000 lamports)
 * @returns base64-encoded serialized unsigned transaction
 */
export async function createUnsignedSolanaTx(
  fromAddress: string,
  toAddress: string,
  lamports: number = 1000 // default: 1000 lamports
): Promise<string> {

    console.log("createUnsignedSolanaTx")
  const connection = new Connection('https://api.devnet.solana.com'); // or testnet/devnet

  const fromPubkey = new PublicKey(fromAddress);
  const toPubkey = new PublicKey(toAddress);

  const { blockhash } = await connection.getLatestBlockhash();

  const tx = new Transaction({
    recentBlockhash: blockhash,
    feePayer: fromPubkey,
  }).add(
    SystemProgram.transfer({
      fromPubkey,
      toPubkey,
      lamports,
    })
  );

  const serialized = tx.serialize({ requireAllSignatures: false });

  console.log(serialized)
  return btoa(String.fromCharCode(...serialized));
}
