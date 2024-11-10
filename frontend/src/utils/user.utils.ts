import { AppConfig, showConnect, UserSession } from "@stacks/connect";

const appConfig = new AppConfig(["store_write", "publish_data"]);

export const appDetails = {
  name: "Stacks Prediction Market",
  icon: window.location.origin + "/vite.svg",
};

export const userSession = new UserSession({ appConfig });

export const authenticateUser = () => {
  showConnect({
    appDetails,
    redirectTo: "/",
    onFinish: () => {
      window.location.reload();
    },
    userSession,
  });
};

export const signOutUser = () => {
  userSession.signUserOut("/");
};
