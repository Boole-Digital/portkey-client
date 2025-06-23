import { PortkeyButton } from 'react-background-iframe';
import React from 'react';

type SignProps = {
  type: string;
  command: string;
  label: string;
  tx: string;
  hide: boolean;
};

export const Sign = React.memo(({ type, command, label, tx, hide }: SignProps) => (
  <div>
    <PortkeyButton
      label={label}
      buttonType={type}
      origin="http://localhost:3002"
      command={command}
      data={{
        "pubkey": '0QlsRJstsYum/+lehA3bcn4a02Y=',
        "wid": "c4b31af5-a783-49a9-b1a1-013dc369add1",
        "address": "0x0d96eBfABF30e86fa61CAc414EA869736f9Bf88c",
        "cipherText": "wGxrc3rbegvlvL2MbpmSiSizjydtZi6n5yKEtJcnvP+oymKggPoFR31VEsXYFK8W0lKAxYkmY/98KO5APtRrgOSChdl94oxwPkKwdURdxuAcSw==",
        "iv": "u34uz7FHxBzMTBC5",
        "salt": "ns3SYiURpT67ZfNxE/Vcb7aeOub9UvYMIbHyZDBVW+8=",
        "chain": "evm",
        "transaction": {
          data: tx,
          to: "0x0000000000000000000000000000000000000000"
        }
      }}
      hide={hide}
    />
  </div>
));
