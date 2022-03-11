type PaymentMethodRequestModel = {
  id?: number;
  card_type?: string;
  type?: string;
  ending_in?: string;
  name?: string;
  address?: string;
  postcode?: string;
  city?: string;
  country?: string;
  establishment_id?: string;
  nonce?: string;
  verification_token?: string;
  card_details?: string;
};

export default PaymentMethodRequestModel;
