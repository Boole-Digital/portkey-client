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
        zIndex: 1,
        width: '30vw',
        height: '20vh',
        overflow: 'hidden',
        pointerEvents: 'auto'
      }}>
        <iframe
          id="portkey"
          allow="publickey-credentials-create *; publickey-credentials-get *"
          src={iframeSrc}
          title="Background Iframe"
          style={{
            width: '100%',
            height: '100%',
            border: 'none'
          }}
        />
      </div>
      {children}
    </BackgroundIframeContext.Provider>
  );
};
