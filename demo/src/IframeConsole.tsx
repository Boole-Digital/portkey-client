import React, { useRef, useState, useEffect } from 'react';
import { usePortkeyWatcher } from 'react-background-iframe'; // adjust path if needed

const allowedOrigin = 'http://localhost:3002';

export const IframeConsole: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const logRef = useRef<HTMLDivElement>(null);

  usePortkeyWatcher((msg, origin) => {
    const timestamp = new Date().toLocaleTimeString();
    const message = `[${timestamp}] [${origin}]\n${JSON.stringify(msg, null, 2)}`;
    setLogs(prev => [...prev.slice(-200), message]);
  }, allowedOrigin);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [logs]);

  return (
    <div
      ref={logRef}
      style={{
        fontFamily: 'monospace',
        background: '#1e1e1e',
        color: '#00ff88',
        borderLeft: '2px solid #333',
        padding: '1rem',
        height: '100vh',
        overflowY: 'auto',
        width: '1000px',
      }}
    >
      {logs.length === 0 ? (
        <p style={{ color: '#555' }}>No data detected leaking.</p>
      ) : (
        logs.map((msg, i) => (
          <pre key={i} style={{ whiteSpace: 'pre-wrap', marginBottom: '1rem' }}>
            {msg}
          </pre>
        ))
      )}
    </div>
  );
};
