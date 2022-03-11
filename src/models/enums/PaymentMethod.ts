import DateTime from "models/DateTime";
import EPaymentCardType from "./EPaymentCardType";

export type PaymentMethod = {
  id: number;
  user_id?: number;
  type?: string;
  ending_in?: string;
  address?: string;
  postcode?: string;
  city?: string;
  state?: null;
  country_code?: string;
  created_at?: DateTime;
  updated_at?: DateTime;
  deleted_at?: null;
  name: string;
  card_details?: string;
  card_type?: EPaymentCardType;
  verification_token?: null;
  token?: null;
};
