import React, { useRef, useState, useMemo, useEffect } from 'react';
import { BackgroundIframeContext } from './BackgroundIframeContext';

interface BackgroundIframeProviderProps {
  children: React.ReactNode;
  initialSrc?: string;
}

export const BackgroundIframeProvider: React.FC<BackgroundIframeProviderProps> = ({
  children,
  initialSrc = 'about:blank',
}) => {
  const [iframeSrc, setIframeSrc] = useState(initialSrc);
  const [mountTo, setMountTo] = useState<HTMLElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const parkingSlotRef = useRef<HTMLDivElement>(null);

  const moveIframeTo = (targetEl: HTMLElement | null) => {
    const iframe = iframeRef.current;
    if (!iframe || !targetEl) return;

    const rect = targetEl.getBoundingClientRect();
    iframe.style.position = 'absolute';
    iframe.style.top = `${window.scrollY + rect.top}px`;
    iframe.style.left = `${window.scrollX + rect.left}px`;
  };

  const contextValue = useMemo(
    () => ({
      iframeSrc,
      setIframeSrc,
      mountTo,
      setMountTo,
      parkingSlotRef,
      iframeRef,
      moveIframeTo,
    }),
    [iframeSrc]
  );

  useEffect(() => {
    const testIframeSecurity = () => {
      const iframe = document.getElementById('portkey') as HTMLIFrameElement | null;
      if (!iframe || !iframe.contentWindow) return;

      try {
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
      <div ref={parkingSlotRef} style={{ display: 'none' }} />
      <iframe
        id="portkey"
        allow="publickey-credentials-create *; publickey-credentials-get *"
        ref={iframeRef}
        src={iframeSrc}
        style={{
          width: '300px',
          height: '53px',
          border: 'none',
          zIndex: 1000,
          backgroundColor: 'transparent',
          display: 'none',
          pointerEvents: 'auto',
          overflow: 'visible',
        }}
      />
    </BackgroundIframeContext.Provider>
  );
};
