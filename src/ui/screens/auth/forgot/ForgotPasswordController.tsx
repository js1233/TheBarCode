import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { usePreventDoubleTap } from "hooks";
import { SignInApiRequestModel } from "models/api_requests/SignInApiRequestModel";
import React, { FC, useEffect, useRef } from "react";
import { useAuthApis } from "repo/auth/AuthApis";
import { AuthStackParamList } from "routes";
import HeaderLeftTextWithIcon from "ui/components/headers/header_left_text_with_icon/HeaderLeftTextWithIcon";
import { SPACE } from "config";
import LeftArrow from "assets/images/left.svg";
import { ForgotPasswordView } from "./ForgotPasswordView";
import HeaderTitle from "ui/components/headers/header_title/HeaderTitle";
import Strings from "config/Strings";
import SimpleToast from "react-native-simple-toast";

type LoginNavigationProp = StackNavigationProp<
  AuthStackParamList,
  "Login"
>;

// type ForgotPasswordAuthNavigationProps = StackScreenProps<
//   AuthStackParamList,
//   "ForgotPassword"
// >;

type Props = {};

const ForgotPasswordController: FC<Props> = () => {
  const requestModel = useRef<SignInApiRequestModel>();
  // const { isOpenForForgotPassword } =
  //   useRoute<ForgotPasswordAuthNavigationProps["route"]>().params ?? {
  //     isOpenForForgotPassword: false
  //   };
  const { request: forgotPasswordRequest, loading } =
    useAuthApis().forgotPassword;
  const navigation = useNavigation<LoginNavigationProp>();
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderLeftTextWithIcon
          icon={() => <LeftArrow />}
          onPress={() => {
            navigation.goBack();
          }}
          containerStyle={{ marginLeft: SPACE.lg }}
        />
      ),
      headerTitle: () => (
        <HeaderTitle
          text={Strings.login.forgot_pass}
          shouldTruncate={false}
        />
      )
    });
  }, [navigation]);

  const handleForgotPassword = usePreventDoubleTap(async () => {
    if (requestModel === undefined) {
      return;
    }
    const { hasError, dataBody, errorBody } = await forgotPasswordRequest(
      requestModel.current!
    );

    if (hasError && dataBody === undefined) {
      SimpleToast.show(errorBody!);
    } else {
      SimpleToast.show(dataBody?.message);
    }
  });
  return (
    <>
      <ForgotPasswordView
        signIn={(values) => {
          requestModel.current = {
            ...values
          };
          handleForgotPassword();
        }}
        shouldShowProgressBar={loading}
      />
    </>
  );
};

export default ForgotPasswordController;
