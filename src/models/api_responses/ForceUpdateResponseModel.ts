import { ApiSuccessResponseModel } from "./ApiSuccessResponseModel";

export type ForceUpdateResponseModel = ApiSuccessResponseModel<RegionData>;

export interface RegionData {
  force_update: boolean;
  country: string;
  currency: string;
  currency_symbol: string;
  reload: number;
  round: number;
  dialing_code: string;
}

export const getNumberWithCode = (
  phoneNumber: string,
  dialingCode: string
): string => {
  phoneNumber.trim();

  if (dialingCode === "+44") {
    if (phoneNumber.charAt(0) === "0") {
      return dialingCode + phoneNumber.substring(1);
    } else {
      return phoneNumber;
    }
  } else {
    if (phoneNumber.length === 10) {
      return dialingCode + phoneNumber;
    } else if (
      phoneNumber.length === 11 &&
      phoneNumber.charAt(0) === "0"
    ) {
      return dialingCode + phoneNumber.substring(1);
    } else if (phoneNumber.substring(0, 4) === "0091") {
      return dialingCode + phoneNumber.substring(4);
    } else if (
      phoneNumber.length === 13 &&
      phoneNumber.substring(0, 3) === "091"
    ) {
      return dialingCode + phoneNumber.substring(3);
    } else {
      return phoneNumber;
    }
  }
};
