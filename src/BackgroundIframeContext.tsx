import { createContext } from 'react';

export interface BackgroundIframeContextType {
  iframeSrc: string;
  setIframeSrc: (src: string) => void;
}

// 👇 Create the context with a non-null default (or `null` + runtime check later)
export const BackgroundIframeContext = createContext<BackgroundIframeContextType>({
  iframeSrc: 'about:blank',
  setIframeSrc: () => {}
});
