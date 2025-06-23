// PortkeyButton.tsx
import React, { useEffect, useRef } from 'react';
import { useBackgroundIframe } from './BackgroundIframeContext';


// Todo remove hide quick fix
// Issue is that if i dont render the button, the IFRAME ref gets lost.
// Made a bad fix so that i just render it on all pages but hide it.

interface PortkeyButtonProps {
  label: string;
  command: string;
  origin: string;
  buttonType: string;
  iframeLabel?: string;
  id?: number;
  data?: Record<string, any>;
  className?: string;
  hide: any;
}
export const PortkeyButton: React.FC<PortkeyButtonProps> = ({
  label,
  command,
  origin,
  buttonType,
  iframeLabel,
  id = 1,
  data = {},
  className,
  hide
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { iframeRef, setIframeSrc, moveIframeTo } = useBackgroundIframe();

  const transaction = data?.transaction?.data || label;

  const sendIframeMessages = () => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;

    iframe.style.display = hide ? 'none' : 'block';

    iframe.contentWindow.postMessage({ id, command: 'clearButton', source: 'parent' }, origin);
    iframe.contentWindow.postMessage(
      {
        id,
        command: 'showButton',
        source: 'parent',
        data: {
          label: iframeLabel || label,
          buttonType,
          command,
          data,
          id,
        },
      },
      origin
    );
  };

  useEffect(() => {
    if (ref.current) {
      setIframeSrc(origin);
      moveIframeTo(ref.current);
      sendIframeMessages();
    }

    return () => {
      const iframe = iframeRef.current;
      if (iframe) {
        iframe.style.display = 'none';
      }
    }
  }, [label, transaction]);

  useEffect(() => {
    const handleReady = (event: MessageEvent) => {
      if (event.origin !== origin) return;
      if (event.data?.status !== 'ready' || event.data?.source !== 'iframe') return;
      sendIframeMessages();
    };

    window.addEventListener('message', handleReady);
    return () => window.removeEventListener('message', handleReady);
  }, []);

  return <div ref={ref} className={className} style={{ width: 300, height: 47, visibility: hide ? 'hidden' : 'visible' }} />;
};
