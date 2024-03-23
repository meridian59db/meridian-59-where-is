import React, { createContext, useState, useContext } from 'react';
import { ProviderProps } from '../types/provider.props';

type ContextType = {
  userData: any;
  setUserData: React.Dispatch<React.SetStateAction<any>>;
};

const UserDataContext = createContext<ContextType | undefined>(undefined);

export default function UserDataProvider({
  children,
}: ProviderProps): JSX.Element {
  const [userData, setUserData] = useState({});

  return (
    <UserDataContext.Provider
      value={{
        userData,
        setUserData,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
}

export const useUserData = (): ContextType => {
  const context = useContext(UserDataContext);

  if (!context) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }

  return context;
};
