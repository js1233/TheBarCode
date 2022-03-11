import DateTime from "./DateTime";
import { isDeliverToday, Venue } from "./Venue";
import EOrderStatus from "models/enums/EOrderStatus";
import Customer from "./Customer";
import EIntBoolean from "./enums/EIntBoolean";
import EPosType from "./enums/EPosType";
import ESupportedOrderType from "./enums/ESupportedOrderType";
import { BarMenu, barMenuTotalPrice, isBundleBogo } from "./BarMenu";
import { AppLog, TAG } from "utils/Util";
import ESplitPaymentStatus from "./enums/ESplitPaymentStatus";
import { getAmountIncludingTip, SplitPayment } from "./SplitPayment";
import {
  getOffersDiscount,
  OrderOffer
} from "./api_responses/OfferDetailsResponseModel";
import EOrderType from "./enums/EOrderType";

export type Order = {
  id: number;
  user_id: number;
  cart_id: number;
  establishment_id: number;
  type: EOrderType;
  status: EOrderStatus;
  delivery_charges?: number;
  discount?: number;
  sub_total: number;
  total: number;
  menu?: BarMenu[];
  menuItems?: BarMenu[];
  table_no?: number;
  created_at: DateTime;
  updated_at?: DateTime;
  is_paid?: EIntBoolean;
  offer_type?: string;
  epos_type?: EPosType;
  epos_order_id?: string;
  contact_number?: string;
  deliver_by?: string;
  order_tip?: number;
  is_printed?: number;
  establishment: Venue;
  customer: Customer;
  total_discount?: number;
  comment?: string;
  reason?: string;
  order_id?: null;
  payment_split?: SplitPayment[];
  cart_type?: ESupportedOrderType;
  voucher: OrderOffer | undefined;
  offer: OrderOffer | undefined;
  is_approved?: boolean;
};

export const menuItemsCount = (menu: BarMenu[]): number => {
  let count = 0;
  menu?.forEach((_menu) => {
    count += _menu.quantity;
  });
  return count;
};

export const menuItemPrice = (barMenus: BarMenu[]) => {
  let calculatedTotalPrice = 0.0;
  barMenus?.forEach((item) => {
    calculatedTotalPrice += barMenuTotalPrice(item);
  });
  AppLog.log(
    () => "Order#menuItemPrice(): " + JSON.stringify(calculatedTotalPrice),
    TAG.ORDERS
  );
  return calculatedTotalPrice;
};

export const calculateDeliveryCharges = (order: Order): number => {
  if (order.establishment.is_global_delivery) {
    return order.establishment.global_delivery_charges ?? 0.0;
  } else if (
    menuItemPrice(order?.menu ?? order?.menuItems ?? []) >=
    (order.establishment.custom_delivery_amount ?? 0.0)
  ) {
    return order.establishment.min_delivery_charges ?? 0.0;
  } else {
    return order.establishment.max_delivery_charges ?? 0.0;
  }
};

export const grandTotal = (order: Order): number => {
  let price = menuItemPrice(order.menu ?? order.menuItems ?? []);

  if (order.type === EOrderType.DELIVERY) {
    price += calculateDeliveryCharges(order);
  }
  price += order.order_tip ?? 0.0;

  AppLog.log(
    () => "Order#grandTotal() => " + JSON.stringify(price),
    TAG.ORDERS
  );

  return price;
};

export const getOrderWithOutBundleBogoItems = (order: Order) => {
  if (order.menu) {
    let items: BarMenu[] = order?.menu?.filter(
      (_item) => !isBundleBogo(_item)
    );
    order.menu = items;
  }

  if (order?.menuItems) {
    let menuItems: BarMenu[] = order?.menu?.filter(
      (_item) => !isBundleBogo(_item)
    );
    order.menuItems = menuItems;
  }

  return { ...order };
};

export const calculatedDiscount = (order: Order): number => {
  let discount = 0.0;

  let newOrder = getOrderWithOutBundleBogoItems(order);

  if (newOrder.voucher) {
    discount += getOffersDiscount(
      payingAmountWithOutDeliveryChargesAndTip(newOrder),
      newOrder.voucher
    );
  }

  if (newOrder.offer) {
    discount += getOffersDiscount(
      payingAmountWithOutDeliveryChargesAndTip(newOrder),
      newOrder.offer
    );
  }
  return discount;
};

export const unpaidAmount = (order: Order): number => {
  let payableAmount: number = grandTotal(order) ?? 0.0;
  order.payment_split?.forEach((item) => {
    if (item.type !== ESplitPaymentStatus.UN_PAID) {
      payableAmount -= item.amount + (item?.discount ?? 0.0);
    }
  });
  return payableAmount ?? 0.0;
};

export const getSplitAmount = (
  type: ESplitPaymentStatus,
  order: Order
): number => {
  AppLog.log(
    () =>
      "Order#getSplitAmount()" +
      JSON.stringify(type) +
      " " +
      JSON.stringify(order?.payment_split),
    TAG.ORDERS
  );

  order.payment_split?.forEach((item) => {
    if (!item.type) {
      item.type = ESplitPaymentStatus.PAID;
    }
  });

  if ((order?.payment_split?.length ?? 0) > 0) {
    if (type === ESplitPaymentStatus.PAID) {
      let findItem: SplitPayment | undefined = order.payment_split?.find(
        (item) => item.type === ESplitPaymentStatus.PAID
      );

      if (findItem) {
        AppLog.log(
          () =>
            "Order#getSplitAmount() => ESplitPaymentStatus.PAID => " +
            JSON.stringify(getAmountIncludingTip(findItem!)),
          TAG.ORDERS
        );

        return getAmountIncludingTip(findItem);
      } else {
        return 0.0;
      }
    } else if (type === ESplitPaymentStatus.UN_PAID) {
      let findItem: SplitPayment | undefined = order.payment_split?.find(
        (item) => item.type === ESplitPaymentStatus.UN_PAID
      );

      if (findItem) {
        AppLog.log(
          () =>
            "Order#getSplitAmount() => ESplitPaymentStatus.UN_PAID => getAmountIncludingTip =>" +
            JSON.stringify(getAmountIncludingTip(findItem!)),
          TAG.ORDERS
        );

        return getAmountIncludingTip(findItem);
      } else {
        AppLog.log(
          () =>
            "Order#getSplitAmount() => ESplitPaymentStatus.UN_PAID => unpaidAmount => " +
            JSON.stringify(unpaidAmount(order)),
          TAG.ORDERS
        );
        return unpaidAmount(order);
      }
    }
    return 0.0;
  } else {
    if (type === ESplitPaymentStatus.PAID) {
      return 0.0;
    } else if (type === ESplitPaymentStatus.UN_PAID) {
      AppLog.log(
        () =>
          "Order#getSplitAmount() => ESplitPaymentStatus.UN_PAID => grandTotal => " +
          JSON.stringify(grandTotal(order)),
        TAG.ORDERS
      );

      return grandTotal(order);
    }
    return 0.0;
  }
};

export const payingAmountWithOutDeliveryChargesAndTip = (
  order: Order
): number => {
  AppLog.log(
    () =>
      "Order#payingAmountWithOutDeliveryChargesAndTip() =>  " +
      JSON.stringify(getSplitAmount(ESplitPaymentStatus.UN_PAID, order)),
    TAG.ORDERS
  );

  return (
    getSplitAmount(
      order?.payment_split?.[0]?.type ?? ESplitPaymentStatus.UN_PAID,
      order
    ) -
    (order.delivery_charges ?? 0.0) -
    (order.order_tip ?? 0.0)
  );
};

export const checkoutPrice = (order: Order) => {
  AppLog.log(
    () =>
      "Order#checkoutPrice() " +
      JSON.stringify(getSplitAmount(ESplitPaymentStatus.UN_PAID, order)),
    TAG.ORDERS
  );

  AppLog.log(
    () => "Order#checkoutPrice() menuItems " + JSON.stringify(order),
    TAG.ORDERS
  );
  return (
    getSplitAmount(ESplitPaymentStatus.UN_PAID, order) -
      calculatedDiscount({ ...order }) ?? 0.0
  );
};

export const isOrderTypeSupported = (
  cartType: EOrderType,
  order: Order
) => {
  switch (cartType) {
    case EOrderType.DINE_IN:
      return (
        (!order.cart_type ||
          order?.cart_type === ESupportedOrderType.DINE_IN_COLLECTION) &&
        order?.establishment?.dine_in === true
      );
    case EOrderType.COLLECTION:
      return (
        (!order.cart_type ||
          order?.cart_type === ESupportedOrderType.DINE_IN_COLLECTION) &&
        order?.establishment?.collection === true
      );
    case EOrderType.TAKE_AWAY:
      return (
        (!order.cart_type ||
          order?.cart_type === ESupportedOrderType.TAKEAWAY_DELIVERY) &&
        order?.establishment?.take_away === true
      );
    case EOrderType.DELIVERY:
      return (
        (!order.cart_type ||
          order?.cart_type === ESupportedOrderType.TAKEAWAY_DELIVERY) &&
        isDeliverToday(order.establishment) === true
      );
    default:
      return false;
  }
};

export const isOrderPossible = (order: Order): boolean => {
  return (
    isOrderTypeSupported(EOrderType.DINE_IN, order) ||
    isOrderTypeSupported(EOrderType.COLLECTION, order) ||
    isOrderTypeSupported(EOrderType.TAKE_AWAY, order) ||
    (isOrderTypeSupported(EOrderType.DELIVERY, order) &&
      order.establishment.is_delivery_disable === false)
  );
};

export const isSplitPayments = (
  payments: SplitPayment[],
  userId: number
) => {
  if (payments?.length > 0) {
    if (payments.length === 1 && payments[0].id === userId) {
      return false;
    } else {
      return true;
    }
  }
};

export const isOrderForBundleBogo = (order: Order) => {
  return order?.menu?.every((_item: BarMenu) => isBundleBogo(_item));
};

export const isOrderContainBundleBogo = (order: Order) => {
  let result = order?.menu?.filter((_item: BarMenu) =>
    isBundleBogo(_item)
  );

  if (result?.length! > 0) {
    return true;
  } else {
    return false;
  }
};
