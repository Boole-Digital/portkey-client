// BackgroundIframeProvider.tsx
import React, { useRef, useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { BackgroundIframeContext } from './BackgroundIframeContext';
import { PortkeyButton } from './PortkeyButton';

// BackgroundIframeProvider.tsx
export const BackgroundIframeProvider = ({ children, initialSrc = 'about:blank' }) => {
  const [iframeSrc, setIframeSrc] = useState(initialSrc);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const moveIframeTo = (targetEl: HTMLElement | null) => {
    const iframe = iframeRef.current;
    if (!iframe || !targetEl) return;

    const rect = targetEl.getBoundingClientRect();
    iframe.style.position = 'absolute';
    iframe.style.top = `${window.scrollY + rect.top}px`;
    iframe.style.left = `${window.scrollX + rect.left}px`;
  };

  const contextValue = useMemo(() => ({
    setIframeSrc,
    iframeRef,
    moveIframeTo,
  }), []);

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
          console.log('[✅] Portkey is cross-origin isolated — Confirmed content access is blocked.');
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
    <BackgroundIframeContext.Provider value={contextValue}>
      {children}
      <iframe
        id="portkey"
        allow="publickey-credentials-create *; publickey-credentials-get *"
        ref={iframeRef}
        src={iframeSrc}
        style={{
          width: '300px',
          height: '47px',
          border: 'none',
          zIndex: 1000,
          backgroundColor: 'transparent',
          display: 'none', // hidden by default
          pointerEvents: 'auto',
        }}
      />
    </BackgroundIframeContext.Provider>
  );
};
