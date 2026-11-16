import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ size = 28, text = 'Loading...' }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem', gap: '0.75rem' }}>
      <Loader2 className="animate-spin text-pink" size={size} />
      {text && <p className="text-small text-muted">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;

