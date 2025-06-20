import React from 'react';

interface PortkeyButtonProps {
  label: string; // Text to show on the React-level button
  command: string; // Command the iframe button should send when clicked
  origin: string; // The iframe origin (e.g. "http://localhost:3002")
  buttonType: string;
  iframeLabel?: string; // Optional label to show inside the iframe button
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
  className
}) => {
  const handleClick = () => {
    const iframe = document.getElementById('portkey') as HTMLIFrameElement | null;

    if (!iframe || !iframe.contentWindow) {
      console.warn('Iframe not ready');
      return;
    }

    iframe.contentWindow.postMessage(
      {
        id,
        command: 'showButton', // always show button in iframe
        source: 'parent',
        data: {
          label: iframeLabel || label,
          buttonType,
          command,
          data,
          id
        }
      },
      origin
    );
  };

  return (
    <button className={className} onClick={handleClick}>
      {label}
    </button>
  );
};
