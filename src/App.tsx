import { AppColorScheme, AppThemeProvider } from "hooks/theme";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { store } from "stores/store";
import { SplashView } from "ui/screens/auth/splash/SplashView";
import { AppLog, TAG } from "utils/Util";
import useNotificationHandler from "hooks/useNotificationHandler";
import { OpenedEvent } from "react-native-onesignal";
import { PushNotificationContext } from "hooks/usePushNotificationContextToNavigate";
import { PushNotification } from "utils/PushNotification";
import { withIAPContext } from "react-native-iap";

type Props = {};

const App: React.FC<Props> = () => {
  AppLog.log(() => "Rendering App...");

  const { data: notificationUpdate, handleNotification } =
    useNotificationHandler();

  const notificationOpenedHandler = (data: OpenedEvent) => {
    const { additionalData } = data.notification;

    AppLog.log(
      () =>
        "OneSignal: setNotificationOpenedHandler: " +
        JSON.stringify(additionalData),
      TAG.VENUE
    );
    handleNotification(additionalData);
  };

  PushNotification.init(notificationOpenedHandler);

  return (
    <AppThemeProvider colorScheme={AppColorScheme.LIGHT}>
      <Provider store={store}>
        <SafeAreaProvider>
          <PushNotificationContext.Provider value={notificationUpdate}>
            <SplashView />
          </PushNotificationContext.Provider>
        </SafeAreaProvider>
      </Provider>
    </AppThemeProvider>
  );
};
export default withIAPContext(App);
