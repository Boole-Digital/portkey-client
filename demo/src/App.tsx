import React from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { PortkeyButton  } from 'react-background-iframe'
import { Create } from './Create';
import { Sign } from './Sign';


export default function App() {

  const createPageElement = <Create />;
  const signPageElement = (type: string, command: string, label: string, tx: string, hide: boolean) => <Sign type={type} command={command} label={label} tx={tx} hide={hide} />;

  return (
      <>
        <nav style={{ }}>
          <Link to="/">Create</Link> | <Link to="/sign">Sign</Link> | <Link to="/sign2">Sign 2</Link> | <Link to="/nothing">Nothing</Link>
        </nav>
        <Routes>
          <Route path="/" element={createPageElement} />
          <Route path="/sign" element={signPageElement("signSolTx","signSolanaTransaction", "Confirm", "0x00", false)} />
          <Route path="/sign2" element={signPageElement("signEthTx","signEthereumTransaction", "Confirm",  "0x11", false)} />
          <Route path="/nothing" element={<></>}/>
        </Routes>
      </>
  )
}