// BackgroundIframeContext.tsx
import React, { createContext, useContext } from 'react';

type MountTarget = HTMLElement | null;

export const BackgroundIframeContext = createContext<{
  iframeSrc: string;
  setIframeSrc: (src: string) => void;
  mountTo: MountTarget;
  setMountTo: (el: MountTarget) => void;
  parkingSlotRef: React.RefObject<HTMLDivElement>;
} | null>(null);

export const useBackgroundIframe = () => {
  const ctx = useContext(BackgroundIframeContext);
  if (!ctx) throw new Error('Must be used inside BackgroundIframeProvider');
  return ctx;
};
