import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { usePreventDoubleTap } from "hooks";
import { useAppDispatch } from "hooks/redux";
import { SignInApiRequestModel } from "models/api_requests/SignInApiRequestModel";
import React, { FC, useEffect, useRef, useState } from "react";
import { setUser } from "stores/authSlice";
import { useAuthApis } from "repo/auth/AuthApis";
import { AuthStackParamList } from "routes";
import CustomAlertWithTitleAndMessage from "ui/components/organisms/app_popup/CustomAlertWithTitleAndMessage";
import { LoginView } from "ui/screens/auth/login/LoginView";
import HeaderLeftTextWithIcon from "ui/components/headers/header_left_text_with_icon/HeaderLeftTextWithIcon";
import { COLORS, SPACE } from "config";
import Cross from "assets/images/ic_cross.svg";
import EScreen from "models/enums/EScreen";
import EPreferencesScreenUseCase from "models/enums/EPreferencesScreenUseCase";
import useSendAnalytics from "hooks/useSendAnalytics";
import crashlytics from "@react-native-firebase/crashlytics";

type LoginNavigationProp = StackNavigationProp<
  AuthStackParamList,
  "Login"
>;

type Props = {};

const LoginController: FC<Props> = () => {
  const requestModel = useRef<SignInApiRequestModel>();

  const [shouldShowErrorDialog, setShouldShowErrorDialog] =
    useState(false);

  const navigation = useNavigation<LoginNavigationProp>();

  const dispatch = useAppDispatch();

  const { request: signInRequest, loading, error } = useAuthApis().signIn;
  const { sendAnalytics } = useSendAnalytics();
  const handleSignIn = usePreventDoubleTap(async () => {
    if (requestModel.current === undefined) {
      return;
    }
    const { hasError, dataBody, statusCode } = await signInRequest(
      requestModel.current
    );

    if (statusCode === 410) {
      navigation.navigate("VerifyView", {
        isOpenForEmail: true,
        isOpenFrom: EScreen.SIGN_UP,
        data: requestModel.current.email
      });
      return;
    }

    if (hasError || dataBody === undefined) {
      setShouldShowErrorDialog(true);
      return;
    } else {
      sendAnalytics("app_view", "");
      //set user nad open main screen
      dispatch(setUser(dataBody?.data));

      await Promise.all([
        crashlytics().setUserId(`${dataBody.data.id}`),
        crashlytics().setAttribute(
          "credits",
          String(dataBody.data.credit)
        ),
        crashlytics().setAttributes({
          role: "admin",
          followers: "13",
          email: dataBody.data.email,
          username: dataBody.data.full_name
        })
      ]);

      if (dataBody.data?.is_interest_selected) {
        if (!dataBody.data.is_location_updated) {
          navigation.reset({
            index: 0,
            routes: [{ name: "LocationPermission" }]
          });
        } else {
          dispatch(setUser(dataBody.data));
        }
      } else {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: "Preferences",
              params: {
                useCase: EPreferencesScreenUseCase.SET_USER_PREFERENCES
              }
            }
          ]
        });
      }
    }
  });

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderLeftTextWithIcon
          icon={() => <Cross fill={COLORS.theme?.interface["500"]} />}
          onPress={() => {
            navigation.goBack();
          }}
          containerStyle={{ marginLeft: SPACE.lg }}
        />
      )
    });
  }, [navigation]);

  return (
    <>
      <LoginView
        signIn={(values) => {
          requestModel.current = {
            ...values
          };

          handleSignIn();
        }}
        shouldShowProgressBar={loading}
      />
      <CustomAlertWithTitleAndMessage
        title={"Unable to Sign In"}
        message={error ?? "N/A"}
        shouldShow={shouldShowErrorDialog}
        hideDialogue={() => setShouldShowErrorDialog(false)}
      />
    </>
  );
};

export default LoginController;
