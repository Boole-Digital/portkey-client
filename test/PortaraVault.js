import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
const PortaraVault = ({ vaultUrl, onSignup, onSign, onError }) => {
    const iframeRef = useRef(null);
    const trustedOrigin = new URL(vaultUrl).origin;
    useEffect(() => {
        const listener = (event) => {
            if (event.origin !== trustedOrigin || event.data?.source !== "iframe")
                return;
            const { command, result, error } = event.data;
            if (error && onError)
                return onError(new Error(error));
            if (command === "signup")
                onSignup(result);
            if (command === "signTransaction")
                onSign(result);
        };
        window.addEventListener("message", listener);
        return () => window.removeEventListener("message", listener);
    }, [vaultUrl]);
    const postMessage = (command, data) => {
        iframeRef.current?.contentWindow?.postMessage({ id: Date.now(), command, data, source: "parent" }, trustedOrigin);
    };
    const signup = () => postMessage("signup");
    const signTransaction = (walletData) => postMessage("signTransaction", walletData);
    // Optional: expose these through refs or prop callbacks if needed
    window.portaraSignup = signup;
    window.portaraSign = signTransaction;
    return (_jsx("iframe", { ref: iframeRef, src: vaultUrl, title: "Portara Vault", sandbox: "allow-scripts allow-same-origin", allow: "publickey-credentials-create *; publickey-credentials-get *", style: { width: 0, height: 0, border: "none" } }));
};
export default PortaraVault;
