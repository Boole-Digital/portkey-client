// PortkeyButton.tsx
import React, { useEffect, useRef } from 'react';
import { useBackgroundIframe } from './BackgroundIframeContext';

interface PortkeyButtonProps {
  label: string;
  command: string;
  origin: string;
  buttonType: string;
  iframeLabel?: string;
  id?: number;
  data?: Record<string, any>;
  className?: string;
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
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { setMountTo, setIframeSrc } = useBackgroundIframe();

  const sendIframeMessages = () => {
    const iframe = document.getElementById('portkey') as HTMLIFrameElement | null;
    if (!iframe?.contentWindow) return;

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
      setMountTo(ref.current);
      setIframeSrc(origin); // optional: only if needed
      sendIframeMessages();
    }

    return () => {
      // Optional: remove mount if unmounted, or leave if persistent across routes
      setMountTo(null);
    };
  }, [label]);

  useEffect(() => {
    const handleReady = (event: MessageEvent) => {
      if (event.origin !== origin) return;
      if (event.data?.status !== 'ready' || event.data?.source !== 'iframe') return;
      sendIframeMessages();
    };

    window.addEventListener('message', handleReady);
    return () => window.removeEventListener('message', handleReady);
  }, []);

  return <div ref={ref} className={className} style={{ display: 'inline-block', width: 300, height: 47 }} />;
};
