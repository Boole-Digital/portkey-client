import React from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { PortkeyButton  } from 'react-background-iframe'
import { Create } from './Create';
import { Sign } from './Sign';


export default function App() {

  const createPageElement = <Create />;
  const signPageElement = (label: string, hide: boolean) => <Sign label={label} hide={hide} />;

  
  return (
      <>
        
        <nav style={{ }}>
          <Link to="/">Create</Link> | <Link to="/sign">Sign</Link> | <Link to="/sign2">Sign 2</Link> | <Link to="/nothing">Nothing</Link>
        </nav>
        <Routes>
          <Route path="/" element={createPageElement} />
          <Route path="/sign" element={signPageElement("hiii", false)} />
          <Route path="/sign2" element={signPageElement("heyy", false)} />
          <Route path="/nothing" element={signPageElement("heyyoo", true)} />
        </Routes>

        
      </>
  )
}