import { ApiSuccessResponseModel } from "./ApiSuccessResponseModel";

export type UpdateNotificationApiResponseModel =
  ApiSuccessResponseModel<UpdateNotificationResponse>;

export interface UpdateNotificationResponse {
  id: number;
  full_name: string;
  email: string;
  contact_number: null;
  profile_image: null;
  role_id: number;
  social_account_id: null;
  date_of_birth: Date;
  gender: string;
  referral_code: string | null;
  own_referral_code: string;
  credit: number;
  activation_key: string;
  activated_at: Date;
  latitude: number;
  longitude: number;
  is_5_day_notify: number;
  is_live_offer_notify: number;
  status: string;
  is_referral_code: number;
  credit_assigned: number;
  trial_ends_at: null;
  card_last_four: string;
  card_brand: string;
  stripe_id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: null;
  activation_code: string;
  provider: string;
  reload_count: number;
  app_share_count: number;
  postcode: string;
  default_address_id: number;
  delivery_contact: string;
  square_customer_id: null;
  square_idempotency_key: null;
  is_custom_notification: boolean;
  access_token: string;
  is_interest_selected: boolean;
  is_location_updated: boolean;
  default_address: null;
}
