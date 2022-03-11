import { useNavigation, useRoute } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { usePreventDoubleTap } from "hooks";
import moment from "moment";
import React, { FC, useRef, useState, useLayoutEffect } from "react";
import { useAuthApis } from "repo/auth/AuthApis";
import { AuthStackParamList } from "routes";
import CustomAlertWithTitleAndMessage from "ui/components/organisms/app_popup/CustomAlertWithTitleAndMessage";
import { SignUpView } from "./SignUpView";
import { COLORS, SPACE } from "config";
import HeaderLeftTextWithIcon from "ui/components/headers/header_left_text_with_icon/HeaderLeftTextWithIcon";
import Cross from "assets/images/ic_cross.svg";
import { SignUpRequestModel } from "models/api_requests/SignUpRequestModel";
import EScreen from "models/enums/EScreen";
import { useAppDispatch, useAppSelector } from "hooks/redux";
import { setUser, updateUserProfile } from "stores/authSlice";
import HeaderTitle from "ui/components/headers/header_title/HeaderTitle";
import Strings from "config/Strings";
import { RootState } from "stores/store";
import { useGeneralApis } from "repo/general/GeneralApis";
import SimpleToast from "react-native-simple-toast";
import { AppLog, TAG } from "utils/Util";

type SignUpNavigationProp = StackScreenProps<AuthStackParamList, "SignUp">;
type Props = {};

const SignUpController: FC<Props> = () => {
  const signUpRequestModel = useRef<SignUpRequestModel>();
  const [shouldShowErrorDialog, setShouldShowErrorDialog] =
    useState(false);
  const dispatch = useAppDispatch();
  const navigation = useNavigation<SignUpNavigationProp["navigation"]>();
  const { params } = useRoute<SignUpNavigationProp["route"]>();

  const { user } = useAppSelector((state: RootState) => state.auth);

  AppLog.log(() => "user#" + JSON.stringify(user), TAG.REDEEM);

  const { isFromMobileSignUp } = params ?? {
    isFromMobileSignUp: false
  };

  const { requestModel } = params ?? {
    requestModel: undefined
  };

  const { contactNumber } = params ?? {
    contactNumber: undefined
  };

  const { isOpenFromAccountSettings } = params ?? {
    isOpenFromAccountSettings: false
  };

  const { request: signUpRequest, loading, error } = useAuthApis().signUp;
  const { request: updateUserRequest, loading: isLoading } =
    useGeneralApis().updateUser;

  const updateUser = usePreventDoubleTap(async () => {
    if (signUpRequestModel.current === undefined) {
      return;
    }
    const { hasError, dataBody, errorBody } = await updateUserRequest(
      signUpRequestModel.current
    );
    if (!hasError && dataBody !== undefined) {
      dispatch(updateUserProfile(dataBody.data));
      SimpleToast.show(dataBody.message);
      navigation.goBack();
    } else {
      SimpleToast.show(errorBody!);
    }
  });

  const handleSignUp = usePreventDoubleTap(async () => {
    if (signUpRequestModel.current === undefined) {
      return;
    }
    const { hasError, dataBody } = await signUpRequest(
      signUpRequestModel.current
    );

    if (hasError || dataBody === undefined) {
      setShouldShowErrorDialog(true);
      return;
    } else {
      if (dataBody?.data) {
        dispatch(setUser(dataBody?.data));
        navigation.navigate("InviteCode");
        return;
      } else if (dataBody?.email || dataBody?.contact_number) {
        navigation.navigate("VerifyView", {
          isOpenForEmail: isFromMobileSignUp ? false : true,
          isOpenFrom: EScreen.SIGN_UP,
          data: contactNumber ?? signUpRequestModel.current.email!
        });
      }
    }
  });

  const onPressBackButton = usePreventDoubleTap(() => {
    navigation.goBack();
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderLeftTextWithIcon
          icon={() => <Cross fill={COLORS.theme?.interface["500"]} />}
          onPress={onPressBackButton}
          containerStyle={{ marginLeft: SPACE.lg }}
        />
      ),
      headerTitle: () => (
        <HeaderTitle
          text={
            isOpenFromAccountSettings
              ? Strings.signUp.account_settings
              : isFromMobileSignUp
              ? requestModel
                ? Strings.signUp.update_profile
                : Strings.signUp.sign_up_mobile
              : Strings.signUp.sign_up_email
          }
        />
      )
    });
  }, [
    isFromMobileSignUp,
    isOpenFromAccountSettings,
    navigation,
    requestModel,
    onPressBackButton
  ]);

  return (
    <>
      <SignUpView
        signUp={(values) => {
          signUpRequestModel.current = {
            full_name: values.full_name,
            provider: isFromMobileSignUp
              ? requestModel
                ? requestModel.provider
                : "contact_number"
              : "email",
            postcode: "",
            ...(values as SignUpRequestModel),
            gender: values?.gender?.text,
            date_of_birth: moment(
              moment(values?.date_of_birth, "DD / MM / YYYY")
            ).format("yyyy-MM-DD")
          };

          isOpenFromAccountSettings &&
            ((signUpRequestModel.current.id = user?.id),
            values.password
              ? (signUpRequestModel.current.old_password = values.password)
              : "",
            (signUpRequestModel.current.new_password =
              values.confirmpassword));

          isFromMobileSignUp &&
            (signUpRequestModel.current!.contact_number = contactNumber);

          isOpenFromAccountSettings ? updateUser() : handleSignUp();
        }}
        shouldShowProgressBar={
          isOpenFromAccountSettings ? isLoading : loading
        }
        hideOnlyPass={isOpenFromAccountSettings ?? false}
        hideEmailPass={
          (isFromMobileSignUp ||
            user?.social_account_id ||
            user?.contact_number) ??
          false
        }
        preFilledRequestModel={requestModel}
        isOpenFromAccountSettings={isOpenFromAccountSettings}
        user={user!}
      />
      <CustomAlertWithTitleAndMessage
        title={"Unable to Sign Up"}
        message={error ?? "N/A"}
        shouldShow={shouldShowErrorDialog}
        hideDialogue={() => setShouldShowErrorDialog(false)}
      />
    </>
  );
};

export default SignUpController;
