import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { BackgroundIframeProvider, PortkeyButton  } from 'react-background-iframe'


export default function App() {

  // const handleClick = () => {
  //   signSolanaTransaction(
  //     'BASE64_ENCODED_TX',
  //     {
  //       cipherText: 'abc',
  //       iv: 'def',
  //       salt: 'ghi',
  //     },
  //     'pubkey123'
  //   );
  // };
  return (
    <BackgroundIframeProvider initialSrc="http://localhost:3002">
      <BrowserRouter>
        <nav style={{ padding: '1rem' }}>
          <Link to="/">Home</Link> | <Link to="/about">About</Link>
        </nav>
        <Routes>
          <Route path="/" element={
            <div style={{ padding: '2rem', color: 'white' }}>
              <PortkeyButton
                label="Create Wallet"
                buttonType="create"
                origin="http://localhost:3002"
                command="signup"
                data={{
                  pubkey: 'abc123',
                  skipVerification: true
                }}
              />




              <PortkeyButton
                label="Sign Transaction"
                buttonType="signEthTx"
                origin="http://localhost:3002"
                command="signEthereumTransaction"
                data={{
                  "pubkey": '0QlsRJstsYum/+lehA3bcn4a02Y=',
                  "wid": "c4b31af5-a783-49a9-b1a1-013dc369add1",
                  "address": "0x0d96eBfABF30e86fa61CAc414EA869736f9Bf88c",
                  "cipherText": "wGxrc3rbegvlvL2MbpmSiSizjydtZi6n5yKEtJcnvP+oymKggPoFR31VEsXYFK8W0lKAxYkmY/98KO5APtRrgOSChdl94oxwPkKwdURdxuAcSw==",
                  "iv": "u34uz7FHxBzMTBC5",
                  "salt": "ns3SYiURpT67ZfNxE/Vcb7aeOub9UvYMIbHyZDBVW+8=",
                  "chain": "evm"
                }}
              />
            </div>
          } />
          <Route path="/about" element={<h1>About</h1>} />
        </Routes>
      </BrowserRouter>
    </BackgroundIframeProvider>
  )
}