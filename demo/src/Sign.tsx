import { PortkeyButton } from 'portkey-client';
import React from 'react';

type SignProps = {
  type: string;
  command: string;
  label: string;
  hide: boolean;
  data: {
    pubkey: string;
    wid: string;
    address: string;
    cipherText: string;
    iv: string;
    salt: string;
    chain: string;
    transaction: {
      data: string;
      to: string;
    };
  };
};

export const Sign = React.memo(({ type, command, label, hide, data }: SignProps) => (
  <div>
    <PortkeyButton
      label={label}
      buttonType={type}
      origin="http://localhost:3002"
      command={command}
      data={data}
      hide={hide}
    />
  </div>
));
