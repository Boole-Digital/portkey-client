# Portkey 🔑🚪  
_Create passkey-secured, self-custodial crypto wallets & sign transactions straight from the browser._

[![npm version](https://img.shields.io/npm/v/@your-scope/portkey.svg)](https://www.npmjs.com/package/@your-scope/portkey)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@your-scope/portkey)](https://bundlephobia.com/result?p=@your-scope/portkey)
[![license](https://img.shields.io/npm/l/@your-scope/portkey)](LICENSE)

Portkey brings the power of **FIDO2 / WebAuthn passkeys** to web3.  
Think **Turnkey**, but without a third-party HSM: the private key _never leaves the user’s device_ and is never decryptable by your app, browser extensions, or Portkey itself.

---

## ✨ Highlights

| Feature | Description |
|---------|-------------|
| 🔒 **Isolated signing environment** | A cross-origin, CSP-locked iframe (“Vault”) handles all key material & cryptography. |
| 🪪 **Passkey PRF encryption** | Private keys are encrypted with the WebAuthn **PRF extension**; only the user’s passkey can decrypt. |
| 🏡 **Self-hosted Vault** | Deploy the Vault on your own sub-domain → no vendor lock-in, phishing-resistant, CSP-hardened. |
| 🧩 **React-first API** | `<BackgroundIframeProvider />`, ready-made `<PortkeyButton />`, and `usePortkeyWatcher()` hook. |
| 🌐 **All chains supported** | Ethereum (raw & EIP-712), Solana, Hyperliquid, and easy extensibility. |
| ⚡️ **Session re-use** | _Optional_ `allowSessionSigning` flag caches the derived AES key in a closure for ~5 min → multiple signatures without additional passkey prompts. |
| 🕶 **Zero snooping** | Vault lives in a different origin + sandboxed + `document.domain` locked. You can’t read it—even in devtools. |

...

> _“The best password is no password” → the best wallet is no seed phrase.  
> Welcome to passkey-powered web3 with **Portkey**._



























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