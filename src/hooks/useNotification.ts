import { useState } from "react";
import { AppLog, TAG } from "utils/Util";
import { PushNotificationContext } from "hooks/usePushNotificationContextToNavigate";
import Notification from "models/Notification";

enum NotificationType {
  GENERAL = "general",
  EXCLUSIVE = "exclusive"
}

// type NotificationData = {
//   type: NotificationType;
//   orderId: number;
//   venueId: number;
// };

export const toNotificationData = (notificationPayload: any) => {
  AppLog.log(
    () => "NotiifcationType: " + notificationPayload.type,
    TAG.VENUE
  );
  return {
    // title: notificationPayload.data.title,
    // order_id: notificationPayload.data.order_id,
    type: notificationPayload.type
    // establishment_id: notificationPayload.data.establishment_id
  };
};

const useNotification = () => {
  // const { notificationCount, setNotificationCount } =
  //   useContext(AppDataContext);
  const [data, setData] = useState<PushNotificationContext>({
    screenName: "Home"
  });

  function handleNotification(notification: Notification) {
    AppLog.log(
      () => `notification data: ${notification}`,
      TAG.NOTIFICATION
    );

    switch (notification.type) {
      case NotificationType.EXCLUSIVE:
        setData({
          screenName: "Notification"
        });
        break;
    }
  }

  // const addCount = useCallback(
  //   (notification: NotificationData) => {
  //     if (
  //       notificationCount !== undefined &&
  //       notificationCount.venueId === notification.venueId
  //     ) {
  //       setNotificationCount((prevState) => {
  //         return {
  //           ...prevState!!,
  //           notificationCount: prevState!!.notificationCount + 1
  //         };
  //       });
  //     }
  //   },
  //   [notificationCount, setNotificationCount]
  // );

  return {
    // notificationCount,
    //setNotificationCount,
    data,
    handleNotification
    // addCount
  };
};

export default useNotification;
