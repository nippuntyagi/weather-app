import React, { createContext, useState, useContext, FC, ReactNode } from 'react';

// Define types for your state
interface AppState {
  place: string;
  setPlace:(newPlace: string) => void;
  loadingCity: boolean;
  setLoadingCity: (lodcity: boolean) => void
}

// Create a context
const AppStateContext = createContext<AppState | undefined>(undefined);

type AppStateProviderProps = {
    children: ReactNode;
};
// Create a provider
export const AppStateProvider = ({ children } : AppStateProviderProps) => {
    const [place, setPlace] = useState<string>('Republic of India');
    const [loadingCity, setLoadingCity] = useState<boolean>(false);


  const state: AppState = { place, loadingCity, setPlace, setLoadingCity };

  return (
    <AppStateContext.Provider value={state}>
      {children}
    </AppStateContext.Provider>
  );
};

// Custom hook to consume the context
export const useAppState = (): AppState => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};