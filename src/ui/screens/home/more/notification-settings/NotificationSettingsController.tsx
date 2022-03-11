import React, {
  useCallback,
  useLayoutEffect,
  useState,
  useRef
} from "react";
import { NotificationSettingsView } from "ui/screens/home/more/notification-settings/NotificationSettingsView";
import HeaderTitle from "ui/components/headers/header_title/HeaderTitle";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { HomeStackParamList } from "routes/HomeStack";
import HeaderLeftTextWithIcon from "ui/components/headers/header_left_text_with_icon/HeaderLeftTextWithIcon";
import Cross from "assets/images/ic_cross.svg";
import { LinkButton } from "ui/components/atoms/link_button/LinkButton";
import { TEXT_TYPE } from "ui/components/atoms/app_label/AppLabel";
import Strings from "config/Strings";
import { useAppDispatch, useAppSelector } from "hooks/redux";
import { useAuthApis } from "repo/auth/AuthApis";
import { RootState } from "stores/store";
import { updateUserProfile } from "stores/authSlice";
import { UpdateNotificationRequestModel } from "models/api_requests/UpdateNotificationRequestModel";
import SimpleToast from "react-native-simple-toast";
import { usePreventDoubleTap } from "hooks";
import { SPACE } from "config";

type HomeNavigationProp = StackNavigationProp<
  HomeStackParamList,
  "NotificationSettings"
>;
const NotificationSettingsController = () => {
  const [shouldShowDialog, setShouldShowDialog] = useState(false);
  const navigation = useNavigation<HomeNavigationProp>();
  const {
    request: updateNotificationRequest,
    loading: updateNotification
  } = useAuthApis().updateNotification;
  const { user } = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const requestModel = useRef<UpdateNotificationRequestModel>({
    id: user!.id,
    is_5_day_notify: user!.is_5_day_notify,
    is_live_offer_notify: user!.is_live_offer_notify
  });
  const onButtonPressed = usePreventDoubleTap(
    useCallback(async () => {
      const { dataBody, hasError, errorBody } =
        await updateNotificationRequest(requestModel.current);
      if (hasError || dataBody === undefined) {
        throw new Error(errorBody);
      } else {
        if (user?.id === requestModel.current.id) {
          let updatedUser = { ...user };
          updatedUser!.is_5_day_notify = dataBody.data.is_5_day_notify;
          updatedUser!.is_live_offer_notify =
            dataBody.data.is_live_offer_notify;
          dispatch(updateUserProfile(updatedUser));
          navigation.goBack();
        } else {
          SimpleToast.show(dataBody.message);
          navigation.goBack();
        }
      }
    }, [updateNotificationRequest, user, dispatch, navigation])
  );
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <HeaderTitle
          text={Strings.NotificationSettings.notification_settings_title}
          shouldTruncate={false}
        />
      ),
      headerLeft: () => (
        <HeaderLeftTextWithIcon
          onPress={() => navigation.pop()}
          icon={() => <Cross width={20} height={20} fill={"#737373"} />}
        />
      ),
      headerRight: () => {
        return (
          <LinkButton
            textType={TEXT_TYPE.SEMI_BOLD}
            numberOfLines={0}
            text={Strings.NotificationSettings.button_text}
            shouldShowProgressBar={updateNotification}
            viewStyle={{ marginEnd: SPACE.xs }}
            onPress={onButtonPressed}
          />
        );
      }
    });
  }, [navigation, updateNotification, onButtonPressed]);

  return (
    <NotificationSettingsView
      requestModel={requestModel}
      shouldShowDialog={shouldShowDialog}
      setShouldShowDialog={setShouldShowDialog}
      is5DayNotify={user!.is_5_day_notify}
      isLiveOfferNotify={user!.is_live_offer_notify}
    />
  );
};

export default NotificationSettingsController;
