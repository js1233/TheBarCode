import React, { FC, useCallback, useEffect } from "react";
import { HomeBottomBarRoutes } from "routes/HomeBottomBarRoutes";
import { AppLog, TAG } from "utils/Util";
import { HomeStackParamList } from "routes/HomeStack";
import {
  RouteProp,
  useNavigation,
  useRoute
} from "@react-navigation/native";
import EScreen from "models/enums/EScreen";
import { useNotificationApi } from "repo/notification/NotificationApis";
import { useAppDispatch } from "hooks/redux";
import { setNotificationCount } from "stores/generalSlice";

type Props = {};
type homeNavigationProp = RouteProp<HomeStackParamList, "Home">;

const HomeController: FC<Props> = () => {
  const route = useRoute<homeNavigationProp>();
  const navigation = useNavigation();

  useEffect(() => {
    AppLog.log(
      () =>
        "HomeController#route params : " + JSON.stringify(route?.params),
      TAG.VENUE
    );

    if (
      navigation.getState().routes[0].name === "Home" &&
      route?.params?.isFrom === EScreen.PUSH_NOTIFICATION
    ) {
      navigation.goBack();
    }
  }, [navigation, route?.params]);
  const dispatch = useAppDispatch();

  const { request: fetchNotificationCount } =
    useNotificationApi().getNotificationCount;

  const getNotificationUnReadCount = useCallback(async () => {
    const { hasError, dataBody } = await fetchNotificationCount({});
    if (!hasError && dataBody !== undefined) {
      AppLog.log(
        () => "NotificationCount: " + JSON.stringify(dataBody),
        TAG.VENUE
      );
      dispatch(setNotificationCount(dataBody.data?.unread_count));
    }
  }, [dispatch, fetchNotificationCount]);

  useEffect(() => {
    getNotificationUnReadCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return route?.params?.isFrom === EScreen.PUSH_NOTIFICATION ? (
    <HomeBottomBarRoutes
      initialParams={route?.params?.initialRoute ?? "Explore"}
    />
  ) : (
    <HomeBottomBarRoutes initialParams="Explore" />
  );
};

export default HomeController;
