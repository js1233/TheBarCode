import { StackNavigationProp } from "@react-navigation/stack";
import { HomeStackParamList } from "routes/HomeStack";
import React, { FC, useEffect, useLayoutEffect, useState } from "react";
import { AppLog, TAG } from "utils/Util";
import { COLORS } from "config";
import { useNavigation } from "@react-navigation/native";
import HeaderTitle from "ui/components/headers/header_title/HeaderTitle";
import { NotificationView } from "ui/screens/home/more/notification/NotificationView";
import Notification from "models/Notification";
import { useNotificationPaginatedApis } from "repo/notification/NotificationApis";
import HeaderLeftTextWithIcon from "ui/components/headers/header_left_text_with_icon/HeaderLeftTextWithIcon";
import Cross from "assets/images/ic_cross.svg";
import useNotificationHandler from "hooks/useNotificationHandler";

type Props = {};

type HomeNavigationProp = StackNavigationProp<
  HomeStackParamList,
  "StaticContent"
>;

const NotificationController: FC<Props> = () => {
  AppLog.log(
    () => "App theme inside Notification : " + JSON.stringify(COLORS),
    TAG.THEME
  );
  const navigation = useNavigation<HomeNavigationProp>();
  const [notifications, setNotifications] = useState<
    Notification[] | undefined
  >(undefined);

  const {
    isLoading,
    request: fetchNotifications,
    isAllDataLoaded,
    onEndReached,
    onPullToRefresh
  } = useNotificationPaginatedApis(setNotifications).notification;

  AppLog.log(
    () => "OrderList: " + JSON.stringify(notifications),
    TAG.ORDERS
  );

  const { handleNotification } = useNotificationHandler();

  const navigateTOScreen = async (notification: Notification) => {
    const { screenName, params } = await handleNotification(notification);
    AppLog.log(() => "ScreenName: " + screenName, TAG.ORDERS);

    navigation.navigate(screenName, {
      ...params
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: "center",
      headerTitle: () => <HeaderTitle text={"Notifications"} />,
      headerLeft: () => (
        <HeaderLeftTextWithIcon
          onPress={() => navigation.pop()}
          icon={() => <Cross width={20} height={20} fill={"#737373"} />}
        />
      )
    });
  }, [navigation]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <NotificationView
      shouldShowProgressBar={isLoading}
      isAllDataLoaded={isAllDataLoaded}
      onEndReached={onEndReached}
      onPullToRefresh={onPullToRefresh}
      data={notifications!}
      navigateToScreen={navigateTOScreen}
    />
  );
};

export default NotificationController;
