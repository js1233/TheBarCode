import { COLORS } from "config";
import { useAppDispatch, useAppSelector } from "hooks/redux";
import EPreferencesScreenUseCase from "models/enums/EPreferencesScreenUseCase";
import React, { FC, useLayoutEffect } from "react";
import { RootState } from "stores/store";
import HeaderTitle from "ui/components/headers/header_title/HeaderTitle";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { HomeStackParamList } from "routes/HomeStack";
import { MoreView } from "ui/screens/home/more/MoreView";
import { AppLog, TAG } from "utils/Util";
import EMoreType from "models/enums/EMoreType";
import { logOut } from "stores/authSlice";
import { usePreventDoubleTap } from "hooks";
import { setDynamicLink, setNotificationCount } from "stores/generalSlice";
import { Alert } from "react-native";

type Props = {};

type BottomBarNavigationProp = StackNavigationProp<
  HomeStackParamList,
  "Home"
>;

type HomeNavigationProp = StackNavigationProp<
  HomeStackParamList,
  "StaticContent"
>;

const MoreController: FC<Props> = () => {
  AppLog.log(
    () => "App theme inside Home : " + JSON.stringify(COLORS),
    TAG.THEME
  );
  const navigation = useNavigation<BottomBarNavigationProp>();
  const homeNavigation = useNavigation<HomeNavigationProp>();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <HeaderTitle
          text={"Welcome, " + user?.full_name!}
          shouldTruncate={false}
        />
      )
    });
  }, [navigation, user?.full_name]);

  const getGender = () => {
    if (user?.gender === "Other") {
      return "Rather Not Say";
    } else if (user?.gender === "Non_binary") {
      return "Non Binary";
    } else {
      return user?.gender;
    }
  };

  const onSignOut = () => {
    return Alert.alert("Sign out?", "Are you sure you want to Sign out?", [
      {
        text: "No"
      },
      {
        text: "Yes",
        onPress: () => {
          dispatch(setDynamicLink(undefined));
          dispatch(logOut());
        }
      }
    ]);
  };

  const moveToRequiredScreen = usePreventDoubleTap(
    (moreType: EMoreType) => {
      switch (moreType) {
        case EMoreType.PRIVACY_POLICY:
          return homeNavigation.push("StaticContent", {
            contentType: EMoreType.PRIVACY_POLICY
          });
        case EMoreType.PREFERENCES:
          homeNavigation.push("Preferences", {
            useCase: EPreferencesScreenUseCase.UPDATE_USER_PREFERENCES
          });
          break;
        case EMoreType.Notifications:
          dispatch(setNotificationCount(0));
          homeNavigation.push("Notification");
          break;
        case EMoreType.Wallet:
          homeNavigation.push("Wallet", {
            initialRouteName: "Favourite",
            initialSegmentIndex: 0
          });
          break;
        case EMoreType.SIGN_OUT:
          onSignOut();
          break;
        case EMoreType.NOTIFICATION_SETTINGS:
          return homeNavigation.push("NotificationSettings");
        case EMoreType.FREQUENT_QUESTIONS:
          return homeNavigation.push("FrequentlyAskedQuestions");
        case EMoreType.REDEMPTION_RULES:
          return homeNavigation.push("RedemptionAndReloadRules");
        case EMoreType.RELOAD:
          return homeNavigation.push("Reload");
        case EMoreType.SPLIT_SCANNER:
          return homeNavigation.push("SplitBillScanner");
        case EMoreType.MY_ADDRESSES:
          return homeNavigation.push("Addresses", {});
        case EMoreType.PAYMENT_METHODS:
          return homeNavigation.push("MyPayment");
        case EMoreType.ACCOUNT_SETTINGS:
          return homeNavigation.push("SignUp", {
            isOpenFromAccountSettings: true,
            requestModel: {
              full_name: user ? user.full_name : "",
              date_of_birth: user ? user.date_of_birth.toString() : "",
              email: user ? user.email : "",
              password: "",
              gender: user ? getGender() : "",
              postcode: user && user.postcode ? user.postcode : "",
              oapa_code: user && user.oapa_code ? user.oapa_code : ""
            }
          });
      }
    }
  );

  return <MoreView moveToRequiredScreen={moveToRequiredScreen} />;
};

export default MoreController;
