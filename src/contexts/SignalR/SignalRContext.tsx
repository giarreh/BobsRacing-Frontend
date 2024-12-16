import React, { createContext, useContext, useEffect } from 'react';
import signalRService from './SignalRService';

const SignalRContext = createContext(signalRService);

export const SignalRProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const startSignalR = async () => {
      await signalRService.startConnection('https://localhost:7181/raceSimulationHub');
    };
    startSignalR();

    return () => {
      signalRService.stopConnection();
    };
  }, []);

  return (
    <SignalRContext.Provider value={signalRService}>
      {children}
    </SignalRContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSignalR = () => useContext(SignalRContext);
