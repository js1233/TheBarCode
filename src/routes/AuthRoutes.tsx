import React, { FC, useEffect } from "react";
import LoginController from "ui/screens/auth/login/LoginController";
import { AuthStack } from "./AuthStack";
import { COLORS, STRINGS } from "config";
import HeaderTitle from "ui/components/headers/header_title/HeaderTitle";
import { PostSplashView } from "ui/screens/auth/post_splash/PostSplashView";
import { LoginMoodView } from "ui/screens/auth/login_mood/LoginMoodView";
import { SignUpMoodView } from "ui/screens/auth/sign_up_mood/SignUpMoodView";
import { shadowStyleProps } from "utils/Util";
import { AuthStackParamList } from "routes";
import SignUpMobileController from "ui/screens/auth/sign_up/mobile/SignUpMobileController";
import VerifyController from "ui/screens/auth/sign_up/verify/VerifyController";
import SignUpController from "ui/screens/auth/sign_up/SignUpController";
import { LocationPermissionView } from "ui/screens/auth/location_permission/LocationPermissionView";
import InviteCodeController from "ui/screens/auth/referral/InviteCodeController";
import EPreferencesScreenUseCase from "models/enums/EPreferencesScreenUseCase";
import PreferencesController from "ui/screens/preferences/PreferencesController";
import StaticContentController from "ui/screens/home/more/static_content/StaticContentController";
import ForgotPasswordController from "ui/screens/auth/forgot/ForgotPasswordController";
import ChangePasswordController from "ui/screens/auth/change_password/ChangePasswordController";
import { ChangePasswordRequestModel } from "models/api_requests/ChangePasswordRequestModel";
import { Linking } from "react-native";
import { useNavigation } from "@react-navigation/native";

type Props = {
  initialRouteName?: keyof AuthStackParamList;
  changePasswordParams?: ChangePasswordRequestModel;
};

export const AuthRoutes: FC<Props> = ({
  initialRouteName = "PostSplash",
  changePasswordParams
}) => {
  const navigation = useNavigation();

  useEffect(() => {
    const callback = ({ url }: { url: string }) => {
      const isPasswordReset = url?.includes("password/set");
      const data = url?.split("/");
      const requestModel: ChangePasswordRequestModel = {
        email: data?.[6],
        token: data?.[5]
      };

      if (isPasswordReset) {
        navigation.reset({
          index: 0,
          routes: [{ name: "ChangePassword", params: { ...requestModel } }]
        });
      }
    };

    const linkHandler = Linking.addEventListener("url", callback);
    return () => {
      linkHandler.remove();
    };
  }, [navigation]);

  return (
    <AuthStack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: COLORS.theme?.interface["50"],
          ...shadowStyleProps,
          shadowOpacity: 0.2
        }
      }}>
      <AuthStack.Screen
        name="PostSplash"
        component={PostSplashView}
        options={{
          headerShown: false
        }}
      />

      <AuthStack.Screen
        name="LoginMood"
        component={LoginMoodView}
        options={{
          headerShown: false
        }}
      />

      <AuthStack.Screen
        name="SignUpMood"
        component={SignUpMoodView}
        options={{
          headerShown: false
        }}
      />

      <AuthStack.Screen
        name="Login"
        component={LoginController}
        options={{
          headerTitle: () => (
            <HeaderTitle text={STRINGS.login.sign_in_email} />
          )
        }}
      />

      <AuthStack.Screen
        name="SignUp"
        component={SignUpController}
        options={{
          headerTitle: () => (
            <HeaderTitle text={STRINGS.signUp.sign_up_email} />
          )
        }}
      />

      <AuthStack.Screen
        name="SignUpMobile"
        component={SignUpMobileController}
        options={{
          headerTitle: () => (
            <HeaderTitle text={STRINGS.signUpMobile.title} />
          )
        }}
      />

      <AuthStack.Screen
        name="VerifyView"
        component={VerifyController}
        options={{
          headerTitle: () => <HeaderTitle text={STRINGS.verify.title} />
        }}
      />

      <AuthStack.Screen
        name="LocationPermission"
        component={LocationPermissionView}
        options={{
          headerShown: false
        }}
      />

      <AuthStack.Screen
        name="InviteCode"
        component={InviteCodeController}
        options={{
          headerTitle: () => (
            <HeaderTitle text={STRINGS.inviteCode.title} />
          )
        }}
      />
      <AuthStack.Screen
        name="Preferences"
        component={PreferencesController}
        initialParams={{
          useCase: EPreferencesScreenUseCase.SET_USER_PREFERENCES
        }}
      />

      <AuthStack.Screen
        name="StaticContent"
        component={StaticContentController}
      />
      <AuthStack.Screen
        name="ForgotPassword"
        component={ForgotPasswordController}
      />
      <AuthStack.Screen
        name="ChangePassword"
        initialParams={{ params: changePasswordParams }}
        component={ChangePasswordController}
      />
    </AuthStack.Navigator>
  );
};
