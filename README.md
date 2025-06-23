Portkey 🔑🚪
Create passkey-secured, self-custodial crypto wallets & sign transactions straight from the browser.

Portkey brings the power of FIDO2 / WebAuthn passkeys to web3.Think Turnkey, but without a third-party HSM: the private key never leaves the user’s device and is never decryptable by your app, browser extensions, or Portkey itself.

✨ Highlights



Feature
Description



🔒 Isolated signing environment
A cross-origin, CSP-locked iframe (“Vault”) handles all key material & cryptography.


🪪 Passkey PRF encryption
Private keys are encrypted with the WebAuthn PRF extension; only the user’s passkey can decrypt.


🏡 Self-hosted Vault
Deploy the Vault on your own sub-domain → no vendor lock-in, phishing-resistant, CSP-hardened.


🧩 React-first API
<BackgroundIframeProvider />, ready-made <PortkeyButton />, and usePortkeyWatcher() hook.


🌐 All chains supported
Ethereum (raw & EIP-712), Solana, Hyperliquid, and easy extensibility.


⚡️ Session re-use
Optional allowSessionSigning flag caches the derived AES key in a closure for ~5 min → multiple signatures without additional passkey prompts.


🕶 Zero snooping
Vault lives in a different origin + sandboxed + document.domain locked. You can’t read it—even in devtools.



🚀 Quick Start
1. Install
npm i @your-scope/portkey  # or pnpm add / yarn add

2. Wrap your app
import React from "react";
import { BackgroundIframeProvider } from "@your-scope/portkey";

export default function App() {
  return (
    <BackgroundIframeProvider initialSrc="https://vault.yourapp.xyz">
      <YourRoutesAndPages />
    </BackgroundIframeProvider>
  );
}

3. Create a wallet (signup)
import { PortkeyButton } from "@your-scope/portkey";

export function Signup() {
  return (
    <PortkeyButton
      label="Create Wallet"
      command="signup"
      buttonType="signup"
      origin="https://vault.yourapp.xyz"
      className="my-4"
    />
  );
}

PortkeyButton automatically:

Moves and shows the Vault iframe on top of itself.
Sends the signup command.
Waits for the Vault to return { wallet, passkey }.

4. Listen for results
import { usePortkeyWatcher } from "@your-scope/portkey";

export function GlobalPortkeyEvents() {
  usePortkeyWatcher((msg) => {
    if (msg.command === "signup" && msg.result) {
      console.log("✅ New wallet:", msg.result.wallet);
      // ➡️ Persist `wallet.cipherText / iv / salt` server-side
    }
  }, "https://vault.yourapp.xyz");

  return null; // invisible listener
}

5. Sign a transaction
import { signEthereumTransaction, signSolanaTransaction } from "@your-scope/portkey";

export async function doSomethingCool({
  iframe,         // from BackgroundIframeContext
  vaultOrigin,    // https://vault.yourapp.xyz
  vault,          // { cipherText, iv, salt } from step 3
  pubkey,         // passkey credentialId
}) {
  signEthereumTransaction({
    iframe,
    vaultOrigin,
    pubkey,
    vault,
    transactionBase64: btoa(
      JSON.stringify({
        to: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
        value: "0x2386f26fc10000", // 0.01 ETH
        maxFeePerGas: "0x28",
        maxPriorityFeePerGas: "0x28",
        nonce: 0,
        chainId: 1,
        type: 2,
      })
    ),
    onSigned: (rawTx) => console.log("📜 signedTx:", rawTx),
    onError: console.error,
  });
}


🏗 Architecture
sequenceDiagram
    participant UI as React App
    participant PK as Portkey React SDK
    participant VAULT as Vault Iframe (cross-origin)
    participant AUTH as Platform Authenticator (passkey)

    UI->>PK: <PortkeyButton command="sign">
    PK->>VAULT: postMessage({ command: "sign" })
    VAULT-->>UI: "ready" ✅
    UI->>AUTH: navigator.credentials.get({ prf })
    AUTH-->>VAULT: PRF( salt )  // shared secret
    VAULT->>VAULT: AES-GCM decrypt private key
    VAULT->>VAULT: Sign tx / typed data
    VAULT->>PK: postMessage({ signedTx })
    PK-->>UI: resolve onSigned callback


Cross-origin isolation prevents the parent from touching VAULT.document.
PRF extension = deterministic, credential-scoped HKDF; no user secrets cross domain.
Optional session key (in-memory, AES-encrypted) reduces UX friction.


🛠 API Reference
<BackgroundIframeProvider initialSrc?>

``




Prop
Type
Default
Description



initialSrc
string
"about:blank"
The Vault URL (https://vault.foo.xyz).


children
ReactNode
—
Your app.


BackgroundIframeProvider exposes a Context with:
{
  iframeRef: RefObject<HTMLIFrameElement>;
  setIframeSrc(src: string): void;
  moveIframeTo(el: HTMLElement | null): void;
}



<PortkeyButton /> (UI helper)

``




Prop
Type
Required
Description



label
string
✔
Button text.


buttonType
"signup" | "signEthTx" | "signSolTx"
✔
What to do when clicked.


command
string
✔
Mirrors Vault command (e.g., "signup").


origin
string
✔
Vault origin (https://vault.foo.xyz).


data
Record<string, any>
—
Extra payload (tx, etc.).


hide
boolean
—
Invisible but keeps iframe alive (perf hack).




createWallet(options)

`createWallet(options)`

createWallet({
  iframe,            // HTMLIFrameElement (Vault)
  vaultOrigin,       // string
  jwt,               // string (optional server auth)
  pubkey,            // credentialId to bind this wallet to
  onResult(wallet),  // callback
  onError(error),    // callback
});

Creates both an Ethereum & Solana wallet, encrypted with the passkey PRF.


signEthereumTransaction(options)

`signEthereumTransaction(options)`

Same signature as above, plus transactionBase64.Returns { signedTx }.


signSolanaTransaction(options)

`signSolanaTransaction(options)`

Same signature as above, plus transactionBase64.Returns { signedTx } (Base64 of a VersionedTransaction).


usePortkeyWatcher(handler, allowedOrigin)

`usePortkeyWatcher(handler, allowedOrigin)`

usePortkeyWatcher((msg) => {
  // msg.command ∈ ["signup", "signedEthereumTransaction", ...]
}, "https://vault.foo.xyz");

Typed guard for window.postMessage events.



⚙️ Advanced
Keep-alive session key
// Inside Vault query-string or postMessage `data`
{ allowSessionSigning: true }  // default: false

The Vault will:

Derive AES key once (passkey UX prompt).
Re-encrypt it with an in-memory master key.
Cache it for 5 minutes of inactivity → multiple signatures, fewer prompts.

Custom UI / no preset button
Prefer your own styling?
const { iframeRef, setIframeSrc, moveIframeTo } = useBackgroundIframe();

function MyBeautifulCTA() {
  const ref = React.useRef<HTMLButtonElement>(null);

  const onClick = () => {
    if (!ref.current) return;
    setIframeSrc("https://vault.foo.xyz?chain=eth");
    moveIframeTo(ref.current);
    ref.current.style.opacity = "0.5";

    iframeRef.current!.contentWindow!.postMessage(
      { command: "signEthereumTransaction", data: myTx },
      "https://vault.foo.xyz"
    );
  };

  return <button ref={ref} onClick={onClick}>Pay 0.01 ETH</button>;
}


🛡 Security Model

Origin Isolation: Vault is served from vault.yourapp.xyz, while your SPA is app.yourapp.xyz.
Content-Security-Policy: Scripts are limited to altruistic CDNs; no inline eval.
document.domain & window.top blocked: Even malicious extensions can’t peek.
Passkey PRF: Key derivation is bound to the credential & RP ID, impossible to brute force without the user’s authenticator.
No remote logging: All console.logs are inside the iframe context only.

See /vault/index.html for CSP, COOP/COEP, and inline nonce.

🏗 Deploying the Vault
cd packages/vault
pnpm build                 # produces dist/
rsync -a dist/ user@server:/var/www/vault


DNS → vault.yourapp.xyz, HTTPS required.
Add the following headers (Apache / Nginx / cloud):

Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
Content-Security-Policy: default-src 'self'; ...


🧑‍💻 Contributing
pnpm i
pnpm dev  # runs Storybook for the React SDK & a local Vault (localhost:5173)


Commit using Conventional Commits & open a PR.
Please check /CONTRIBUTING.md for lint/test guidelines.


📄 License
MIT © Your Company Name – Use at your own risk. Experimental software; audit pending.

❤️ Acknowledgements

webauthn-json for sane WebAuthn serialization.
ethers.js & @solana/web3.js for battle-tested crypto.
Inspiration from Turnkey’s UX & security papers.


“The best password is no password” → the best wallet is no seed phrase.Welcome to passkey-powered web3 with Portkey.
















![Screenshot 2025-05-04 at 11 33 30 am](https://github.com/user-attachments/assets/25b95e92-1de3-40c1-b307-fb520b8a67e0)

# 🔐 Portkey - decentralised passkey secured crypto wallet

A cross chain **crypto wallet** that uses **passkeys** to create and manage user accounts—**no extensions, no seed phrases, no third-party custodians.** Just your passkey, your browser, your wallet.

## 🚪 Portkey app

To get started:

1. Run the cross origin vault server:
   ```bash
   npm i && npm run vault

2. Open The demo app
   ```bash
   cd demo && npm run start

Note: you need to run chrome or safari with either apple keychain or google passwords to have PRF support for this demo to work. 
Current support does not include non device key managers like 1Password etc.
Android users may have to update their OS to latest to have PRF support

---

## 🚀 Features

- **Passkey-Based Authentication**  
  Users register and authenticate using passkeys—natively supported by most mobile and desktop devices. Think apple pay user experience. Unlike turnkey and other MPC or hosted wallet offerings, Portkey is totally decentralised, it's just you and your keys. The encrypted keys can be stored wherever you want. ie: Databases, locally, on-chain, ipfs, arweave and anywhere you can think of.

- **No Secrets, No Custodians**  
  The wallet is completely self-custodial but your users dont need to know about keys or seed phrases if they dont want. The catch here with other passkey wallet providers is the privake keys are held by a secured server or decentralised network and access is reliant on that provider. This implementation has no 3rd party reliance at all with all the same benefits.

- **Makes Web Feel like native**  
  No downloads or browser-plugins. 100% client-side logic. Works in the browser and natively. Users can optionally use the same key for both platforms.

- **Secure Browser Sandboxing**  
  Sensitive cryptographic operations are performed in a secure, origin-isolated environmant. Your main browser context and any installed extensions **cannot access or inspect** the execution environment.

- **Offline Airdrop of Access**  
  You can securely transfer wallet access to another device using a native airdrop flow—no internet required.

- **End-to-End Cryptographic Key Derivation**  
  Your passkey deterministically derives your cryptographic wallet keys. Private keys are never stored or transmitted.

- **Zero-Knowledge by Design**  
  No private information is stored on any server. Authentication and wallet generation are entirely local.

- **Use passkeys across web and native apps**  
  Your users can authenticate with the same passkey whether on IOS or Web

---

## 🛠 How It Works

1. **Registration**  
   The user signs up using the WebAuthn API to create a passkey.

2. **Authentication**  
   The browser re-authenticates using the passkey. On success, a signature is generated locally.

3. **Key Derivation**  
   A deterministic key is derived using the passkey signature and a known domain-specific salt (e.g. domain name + wallet type).

4. **Secure IFrame Execution**  
   A sandboxed iframe, with `sandbox="allow-scripts"` and hosted on a different origin, handles all key generation, signing, and cryptographic material to isolate it from the main browser context.

5. **Wallet Creation**  
   The derived key material is used to generate standard crypto wallet keys (e.g., Ethereum, Solana, etc.).

6. **Data storage**  
   The encrypted data containing the private key is safe to be stored anywhere from icloud, locally or anywhere else. Technically you can pin it to public ledgers like Ethereum, Bitcoin or Arweave, as without the passkey the data has no way to reveal information about the contents or the creator. So your backup choices are endless. Just dont lose your passkey, airdrop it to another device or use icloud are ideas in the IOS ecosystem.

7. **Offline Native Airdrop**  
   You can transfer your wallet access to another device via Airdrop on IOS. Native keydrop if you will.

8. **Transaction Signing**  
   The derived private key is used inside the secure iframe to sign transactions. Nothing leaves the sandboxed cryptographic environment.

---

## 🔧 Tech Stack

- **JavaScript / TypeScript** for browser logic  
- **WebCrypto API + IFrame Sandboxing** for isolated key operations  
- **Optional: Decentralised storage, Centralised storage or LocalStorage** for pinning your users safely encrypted wallet data.



# ✅ Portara Vault – Production Readiness Checklist

---

## 🔐 1. Security & Cryptography

- [ ] **Use HTTPS in production**  
  PRF and `navigator.credentials.get()` require a secure context (HTTPS or `localhost`).

- [ ] **Lock down iframe origins**
  - Replace `localhost:3000` with your actual domain in `trustedOrigin`.
  - Use strict `targetOrigin` in all `postMessage()` calls.
  - Set `Cross-Origin-Embedder-Policy` and `Cross-Origin-Opener-Policy` headers for vault iframe.

- [ ] **Rotate nonces in CSP headers**
  - Don't hardcode `'nonce-abc123'`; generate a secure nonce per request and inject it into inline script/style tags.

- [ ] **Verify PRF/WebAuthn support**
  - Detect if the user agent supports PRF.
  - Show a fallback or error if unsupported.

- [ ] **Encrypt secrets client-side only**
  - You're using AES-GCM + PRF-derived keys — good.
  - Ensure salt and IV are generated with `crypto.getRandomValues()` per wallet.

---

## 🧱 2. Code & Architecture

- [ ] **Split app into logical modules**
  - Keep iframe and main React module in different folders or repositories.
  - Build iframe as a static file served on its own subdomain.

- [ ] **Publish React component as an NPM package (optional)**
  - Create a lightweight React component wrapper (`PortaraVault`) that developers can import.
  - Bundle with Vite or Rollup for ESM + CJS support.

- [ ] **Add subresource integrity (SRI) or signed vault hash (optional)**
  - If hosting the iframe separately, verify its integrity to prevent tampering.

- [ ] **Use secure storage (optional)**
  - Store encrypted wallets in IndexedDB or `StorageManager.persist()`, not `localStorage`.

---

## 💡 3. UX & Interaction

- [ ] **Show vault iframe loading state**
  - Display “Vault loading…” UI until iframe posts `{ status: "ready" }`.

- [ ] **Handle errors clearly**
  - Timeout on iframe load
  - Passkey canceled
  - PRF failure
  - Unrecognized commands

- [ ] **Confirm signing success visually**
  - Animate confirmation, copy signature to clipboard, etc.

- [ ] **Add secure QR pairing for mobile (optional)**
  - Allow mobile vault to be triggered via QR code + cross-device WebAuthn.

---

## 🚀 4. Hosting & Deployment

- [ ] **Serve iframe and main app from separate subdomains**
  - Example: `vault.example.com` for iframe, `app.example.com` for UI.
  - Helps enforce isolation via CSP and sandbox.

- [ ] **Use proper cache headers**
  - Disable cache for vault iframe
  - Enable long-lived cache for static React assets

- [ ] **Log vault activity (non-sensitive)**
  - Log command starts/errors — never log decrypted keys or sensitive data.

- [ ] **Run a security header audit**
  - Use: [https://securityheaders.com](https://securityheaders.com)
  - Required headers:
    - `Content-Security-Policy`
    - `X-Content-Type-Options: nosniff`
    - `X-Frame-Options: DENY`
    - `Referrer-Policy: no-referrer`