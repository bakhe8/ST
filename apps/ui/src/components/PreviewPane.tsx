import React, { useEffect, useRef } from 'react';

interface PreviewPaneProps {
  url: string;
  style?: React.CSSProperties;
}

const PreviewPane: React.FC<PreviewPaneProps> = ({ url, style }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.src = url;
    }
  }, [url]);

  return (
    <div style={{ border: '1px solid #eee', borderRadius: 8, overflow: 'hidden', ...style }}>
      <iframe
        ref={iframeRef}
        src={url}
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Live Preview"
      />
    </div>
  );
};

export default PreviewPane;
