import { useNavigation, useRoute } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { usePreventDoubleTap } from "hooks";
import React, { FC, useLayoutEffect, useState } from "react";
import { useAuthApis } from "repo/auth/AuthApis";
import { AuthStackParamList } from "routes";
import CustomAlertWithTitleAndMessage from "ui/components/organisms/app_popup/CustomAlertWithTitleAndMessage";
import HeaderLeftTextWithIcon from "ui/components/headers/header_left_text_with_icon/HeaderLeftTextWithIcon";
import { COLORS, SPACE } from "config";
import Cross from "assets/images/ic_cross.svg";
import { SignUpMobileView } from "./SignUpMobileView";
import EScreen from "models/enums/EScreen";
import HeaderTitle from "ui/components/headers/header_title/HeaderTitle";
import Strings from "config/Strings";
import { getNumberWithCode } from "models/api_responses/ForceUpdateResponseModel";
import { useAppSelector } from "hooks/redux";
import { RootState } from "stores/store";

type MobileAuthNavigationProps = StackScreenProps<
  AuthStackParamList,
  "SignUpMobile"
>;

type Props = {};

const SignUpMobileController: FC<Props> = () => {
  const [shouldShowErrorDialog, setShouldShowErrorDialog] =
    useState(false);

  const { isOpenFrom } =
    useRoute<MobileAuthNavigationProps["route"]>().params;

  const navigation =
    useNavigation<MobileAuthNavigationProps["navigation"]>();

  const { regionData } = useAppSelector(
    (state: RootState) => state.general
  );

  const {
    request: verifyNumber,
    loading,
    error
  } = useAuthApis().verifyNUmber;

  const handleVerifyMobile = usePreventDoubleTap(
    async (mobileNumber: string) => {
      const { hasError, dataBody, statusCode } = await verifyNumber(
        mobileNumber
      );

      if (statusCode === 404) {
        // number not exits, open sign up screen
        // pass isFromMobileAuth
        navigation.push("SignUp", {
          isFromMobileSignUp: true,
          contactNumber: mobileNumber
        });
        return;
      }

      if (hasError || dataBody === undefined) {
        setShouldShowErrorDialog(true);
        return;
      } else {
        //number already exist, open number verification screen
        navigation.navigate("VerifyView", {
          isOpenFrom: isOpenFrom,
          isOpenForEmail: false,
          data: mobileNumber
        });
      }
    }
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderLeftTextWithIcon
          icon={() => <Cross fill={COLORS.theme?.interface["500"]} />}
          onPress={() => {
            navigation.goBack();
          }}
          containerStyle={{ marginLeft: SPACE.lg }}
        />
      ),
      headerTitle: () => (
        <HeaderTitle
          text={
            isOpenFrom !== EScreen.SIGN_UP
              ? Strings.login.sign_in_mobile
              : Strings.signUp.sign_up_mobile
          }
        />
      )
    });
  }, [isOpenFrom, navigation]);

  return (
    <>
      <SignUpMobileView
        authMobile={(request) => {
          handleVerifyMobile(
            getNumberWithCode(
              request.contact,
              regionData?.dialing_code ?? "0"
            )
          );
        }}
        shouldShowProgressBar={loading}
        isOpenFromSignUp={isOpenFrom === EScreen.SIGN_UP}
      />
      <CustomAlertWithTitleAndMessage
        title={
          "Unable to " + (isOpenFrom === EScreen.SIGN_UP)
            ? Strings.login.sign_up
            : Strings.login.sign_in
        }
        message={error ?? "N/A"}
        shouldShow={shouldShowErrorDialog}
        hideDialogue={() => setShouldShowErrorDialog(false)}
      />
    </>
  );
};

export default SignUpMobileController;
