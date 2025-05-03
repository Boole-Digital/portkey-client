import React, { useEffect, useRef } from "react";

interface VaultProps {
  vaultUrl: string;
  onSignup: (result: any) => void;
  onSign: (result: any) => void;
  onError?: (err: Error) => void;
}

const PortaraVault: React.FC<VaultProps> = ({ vaultUrl, onSignup, onSign, onError }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const trustedOrigin = new URL(vaultUrl).origin;

  useEffect(() => {
    const listener = (event: MessageEvent) => {
      if (event.origin !== trustedOrigin || event.data?.source !== "iframe") return;

      const { command, result, error } = event.data;

      if (error && onError) return onError(new Error(error));

      if (command === "signup") onSignup(result);
      if (command === "signTransaction") onSign(result);
    };

    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, [vaultUrl]);

  const postMessage = (command: string, data?: any) => {
    iframeRef.current?.contentWindow?.postMessage(
      { id: Date.now(), command, data, source: "parent" },
      trustedOrigin
    );
  };

  const signup = () => postMessage("signup");
  const signTransaction = (walletData: {
    ciphertext: string;
    iv: string;
    salt: string;
    transaction: any;
  }) => postMessage("signTransaction", walletData);

  // Optional: expose these through refs or prop callbacks if needed
  (window as any).portaraSignup = signup;
  (window as any).portaraSign = signTransaction;

  return (
    <iframe
      ref={iframeRef}
      src={vaultUrl}
      title="Portara Vault"
      sandbox="allow-scripts allow-same-origin"
      allow="publickey-credentials-create *; publickey-credentials-get *"
      style={{ width: 0, height: 0, border: "none" }}
    />
  );
};

export default PortaraVault;
