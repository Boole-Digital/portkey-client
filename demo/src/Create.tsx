import { PortkeyButton } from 'portkey-client';
import React from 'react';

export const Create = React.memo(() => (
  <div

  >
    <h2 style={{}}>🛠️ Create Wallet</h2>
    <p style={{ }}>
      Generate a new wallet securely using a passkey.
    </p>

      <PortkeyButton
        label="✨ Create Wallet"
        buttonType="signup"
        origin="http://localhost:3002"
        command="signup"
        data={{ pubkey: 'abc123', skipVerification: true }}
        hide={false}
      />
  </div>
));
