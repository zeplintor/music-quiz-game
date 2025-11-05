
import React from 'react';
import { useGA4 } from '@/hooks/useGA4';

interface GA4ProviderProps {
  children: React.ReactNode;
}

const GA4Provider: React.FC<GA4ProviderProps> = ({ children }) => {
  // Initialize GA4 tracking
  useGA4();

  return <>{children}</>;
};

export default GA4Provider;
