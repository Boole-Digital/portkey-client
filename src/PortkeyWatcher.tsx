import { useEffect } from 'react';

type PortkeyMessage = {
  source: 'iframe';
  command?: string;
  status?: string;
  result?: unknown;
  error?: string;
  [key: string]: any;
};

type PortkeyHandler = (msg: PortkeyMessage, origin: string) => void;

/**
 * usePortkeyWatcher
 * Listens to messages posted by a Portkey iframe.
 * 
 * @param handler Callback that receives validated Portkey messages
 * @param allowedOrigin The expected iframe origin (e.g., 'http://localhost:3002')
 */
export const usePortkeyWatcher = (
  handler: PortkeyHandler,
  allowedOrigin: string
) => {
  useEffect(() => {
    if (!allowedOrigin) {
      console.warn('usePortkeyWatcher: No allowedOrigin specified');
      return;
    }

    const messageHandler = (event: MessageEvent) => {
      if (
        event.origin !== allowedOrigin ||
        typeof event.data !== 'object' ||
        event.data?.source !== 'iframe'
      ) {
        return;
      }

      handler(event.data as PortkeyMessage, event.origin);
    };

    window.addEventListener('message', messageHandler);
    return () => window.removeEventListener('message', messageHandler);
  }, [handler, allowedOrigin]);
};
