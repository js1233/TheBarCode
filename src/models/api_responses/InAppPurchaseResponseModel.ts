import DateTime from "models/DateTime";
import { User } from "./SignInApiResponseModel";

import { ApiSuccessResponseModel } from "./ApiSuccessResponseModel";

export type InAppPurchaseResponseModel =
  ApiSuccessResponseModel<InAppPurchase>;

export type InAppPurchase = {
  id: number;
  establishment_id: number;
  user_id: number;
  day: string;
  name: string;
  stripe_id: string;
  stripe_plan: string;
  quantity: number;
  date: string;
  trial_ends_at: DateTime;
  ends_at: DateTime;
  created_at: DateTime;
  updated_at: DateTime;
  amount: number;
  time: string;
  user: User;
};
