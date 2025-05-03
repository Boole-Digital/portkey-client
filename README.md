# 🔐 Portkey - decentralised passkey secured crypto wallet

A **next-generation crypto wallet** that uses **passkeys** to create and manage user accounts—**no extensions, no seed phrases, no third-party custodians.** Just your passkey, your browser, your wallet.

---

## 🚀 Features

- **Passkey-Based Authentication**  
  Users register and authenticate using passkeys—natively supported by most mobile and desktop devices. Think apple pay user experience.

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


