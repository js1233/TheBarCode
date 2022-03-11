export type RedeemDealRequestModel = {
  offer_id?: string;
  shared_id?: string;
  establishment_id: string;
  standard_offer_id?: string;
  type?: string;
  user_voucher_id?: string;

  //
  latitude?: number;
  longitude?: number;
};
