import { createContext, useContext, ReactNode } from 'react';

const ConsentContext = createContext<boolean>(false);

export const useConsent = () => useContext(ConsentContext);

export const ConsentProvider = ({ children, hasConsent }: { children: ReactNode, hasConsent: boolean }) => {
  return <ConsentContext.Provider value={hasConsent}>{children}</ConsentContext.Provider>;
};
