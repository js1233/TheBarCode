import { AppLog, Price, TAG } from "utils/Util";

export type OfferDetailsResponseModel = {
  data: OrderOffer[];
  message: string;
};

export type OrderOffer = {
  id: number;
  type: string;
  text: string;
  value: number;
  discount: number;
  value_type: EValueType;
  user_credit?: boolean; //user defined value
};

export enum EValueType {
  AMOUNT = "amount",
  PERCENT = "percent"
}

export const getOffersDiscount = (
  price: number,
  offer?: OrderOffer
): number => {
  let calculatedPrice = price;

  if (offer?.value_type === EValueType.AMOUNT) {
    if (offer?.value <= calculatedPrice) {
      return offer.value;
    } else {
      return calculatedPrice ?? 0.0;
    }
  } else if (offer?.value_type === EValueType.PERCENT) {
    let _price = 0.0;
    if (calculatedPrice <= 20) {
      _price = calculatedPrice;
    } else {
      _price = 20.0;
    }

    return (_price * offer.value) / 100 ?? 0.0;
  }

  return 0.0;
};

export const offerGetDiscount = (
  totalPrice: number,
  offer: OrderOffer | undefined,
  currencySymbol: string
): string => {
  AppLog.log(
    () =>
      "OfferDeatilsResponseModel#offerGetDiscount() => totalPrice# " +
      JSON.stringify(totalPrice),
    TAG.ORDERS
  );

  AppLog.log(
    () =>
      "OfferDeatilsResponseModel#offerGetDiscount() => offer# " +
      JSON.stringify(offer),
    TAG.ORDERS
  );

  return Price.toString(
    currencySymbol,
    getOffersDiscount(totalPrice, offer)
  );
};
