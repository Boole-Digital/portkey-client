import React, { useEffect } from 'react';
import { signEthereumTransaction } from './ActionModule';

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
  className
}: any) => {
//   const handleClick = async () => {
//     const iframe = document.getElementById('portkey') as HTMLIFrameElement | null;

//     if (!iframe || !iframe.contentWindow) {
//       console.warn('Iframe not ready');
//       return;
//     } 
//     await signEthereumTransaction({
//         iframe,
//         vaultOrigin: origin,
//         pubkey: data.pubkey,
//         vault: {
//             iv: "u34uz7FHxBzMTBC5",
//             cipherText: "ns3SYiURpT67ZfNxE/Vcb7aeOub9UvYMIbHyZDBVW+8=",
//             salt: "ns3SYiURpT67ZfNxE/Vcb7aeOub9UvYMIbHyZDBVW+8="
//         },
//         transactionBase64: "0x",
//         onSigned: () => { console.log("SIGNED HAPPY DAYS")},
//         onError: () => { console.log("ERROR SAD DAYS")},
//     })
//   };

    useEffect(() => {
        const iframe = document.getElementById('portkey') as HTMLIFrameElement | null;
        if (!iframe || !iframe.contentWindow) {
          console.warn('Iframe is not accessible when ready message received');
          return;
        }

        console.log("sending clearButton")

        iframe.contentWindow.postMessage(
            {
                id,
                command: 'clearButton',
                source: 'parent',
            },
            origin
        );

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
                id
              }
            },
            origin
          );
    }, [label]);

  useEffect(() => {

    console.log("change label", label)
    const handleIframeReady = (event: MessageEvent) => {

        if (event.origin !== origin) return;
        if (event.data?.status !== 'ready' || event.data?.source !== 'iframe') return;
    
        console.log("Received 'ready' from iframe");
    
        const iframe = document.getElementById('portkey') as HTMLIFrameElement | null;
        if (!iframe || !iframe.contentWindow) {
          console.warn('Iframe is not accessible when ready message received');
          return;
        }

        console.log("sending clearButton")

        iframe.contentWindow.postMessage(
            {
                id,
                command: 'clearButton',
                source: 'parent',
            },
            origin
        );

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
            id
          }
        },
        origin
      );
    };
  
    window.addEventListener('message', handleIframeReady);
    return () => {
        window.removeEventListener('message', handleIframeReady)
    };
  }, [label]);


  
  

  return (<></>);
};
