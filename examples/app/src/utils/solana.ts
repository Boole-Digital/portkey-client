import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

export async function createUnsignedSolanaTx(
  fromAddress: string,
  toAddress: string,
  lamports: number = 1000
): Promise<string> {
  const connection = new Connection("https://api.devnet.solana.com");
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
  return btoa(String.fromCharCode(...serialized));
}
