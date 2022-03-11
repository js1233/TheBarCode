import Notification from "models/Notification";
import NotificationType from "models/enums/NotificationType";
import { useState } from "react";
import { PushNotificationContext } from "hooks/usePushNotificationContextToNavigate";
import { HomeStackParamList } from "routes/HomeStack";
import { AppLog, TAG } from "utils/Util";
import EScreen from "models/enums/EScreen";
import { HomeBottomBarParamsList } from "routes/HomeBottomBar";
import { WalletTabsParamsList } from "ui/screens/home/more/wallet/WalletMaterialTabs";
import { VenueDetailsTopTabsParamList } from "routes/VenueDetailsTopTabs";

type HandleNotificationLiteralType = {
  [key: string]: () => void;
};

const useNotificationHandler = () => {
  const [data, setData] = useState<PushNotificationContext>({
    screenName: "Home"
  });

  function handleNotification(
    notification: Notification
  ): PushNotificationContext {
    const notificationActions: HandleNotificationLiteralType = {
      [NotificationType.CHALKBOARD]: () =>
        navigateToVenueDetails(notification),
      [NotificationType.EDITS]: () => navigateToEditsScreen(notification),
      [NotificationType.EVENT]: () => navigateToVenueDetails(notification),
      [NotificationType.EXCLUSIVE]: () =>
        navigateToVenueDetails(notification),
      [NotificationType.GENERAL]: () =>
        navigateNotificationScreen(notification),
      [NotificationType.SHARE_OFFER]: () =>
        navigateToShareOffer(notification),
      [NotificationType.ORDER]: () => navigateToOrder(notification),
      [NotificationType.VOUCHER]: () =>
        navigateToVenueDetails(notification)
    };

    // @ts-ignore
    return notificationActions[notification.type]?.();
  }

  function navigateNotificationScreen(notification: Notification) {
    let name: keyof HomeStackParamList = "Notification";
    AppLog.log(() => "Notification function" + notification, TAG.VENUE);
    let _data = {
      screenName: name
    };
    setData(_data);
    return _data;
  }

  function navigateToEditsScreen(notification: Notification) {
    let name: keyof HomeStackParamList = "Home";
    AppLog.log(
      () => "Notification Edit function: " + notification.type,
      TAG.VENUE
    );
    let _data = {
      screenName: name,
      params: {
        isFrom: EScreen.PUSH_NOTIFICATION,
        initialRoute: "Trending" as keyof HomeBottomBarParamsList
      }
    };
    setData(_data);
    return _data;
  }

  function navigateToVenueDetails(notification: Notification) {
    let name: keyof HomeStackParamList = "VenueDetails";
    AppLog.log(
      () =>
        "Notification ChalkBoard function: " +
        notification.type +
        "notification => " +
        JSON.stringify(notification),
      TAG.VENUE
    );
    let _data = {
      screenName: name,
      params: {
        isFrom: EScreen.PUSH_NOTIFICATION,
        initialRoute: "WhatsOn" as keyof VenueDetailsTopTabsParamList,
        notification: notification
      }
    };
    setData(_data);
    return _data;
  }

  function navigateToShareOffer(notification: Notification) {
    let name: keyof HomeStackParamList = "Wallet";
    AppLog.log(
      () => "Notification Share Offer function: " + notification.type,
      TAG.VENUE
    );
    let _data = {
      screenName: name,
      params: {
        initialRouteName: "Shared" as keyof WalletTabsParamsList,
        initialSegmentIndex: 0
      }
    };
    setData(_data);
    return _data;
  }

  function navigateToOrder(notification: Notification) {
    let name: keyof HomeStackParamList = "OrderDetails";
    AppLog.log(
      () => "Notification Order function: " + notification.type,
      TAG.VENUE
    );
    let _data = {
      screenName: name,
      params: {
        order_id: notification.order_id ?? notification.order?.id
      }
    };
    setData(_data);
    return _data;
  }

  return {
    data: data,
    handleNotification: (notification: Notification) =>
      handleNotification(notification)
  };
};

export default useNotificationHandler;
