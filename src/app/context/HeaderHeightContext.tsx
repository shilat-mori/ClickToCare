import React, { createContext, useContext, useState, ReactNode } from 'react';

interface HeaderHeightContextType {
  headerHeight: number;
  setHeaderHeight: (height: number) => void;
}

const HeaderHeightContext = createContext<HeaderHeightContextType | undefined>(undefined);

export const HeaderHeightProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [headerHeight, setHeaderHeight] = useState<number>(80);

  return (
    <HeaderHeightContext.Provider value={{ headerHeight, setHeaderHeight }}>
      {children}
    </HeaderHeightContext.Provider>
  );
};

export const useHeaderHeight = (): HeaderHeightContextType => {
  const context = useContext(HeaderHeightContext);
  if (!context) {
    throw new Error('useHeaderHeight must be used within a HeaderHeightProvider');
  }
  return context;
};
