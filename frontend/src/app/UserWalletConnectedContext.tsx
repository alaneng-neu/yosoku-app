import { UserSession } from "@stacks/connect";
import { createContext, ReactNode } from "react";
import { userSession } from "../utils/UserSession";

export const WalletConnectedContext = createContext<UserSession | undefined>(
  undefined
);

interface AppWalletConnectedContextProps {
  children: ReactNode;
}

export const AppWalletConnectedContext: React.FC<
  AppWalletConnectedContextProps
> = ({ children }) => {
  return (
    <WalletConnectedContext.Provider value={userSession}>
      {children}
    </WalletConnectedContext.Provider>
  );
};

export default AppWalletConnectedContext;
