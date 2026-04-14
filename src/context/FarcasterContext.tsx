import React, { createContext, useContext, useEffect, useState } from 'react';
import sdk from '@farcaster/frame-sdk';

interface FarcasterContextType {
  context: any; // Using any for compatibility with different SDK versions
  loading: boolean;
  isFrame: boolean;
}

const FarcasterContext = createContext<FarcasterContextType | undefined>(undefined);

export function FarcasterProvider({ children }: { children: React.ReactNode }) {
  const [context, setContext] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFrame, setIsFrame] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        // Check if we are in a Farcaster frame
        const frameContext = await sdk.context;
        if (frameContext) {
          setContext(frameContext);
          setIsFrame(true);
          // Notify Farcaster that the frame is ready
          sdk.actions.ready();
        }
      } catch (error) {
        console.error('Farcaster SDK init failed:', error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  return (
    <FarcasterContext.Provider value={{ context, loading, isFrame }}>
      {children}
    </FarcasterContext.Provider>
  );
}

export function useFarcaster() {
  const context = useContext(FarcasterContext);
  if (context === undefined) {
    throw new Error('useFarcaster must be used within a FarcasterProvider');
  }
  return context;
}
