import { useNavigation } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { usePreventDoubleTap } from "hooks";
import React, { FC, useEffect } from "react";
import { useAuthApis } from "repo/auth/AuthApis";
import { AuthStackParamList } from "routes";
import { COLORS } from "config";
import HeaderLeftTextWithIcon from "ui/components/headers/header_left_text_with_icon/HeaderLeftTextWithIcon";
import Cross from "assets/images/ic_cross.svg";
import SimpleToast from "react-native-simple-toast";
import Strings from "config/Strings";
import { InviteCodeView } from "./InviteCodeView";
import { useAppSelector, useAppDispatch } from "hooks/redux";
import { RootState } from "stores/store";
import { setUser } from "stores/authSlice";
import EPreferencesScreenUseCase from "models/enums/EPreferencesScreenUseCase";

type InviteCodeProps = StackScreenProps<AuthStackParamList, "InviteCode">;

type Props = {};

const InviteCodeController: FC<Props> = () => {
  const navigation = useNavigation<InviteCodeProps["navigation"]>();

  const { user } = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();

  const {
    request: submitCodeRequest,
    loading,
    error
  } = useAuthApis().updateReferralCode;

  const handleSubmitCode = usePreventDoubleTap(async (code: string) => {
    if (code === "") {
      navigateToPreferenceScreen();
    } else {
      const { hasError, dataBody } = await submitCodeRequest(code);
      if (hasError || dataBody === undefined) {
        SimpleToast.show(error ?? Strings.common.some_thing_bad_happened);
      } else {
        if (user) {
          let updatedUser = { ...user };
          updatedUser!.referral_code = dataBody.data?.own_referral_code;
          updatedUser!.is_referral_code = 1;

          dispatch(setUser(updatedUser));
          navigateToPreferenceScreen();
        }
      }
    }
  });

  const navigateToPreferenceScreen = () => {
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
  };

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
    <InviteCodeView
      submitCode={(verificationCode) => {
        handleSubmitCode(verificationCode);
      }}
      shouldShowProgressBar={loading}
      skip={navigateToPreferenceScreen}
    />
  );
};

export default InviteCodeController;
