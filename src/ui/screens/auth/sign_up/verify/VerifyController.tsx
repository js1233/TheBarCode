import { useNavigation, useRoute } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { usePreventDoubleTap } from "hooks";
import { useAppDispatch } from "hooks/redux";
import React, { FC, useCallback, useEffect, useRef } from "react";
import { useAuthApis } from "repo/auth/AuthApis";
import { AuthStackParamList } from "routes";
import { VerifyView } from "./VerifyView";
import { SPACE } from "config";
import HeaderLeftTextWithIcon from "ui/components/headers/header_left_text_with_icon/HeaderLeftTextWithIcon";
import LeftArrow from "assets/images/left.svg";
import EScreen from "models/enums/EScreen";
import { VerifyConfirmationCodeRequest } from "models/api_requests/VerifyConfirmationCodeRequest";
import SimpleToast from "react-native-simple-toast";
import Strings from "config/Strings";
import { setUser } from "stores/authSlice";
import EPreferencesScreenUseCase from "models/enums/EPreferencesScreenUseCase";
import useSendAnalytics from "hooks/useSendAnalytics";

type VerifyCodeProps = StackScreenProps<AuthStackParamList, "VerifyView">;

type Props = {};

const VerifyController: FC<Props> = () => {
  const navigation = useNavigation<VerifyCodeProps["navigation"]>();
  const { isOpenFrom, isOpenForEmail, data } = useRoute<
    VerifyCodeProps["route"]
  >().params ?? { isOpenFrom: undefined, isOpenForEmail: true, data };

  const requestModel = useRef<VerifyConfirmationCodeRequest>({
    isFromMobile: !isOpenForEmail
  });

  isOpenForEmail
    ? (requestModel.current.email = data)
    : (requestModel.current.contact_number = data);

  const dispatch = useAppDispatch();

  const { request: verifyCodeRequest, loading } =
    useAuthApis().verifyConfirmationCode;
  const { sendAnalytics } = useSendAnalytics();
  const handleVerifyCodeRequest = usePreventDoubleTap(async () => {
    if (requestModel.current === undefined) {
      return;
    }
    const { hasError, dataBody, errorBody } = await verifyCodeRequest(
      requestModel.current
    );
    if (hasError || dataBody === undefined) {
      //onVerification failed
      SimpleToast.show(
        errorBody ?? Strings.common.some_thing_bad_happened
      );
      return;
    } else {
      //on verification success
      sendAnalytics("app_view", "");
      const user = dataBody.data;
      dispatch(setUser(dataBody.data));

      if (isOpenFrom === EScreen.SIGN_UP) {
        //open invite code
        navigation.navigate("InviteCode");
        return;
      }

      if (user?.is_interest_selected) {
        if (!user.is_location_updated) {
          // navigation.navigate("LocationPermission");
          navigation.reset({
            index: 0,
            routes: [{ name: "LocationPermission" }]
          });
        } else {
          //set user nad open main screen
          dispatch(setUser(dataBody.data));
        }
      } else {
        //open preference screen
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

  const { request: resendCodeRequest } =
    useAuthApis().resentVerificationCode;

  const handleResendCodeRequest = usePreventDoubleTap(async () => {
    if (requestModel.current === undefined) {
      return;
    }
    const { hasError, dataBody } = await resendCodeRequest(
      requestModel.current
    );
    if (hasError || dataBody === undefined) {
      SimpleToast.show(Strings.verify.resent_code_failed);
    } else {
      SimpleToast.show(Strings.verify.resend_code_success);
    }
  });

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
      )
    });
  }, [navigation]);

  const resendCode = useCallback(() => {
    handleResendCodeRequest();
  }, [handleResendCodeRequest]);
  return (
    <>
      <VerifyView
        verify={(verificationCode) => {
          requestModel.current.activation_code = verificationCode;
          handleVerifyCodeRequest();
        }}
        shouldShowProgressBar={loading}
        resendCode={resendCode}
        isOpenForEmail={isOpenForEmail}
        data={data}
      />
    </>
  );
};

export default VerifyController;
