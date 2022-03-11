import { createStackNavigator } from "@react-navigation/stack";
import { SignUpRequestModel } from "models/api_requests/SignUpRequestModel";
import EMoreType from "models/enums/EMoreType";
import EPreferencesScreenUseCase from "models/enums/EPreferencesScreenUseCase";
import EScreen from "models/enums/EScreen";
import { ChangePasswordRequestModel } from "models/api_requests/ChangePasswordRequestModel";

export type AuthStackParamList = {
  Login: undefined;
  PostSplash: undefined;
  LoginMood: undefined;
  SignUpMood: undefined;
  SignUp: {
    isOpenFromAccountSettings?: boolean;
    requestModel?: SignUpRequestModel;
    isFromMobileSignUp?: boolean;
    contactNumber?: string;
  };
  SignUpMobile: {
    isOpenFrom: EScreen;
  };
  VerifyView: {
    isOpenForForgotPassword?: boolean;
    isOpenFrom?: EScreen;
    isOpenForEmail?: boolean;
    data?: any;
  };
  InviteCode: undefined;
  LocationPermission: undefined;
  Preferences: {
    useCase: EPreferencesScreenUseCase;
    onPreferencesSelected?: (preferenceIds: number[]) => void;
    selectedIds?: number[];
  };
  ForgotPassword: {
    isOpenForForgotPassword: boolean;
  };
  StaticContent: { contentType?: EMoreType };
  ChangePassword: { params?: ChangePasswordRequestModel };
};

export const AuthStack = createStackNavigator<AuthStackParamList>();
