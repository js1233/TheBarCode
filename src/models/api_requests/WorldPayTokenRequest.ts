export type WorldPayTokenRequest = {
  clientKey?: string;
  paymentMethod?: WorldPayCard;
  reusable?: boolean;
};
export type WorldPayCard = {
  cvc: string;
  name: string;
  expiryMonth: string;
  expiryYear: number;
  type?: string;
  cardNumber: string;
};
