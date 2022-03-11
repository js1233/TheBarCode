export type PostPaymentRequestModel = {
  card_uid?: string;
  session_id?: string;
  order_id?: string;
  token?: string;
  voucher_id?: string;

  split_type?: string;
  value?: string;

  offer_id?: string;
  offer_type?: string;
  use_credit?: string;

  //
  verification_token?: string;

  //update post payment
  payment_code?: string;
  secure_code?: string;
};
