import { AppConfig, showConnect, UserSession } from "@stacks/connect";

const appConfig = new AppConfig(["store_write", "publish_data"]);

export const userSession = new UserSession({ appConfig });

export const authenticateUser = () => {
  showConnect({
    appDetails: {
      name: "Stacks Prediction Market",
      icon: window.location.origin + "/vite.svg",
    },
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
