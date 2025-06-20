export interface CreateWalletOptions {
  iframe: HTMLIFrameElement;
  vaultOrigin: string;
  jwt: string;
  pubkey: string;
  onResult?: (walletData: any) => void;
  onError?: (err: string) => void;
}

export interface SignTransactionOptions {
  iframe: HTMLIFrameElement;
  vaultOrigin: string;
  pubkey: string;
  vault: { cipherText: string; iv: string; salt: string };
  transactionBase64: string;
  onSigned?: (signedTx: string) => void;
  onError?: (err: string) => void;
}

export function createWallet({
  iframe,
  vaultOrigin,
  jwt,
  pubkey,
  onResult,
  onError,
}: CreateWalletOptions) {


  window.addEventListener("message", (event) => {
    console.log("MRSSAGE_", event)
    if (event.origin !== vaultOrigin || event.data?.command !== "signup") return;

    if (event.data.result) {
      onResult?.(event.data.result);
    } else if (event.data.error) {
      onError?.(event.data.error);
    }
  });

  console.log("postMessage", event)

  if (iframe.contentWindow?.postMessage) {
    iframe.contentWindow.postMessage(
      {
        id: 0,
        command: "signup",
        source: "parent",
        skipVerification: true,
        pubkey,
      },
      vaultOrigin
    );
  } else {
    iframe.addEventListener("load", () => {
      iframe.contentWindow?.postMessage(
        {
          id: 0,
          command: "signup",
          source: "parent",
          skipVerification: true,
          pubkey,
        },
        vaultOrigin
      );
    });
  }
  
}

export function signSolanaTransaction({
  iframe,
  vaultOrigin,
  pubkey,
  vault,
  transactionBase64,
  onSigned,
  onError,
}: SignTransactionOptions) {
  if (!iframe?.contentWindow) {
    onError?.("Iframe not ready");
    return;
  }

  if (!transactionBase64 || transactionBase64.length < 10) {
    onError?.("Invalid Solana transaction");
    return;
  }

  window.addEventListener("message", (event) => {
    if (event.origin !== vaultOrigin || event.data?.command !== "signSolanaTransaction") return;

    if (event.data.result?.signedTx) {
      onSigned?.(event.data.result.signedTx);
    } else if (event.data.error) {
      onError?.(event.data.error);
    }
  });

  iframe.contentWindow.postMessage(
    {
      id: 1,
      command: "signSolanaTransaction",
      source: "parent",
      data: {
        transaction: transactionBase64,
        cipherText: vault.cipherText,
        iv: vault.iv,
        salt: vault.salt,
        pubkey,
      },
    },
    vaultOrigin
  );
}

export function signEthereumTransaction({
  iframe,
  vaultOrigin,
  pubkey,
  vault,
  transactionBase64,
  onSigned,
  onError,
}: SignTransactionOptions) {
  if (!iframe?.contentWindow) {
    onError?.("Iframe not ready");
    return;
  }

  window.addEventListener("message", (event) => {
    if (event.origin !== vaultOrigin || event.data?.command !== "signEthereumTransaction") return;

    if (event.data.result?.signedTx) {
      onSigned?.(event.data.result.signedTx);
    } else if (event.data.error) {
      onError?.(event.data.error);
    }
  });

  iframe.contentWindow.postMessage(
    {
      id: 2,
      command: "signEthereumTransaction",
      source: "parent",
      data: {
        transaction: transactionBase64,
        cipherText: vault.cipherText,
        iv: vault.iv,
        salt: vault.salt,
        pubkey,
      },
    },
    vaultOrigin
  );
}
