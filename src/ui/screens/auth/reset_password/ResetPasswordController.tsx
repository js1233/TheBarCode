import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { usePreventDoubleTap } from "hooks";
import { useAppSelector } from "hooks/redux";
import { SignInApiRequestModel } from "models/api_requests/SignInApiRequestModel";
import React, { FC, useEffect, useRef, useState } from "react";
import { RootState } from "stores/store";
import { useAuthApis } from "repo/auth/AuthApis";
import { AuthStackParamList } from "routes";
import CustomAlertWithTitleAndMessage from "ui/components/organisms/app_popup/CustomAlertWithTitleAndMessage";
import HeaderLeftTextWithIcon from "ui/components/headers/header_left_text_with_icon/HeaderLeftTextWithIcon";
import { COLORS } from "config";
import Cross from "assets/images/ic_cross.svg";
import { ResetPasswordView } from "./ResetPasswordView";

type LoginNavigationProp = StackNavigationProp<
  AuthStackParamList,
  "Login"
>;

type Props = {};

const ResetPasswordController: FC<Props> = () => {
  const requestModel = useRef<SignInApiRequestModel>();

  const [shouldShowErrorDialog, setShouldShowErrorDialog] =
    useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigation = useNavigation<LoginNavigationProp>();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user } = useAppSelector((state: RootState) => state.auth);
  // const dispatch = useAppDispatch();

  const { request: signInRequest, loading, error } = useAuthApis().signIn;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSignIn = usePreventDoubleTap(async () => {
    if (requestModel.current === undefined) {
      return;
    }
    const { hasError, dataBody } = await signInRequest(
      requestModel.current
    );
    if (hasError || dataBody === undefined) {
      setShouldShowErrorDialog(true);
      return;
    } else {
      //  dispatch(setUser(dataBody));
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
        />
      )
    });
  }, [navigation]);

  return (
    <>
      <ResetPasswordView
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

export default ResetPasswordController;
