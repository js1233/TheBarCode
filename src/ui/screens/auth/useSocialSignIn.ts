import Strings from "config/Strings";
import { useAppDispatch } from "hooks/redux";
import useSendAnalytics from "hooks/useSendAnalytics";
import { SignUpRequestModel } from "models/api_requests/SignUpRequestModel";
import EPreferencesScreenUseCase from "models/enums/EPreferencesScreenUseCase";
import { useCallback } from "react";
import { useAuthApis } from "repo/auth/AuthApis";
import { setUser } from "stores/authSlice";
import { SignInNavigationProp } from "./login_mood/LoginMoodView";

export default (
  onSuccess?: () => void,
  onFailure?: (message: string) => void
) => {
  const { request: signUpRequest, loading } = useAuthApis().socialSignIn;
  const dispatch = useAppDispatch();
  const { sendAnalytics } = useSendAnalytics();
  const postSocialSignIn = useCallback(
    async (
      requestModel: SignUpRequestModel,
      navigation: SignInNavigationProp
    ) => {
      if (requestModel === undefined) {
        return;
      }
      const { hasError, dataBody, statusCode, errorBody } =
        await signUpRequest(requestModel);

      if (statusCode === 404) {
        //call on New User
        //open sign up fragment
        navigation.push("SignUp", {
          requestModel: requestModel,
          isFromMobileSignUp: true //to hide meail and password fields
        });
        return;
      }

      if (hasError || dataBody === undefined) {
        //call sign failed
        onFailure?.(errorBody ?? Strings.common.some_thing_bad_happened);
        return;
      } else {
        sendAnalytics("app_view", "");
        if (dataBody.data?.is_interest_selected) {
          if (!dataBody.data?.is_location_updated) {
            navigation.navigate("LocationPermission");
            // navigation.reset({
            //   index: 0,
            //   routes: [{ name: "LocationPermission" }]
            // });
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

        dispatch(setUser(dataBody.data));
      }
    },
    [dispatch, onFailure, signUpRequest, sendAnalytics]
  );

  return { postSocialSignIn, loading };
};
