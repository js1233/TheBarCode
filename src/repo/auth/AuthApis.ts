import { API } from "config";
import Api from "config/Api";
import { useApi } from "hooks/useApi";
import { SignInApiRequestModel } from "models/api_requests/SignInApiRequestModel";
import { SignUpRequestModel } from "models/api_requests/SignUpRequestModel";
import { UpdateLocationRequest } from "models/api_requests/UpdateLocationRequest";
import { VerifyConfirmationCodeRequest } from "models/api_requests/VerifyConfirmationCodeRequest";
import { ForceUpdateResponseModel } from "models/api_responses/ForceUpdateResponseModel";
import { LocationUpdateResponseModel } from "models/api_responses/LocationUpdateResponseModel";
import { LogoutApiResponseModel } from "models/api_responses/LogoutApiResponseModel";
import { UpdateNotificationApiResponseModel } from "models/api_responses/UpdateNotificationApiResponseModel";
import { UpdateNotificationRequestModel } from "models/api_requests/UpdateNotificationRequestModel";
import { SignInApiResponseModel } from "models/api_responses/SignInApiResponseModel";
import { apiClient } from "repo/Client";
import SetUserPreferencesRequestModel from "models/api_requests/SetUserPreferencesRequestModel";
import SetUserPreferencesResponseModel from "models/api_responses/SetUserPreferencesResponseModel";
import { ChangePasswordRequestModel } from "models/api_requests/ChangePasswordRequestModel";

function checkForceUpdate(versionNumber: string) {
  return apiClient.get<ForceUpdateResponseModel>(
    API.CHECK_FOCRCE_UPDATE + versionNumber
  );
}

function signIn(requestModel: SignInApiRequestModel) {
  return apiClient.post<SignInApiResponseModel>(
    API.LOGIN_URL,
    JSON.stringify(requestModel)
  );
}

function changePassword(requestModel: ChangePasswordRequestModel) {
  return apiClient.post<any>(
    API.POST_CHANGE_PASSWORD,
    JSON.stringify(requestModel)
  );
}

function signUp(requestModel: SignUpRequestModel) {
  return apiClient.post<any>(API.SIGN_UP, JSON.stringify(requestModel));
}

function verifyNumber(number: string) {
  return apiClient.post<SignInApiResponseModel>(
    API.VERIFY_NUMBER,
    JSON.stringify({
      contact_number: number
    })
  );
}

function verifyConfirmationCode(request: VerifyConfirmationCodeRequest) {
  return apiClient.post<SignInApiResponseModel>(
    request.isFromMobile ? API.POST_ACTIVATE_MOBILE : Api.POST_ACTIVATE,
    JSON.stringify(request)
  );
}

function resentVerificationCode(request: VerifyConfirmationCodeRequest) {
  return apiClient.post<SignInApiResponseModel>(
    request.isFromMobile ? API.POST_RESEND_CODE : Api.POST_RESEND_EMAIL,
    JSON.stringify(request)
  );
}

function updateLocationApi(request: UpdateLocationRequest) {
  return apiClient.put<LocationUpdateResponseModel>(
    API.PUT_UPDATE_LOCATION,
    JSON.stringify(request)
  );
}

function updateReferralCode(referralCode: string) {
  return apiClient.put<SignInApiResponseModel>(
    API.PUT_REFERRAL_CODE,
    JSON.stringify({ own_referral_code: referralCode })
  );
}

function setPreferences(requestModel: SetUserPreferencesRequestModel) {
  return apiClient.post<SetUserPreferencesResponseModel>(
    API.POST_USER_PREFERENCES,
    JSON.stringify(requestModel)
  );
}

function socialSignIn(request: SignUpRequestModel) {
  return apiClient.post<any>(
    API.POST_SOCIAL_SIGN_IN,
    JSON.stringify(request)
  );
}

function forgotPassword(request: SignUpRequestModel) {
  return apiClient.post<any>(
    API.POST_FORGOT_PASSWORD,
    JSON.stringify(request)
  );
}

function updateNotifications(
  requestModel: UpdateNotificationRequestModel
) {
  return apiClient.put<UpdateNotificationApiResponseModel>(
    API.PUT_UPDATE + `${requestModel.id}`,
    JSON.stringify(requestModel)
  );
}

function logout() {
  return apiClient.post<LogoutApiResponseModel>(API.LOGOUT_URL);
}

export const useAuthApis = () => {
  return {
    signIn: useApi(signIn),
    logout: useApi(logout),
    signUp: useApi(signUp),
    changePassword: useApi(changePassword),
    verifyNUmber: useApi(verifyNumber),
    verifyConfirmationCode: useApi(verifyConfirmationCode),
    checkForceUpdate: useApi(checkForceUpdate),
    resentVerificationCode: useApi(resentVerificationCode),
    updateLocationApi: useApi(updateLocationApi),
    updateReferralCode: useApi(updateReferralCode),
    setUserPreferences: useApi(setPreferences),
    socialSignIn: useApi(socialSignIn),
    forgotPassword: useApi(forgotPassword),
    updateNotification: useApi(updateNotifications)
  };
};
