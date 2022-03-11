import React, { FC, useLayoutEffect, useRef } from "react";
import {
  RouteProp,
  useNavigation,
  useRoute
} from "@react-navigation/native";
import { useAppSelector } from "hooks/redux";
import { RootState } from "stores/store";
import { useAuthApis } from "repo/auth/AuthApis";
import { usePreventDoubleTap } from "hooks";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackParamList } from "routes";
import { ChangePasswordView } from "ui/screens/auth/change_password/ChangePasswordView";
import SimpleToast from "react-native-simple-toast";
import { ChangePasswordRequestModel } from "models/api_requests/ChangePasswordRequestModel";
import HeaderTitle from "ui/components/headers/header_title/HeaderTitle";

type Props = {};

type LoginNavigationProp = StackNavigationProp<
  AuthStackParamList,
  "Login"
>;

type ChangePasswordScreenProps = RouteProp<
  AuthStackParamList,
  "ChangePassword"
>;

const ChangePasswordController: FC<Props> = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigation = useNavigation<LoginNavigationProp>();
  const route = useRoute<ChangePasswordScreenProps>();
  const requestModel = useRef<ChangePasswordRequestModel | undefined>(
    route?.params?.params
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user } = useAppSelector((state: RootState) => state.auth);
  // const dispatch = useAppDispatch();

  const { request: changePasswordRequest, loading } =
    useAuthApis().changePassword;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleChangePassword = usePreventDoubleTap(async () => {
    const { hasError, dataBody, errorBody } = await changePasswordRequest(
      requestModel.current!
    );
    if (hasError || dataBody === undefined) {
      SimpleToast.show(errorBody ?? "");
      return;
    } else {
      SimpleToast.show(dataBody?.message);
      navigation.reset({
        index: 0,
        routes: [{ name: "PostSplash" }]
      });
    }
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <HeaderTitle text={"Change Password"} shouldTruncate={false} />
      )
    });
  }, [navigation]);

  return (
    <ChangePasswordView
      changePassword={(values) => {
        requestModel.current = {
          ...route?.params,
          ...values
        };

        handleChangePassword();
      }}
      shouldShowProgressBar={loading}
    />
  );
};

export default ChangePasswordController;
