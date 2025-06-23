import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Create } from './Create';
import { Sign } from './Sign';
import { IframeConsole } from './IframeConsole';
import { createUnsignedSolanaTx } from './helpers/solana';

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

const App = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [iframeWindow, setIframeWindow] = useState<Window | null>(null);
  const [walletResult, setWalletResult] = useState<WalletResult | null>(null);

  const log = (message: string) => setLogs(prev => [...prev, message]);

  useEffect(() => {
    const checkIframe = () => {
      const iframe = document.getElementById('portkey') as HTMLIFrameElement | null;
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

  const [solTx, setSolTx] = useState<string>(''); // default is empty

  useEffect(() => {
    const pubkey = walletResult?.solana?.publicAddress;
    if (!pubkey) return;
  
    createUnsignedSolanaTx(pubkey, pubkey)
      .then(setSolTx)
      .catch(err => {
        console.error("Failed to create unsigned Solana tx", err);
        setSolTx('');
      });
  }, [walletResult?.solana?.publicAddress]);

  useEffect(() => {
    const testIframeSecurity = () => {
      if (!iframeWindow) return;
      try {
        const doc = iframeWindow.document;
        log('❌ Security breach: iframe content accessible!');
      } catch {
        log('✅ Iframe is cross-origin isolated — access blocked as expected.');
      }
    };

    const handleMessage = (event: MessageEvent) => {
      if (event.source !== iframeWindow) return;

      if (event.data?.status === 'ready' && event.data?.source === 'iframe') {
        testIframeSecurity();
      }

      if (event.data?.source === 'iframe') {
        if (typeof event.data?.log === 'string') {
          log(event.data.log);
        }

        // 👇 Watch for successful signup
        if (event.data?.command === 'signup' && event.data?.result?.wallet) {
          const result = event.data.result;
          setWalletResult({
            pubkey: result.passkey?.credentialId ?? '',
            eth: result.wallet.eth,
            solana: result.wallet.solana,
          });
          log('✅ Captured wallet data from signup');
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [iframeWindow]);

  const signPageElement = (
    type: string,
    command: string,
    label: string,
    tx: string,
    hide: boolean
  ) => {
    const walletData = type === 'signSolTx' ? walletResult?.solana : walletResult?.eth;
    const pubkey = walletResult?.pubkey;

    if (!walletData || !pubkey) {
      return <p style={{ color: 'red' }}>⚠️ Wallet not ready. Please create a wallet first.</p>;
    }

    return (
      <Sign
        type={type}
        command={command}
        label={label}
        hide={hide}
        data={{
          pubkey,
          wid: 'static-wid', // Replace if needed
          address: walletData.publicAddress,
          cipherText: walletData.cipherText,
          iv: walletData.iv,
          salt: walletData.salt,
          chain: type === 'signSolTx' ? 'solana' : 'evm',
          transaction: {
            to: '0x0000000000000000000000000000000000000000',
            data: tx,
          }
        }}
      />
    );
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'monospace' }}>
      <div style={{ flex: 1, padding: '2rem' }}>
        <nav style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>
          <Link style={{ marginRight: '1.5rem' }} to="/">🛠️ Create Wallet</Link>
          <Link style={{ marginRight: '1.5rem' }} to="/signSol">🔐 Sign Sol</Link>
          <Link style={{ marginRight: '1.5rem' }} to="/signEvm">🔄 Sign EVM</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Create />} />
          <Route
            path="/signSol"
            element={
              <div>
                <h2>🔐 Sign Solana</h2>
                <p>Confirm signing this transaction.</p>
                {signPageElement("signSolTx", "signSolanaTransaction", "Confirm 🔏", solTx, false)}
              </div>
            }
          />
          <Route
            path="/signEvm"
            element={
              <div>
                <h2>🔄 Sign EVM</h2>
                <p>
                  Swapping <span role="img" aria-label="ETH">💰</span> for <span role="img" aria-label="SOL">🔶</span>
                </p>
                {signPageElement("signEthTx", "signEthereumTransaction", "Swap 🔁", "0x11", false)}
              </div>
            }
          />
        </Routes>
      </div>

      <div
        style={{
          width: '50vw',
          backgroundColor: '#1e1e1e',
          color: '#00ff88',
          padding: '1rem',
          fontSize: '0.9rem',
          borderLeft: '2px solid #333',
          overflowY: 'auto',
          height: '100vh',
        }}
      >
        <h3 style={{ color: '#00ffaa' }}>🖥️ Portkey Console</h3>
        {logs.length === 0
          ? <p style={{ color: '#555' }}>No data detected leaking.</p>
          : logs.map((line, idx) => <pre key={idx}>{line}</pre>)
        }
        <IframeConsole />
      </div>
    </div>
  );
};

export default App;
