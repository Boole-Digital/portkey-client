import { PortkeyButton } from 'react-background-iframe';
import React from 'react';

export const Create = React.memo(() => (
  <div>
    <PortkeyButton
      label="Create Wallet"
      buttonType="signup"
      origin="http://localhost:3002"
      command="signup"
      data={{ pubkey: 'abc123', skipVerification: true }}
    />
  </div>
));