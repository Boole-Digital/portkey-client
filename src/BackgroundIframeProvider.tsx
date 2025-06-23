// BackgroundIframeProvider.tsx
import React, { useRef, useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { BackgroundIframeContext } from './BackgroundIframeContext';
import { PortkeyButton } from './PortkeyButton';

export const BackgroundIframeProvider = ({ children, initialSrc = 'about:blank' }) => {
  const [iframeSrc, setIframeSrc] = useState(initialSrc);
  const [mountTo, setMountTo] = useState<HTMLElement | null>(null);
  const parkingSlotRef = useRef<HTMLDivElement>(null);

  const iframeElement = useMemo(() => (
    <iframe
      id="portkey"
      allow="publickey-credentials-create *; publickey-credentials-get *"
      src={iframeSrc}
      title="Portkey"
      style={{
        width: '300px',
        height: '47px',
        border: 'none',
        zIndex: 1000,
        backgroundColor: 'transparent',
        pointerEvents: 'auto',
        borderRadius: '12px',
        overflow: 'hidden',
        display: 'block',
      }}
    />
  ), [iframeSrc]);

  console.log(mountTo, parkingSlotRef.current)
  const renderTarget = mountTo || parkingSlotRef.current;

  useEffect(() => {
    const testIframeSecurity = () => {
        const iframe = document.getElementById('portkey') as HTMLIFrameElement | null;
        if (!iframe || !iframe.contentWindow) return;
    
        try {
          // Attempt to read from cross-origin iframe — should throw
          const iframeDoc = iframe.contentWindow.document;
          console.error(
            '[SECURITY WARNING] You should NOT be able to access iframe document. Check your CSP or iframe origin!'
          );
        } catch (err) {
          console.log('[✅] Portkey iframe is cross-origin isolated — content access is blocked as expected.');
        }
    };

    const handleReady = (event: MessageEvent) => {
      if (event.data?.status !== 'ready' || event.data?.source !== 'iframe') return;
      testIframeSecurity();
    };

    window.addEventListener('message', handleReady);
    return () => window.removeEventListener('message', handleReady);
  }, []);

  return (
    <BackgroundIframeContext.Provider value={{ iframeSrc, setIframeSrc, mountTo, setMountTo, parkingSlotRef }}>
      {children}
      <div ref={parkingSlotRef} style={{width: "300px", height: "47px", position: 'absolute', top: '0px', left: '0px',}}>
        
      </div>
      {renderTarget && createPortal(iframeElement, renderTarget)}

      
    </BackgroundIframeContext.Provider>
  );
};
