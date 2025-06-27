// verifyIframeHash.js
export async function verifyIframeHash({ url, expectedHash, onFailure }: any) {
    try {
      const res = await fetch(url);
      const html = await res.text();
  
      const hashBuffer = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(html)
      );
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
      console.log("Computed Hash:", hashHex);
  
      if (hashHex !== expectedHash) {
        console.error("❌ HASH MISMATCH — Possible tampering.");
        if (typeof onFailure === 'function') {
          onFailure(hashHex);
        } else {
          document.body.innerHTML = `
            <div style="color:red; font-family:sans-serif; padding:2rem; text-align:center;">
              <h1>⚠️ Security Error</h1>
              <p>Iframe hash does not match expected value. The page has been disabled.</p>
            </div>
          `;
          throw new Error("Aborting due to hash mismatch.");
        }
      } else {
        console.log("✅ Hash verified and trusted.");
      }
    } catch (err) {
      console.error("🔥 Verification failed:", err);
      document.body.innerHTML = `
        <div style="color:red; font-family:sans-serif; padding:2rem; text-align:center;">
          <h1>❌ Verification Error</h1>
          <p>Could not verify iframe integrity. The page has been disabled.</p>
        </div>
      `;
    }
  }
  