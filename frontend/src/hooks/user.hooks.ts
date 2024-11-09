import { useContext, useEffect, useState } from "react";
import { WalletConnectedContext } from "../app/UserWalletConnectedContext";
import { UserData } from "@stacks/connect";

export const useCurrentUserSession = () => {
  const userSession = useContext(WalletConnectedContext);
  if (!userSession)
    throw Error("useCurrentUserSession must be used inside of context.");
  return userSession;
};

export const useUserData = () => {
  const userSession = useCurrentUserSession();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      setUserData(userSession.loadUserData());
    }
  }, [userSession]);

  return userData;
};
