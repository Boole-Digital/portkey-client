import React, { useState, ReactNode } from 'react';
import { BackgroundIframeContext } from './BackgroundIframeContext';

interface BackgroundIframeProviderProps {
  children: ReactNode;
  initialSrc?: string;
}

export const BackgroundIframeProvider: React.FC<BackgroundIframeProviderProps> = ({
  children,
  initialSrc = 'about:blank'
}) => {
  const [iframeSrc, setIframeSrc] = useState(initialSrc);

  return (
    <BackgroundIframeContext.Provider value={{ iframeSrc, setIframeSrc }}>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        // height: 0,
        // width: 0,
        zIndex: 1,
        padding:0,
        margin:0,
        background:"rgba(0,0,0,0)",
        overflow: 'visible',
        pointerEvents: 'auto'
      }}>
        <iframe
          id="portkey"
          allow="publickey-credentials-create *; publickey-credentials-get *"
          src={iframeSrc}
          title="Background Iframe"
          style={{
            position: 'fixed',
            // bottom: '20px',
            // right: '20px',
            width: '300px',
            height: '47px',
            border: 'none',
            zIndex: 1000,
            backgroundColor: 'transparent',
            pointerEvents: 'auto',
            borderRadius: "12px",
            overflow: "hidden"
          }}
        />
      </div>
      {children}
    </BackgroundIframeContext.Provider>
  );
};
