import React, { createContext, useContext, ReactNode } from 'react';
import getConfig from '../config';

// Create a context
const ConfigContext = createContext(undefined);

// Create a custom hook to access the context
export const useConfig = () => useContext(ConfigContext);

// Define the type for children prop
interface ConfigProviderProps {
  children: ReactNode;
}

// Context Provider component
export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
  const config = getConfig();

  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  );
};
