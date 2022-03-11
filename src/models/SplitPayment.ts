import ESplitPaymentStatus from "./enums/ESplitPaymentStatus";

export type SplitPayment = {
  id: number;
  name: string;
  amount: number;
  split_type: any;
  amount_percent?: number;
  discount?: number;
  status?: string;
  order_tip?: number;

  //client side field
  type: ESplitPaymentStatus;
};

export const getAmountIncludingTip = (splitPayment: SplitPayment) => {
  if ((splitPayment?.order_tip ?? 0) > 0) {
    return (splitPayment?.order_tip ?? 0) + splitPayment.amount;
  } else {
    return splitPayment.amount;
  }
};

export const getPaidAmountWithDiscount = (
  splittingPayment: SplitPayment
) => {
  return splittingPayment.amount + (splittingPayment.discount ?? 0.0);
};

export const getPercentageText = (
  splittingPayment: SplitPayment,
  totalAmount: number
) => {
  let percentage =
    (getPaidAmountWithDiscount(splittingPayment) / totalAmount) * 100;
  return percentage.toFixed(2);
};
