import React, { FC, useCallback } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  AppLabel,
  AppLabelProps,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import Separator from "ui/components/atoms/separator/Separator";
import { COLORS, FONT_SIZE, SPACE } from "config";
import { FlatListWithPb } from "ui/components/organisms/flat_list/FlatListWithPb";
import { getSplitAmount, isSplitPayments, Order } from "models/Order";
import ItemOrderScreenDetails from "ui/components/organisms/item_order_detail/ItemOrderScreenDetails";
import { AppLog, Price, TAG } from "utils/Util";
import EScreen from "models/enums/EScreen";
import { BarMenu } from "models/BarMenu";
import ESupportedOrderType from "models/enums/ESupportedOrderType";
import ESplitPaymentStatus from "models/enums/ESplitPaymentStatus";
import { useAppSelector } from "hooks/redux";
import { RootState } from "stores/store";
import EOrderType from "models/enums/EOrderType";

type Props = { order: Order; showMenuItem?: boolean; eScreen?: EScreen };

export const orderSummarySeparator = () => {
  return (
    <View style={styles.separator}>
      <Separator color={COLORS.white} thickness={1.0} />
    </View>
  );
};

const OrderSummary: FC<Props> = ({
  order,
  eScreen,
  showMenuItem = true
}) => {
  const { user } = useAppSelector((state: RootState) => state.auth);

  const listItem = useCallback(
    ({ item }: { item: BarMenu }) => {
      return (
        <ItemOrderScreenDetails
          menuItem={item}
          currencySymbol={order?.establishment?.region.currency_symbol}
        />
      );
    },
    [order?.establishment?.region.currency_symbol]
  );

  AppLog.log(
    () => "OrderSummary#MenusItem: " + JSON.stringify(order),
    TAG.ORDERS
  );

  function itemAmountWithLabel(
    leftAppLabelProps?: AppLabelProps,
    rightAppLabelProps?: AppLabelProps
  ) {
    return (
      <View style={styles.titleWithAmount}>
        <AppLabel {...leftAppLabelProps} />
        <AppLabel {...rightAppLabelProps} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppLabel
        text={`${order?.establishment?.title}${
          order?.cart_type === ESupportedOrderType.DINE_IN_COLLECTION
            ? " - Dine-in"
            : order?.cart_type === ESupportedOrderType.TAKEAWAY_DELIVERY
            ? " - Takeaway/Delivery"
            : order?.type === EOrderType.DINE_IN
            ? " - Table Service"
            : order?.type === EOrderType.COLLECTION
            ? " - Counter Collection"
            : order?.type === EOrderType.TAKE_AWAY
            ? " - Takeaway"
            : order?.type === EOrderType.DELIVERY
            ? " - Delivery"
            : ""
        }`}
        textType={TEXT_TYPE.SEMI_BOLD}
        style={styles.title}
      />

      {showMenuItem && (
        <>
          {orderSummarySeparator()}
          <ScrollView
            horizontal={true}
            scrollEnabled={false}
            contentContainerStyle={{ flex: 1 }}>
            <FlatListWithPb
              data={order?.menu ?? order?.menuItems}
              renderItem={listItem}
              style={{ flex: 1 }}
              scrollEnabled={false}
              ItemSeparatorComponent={orderSummarySeparator}
            />
          </ScrollView>
        </>
      )}

      {eScreen !== EScreen.ORDER_TYPE && (
        <>
          {orderSummarySeparator()}
          {itemAmountWithLabel(
            {
              text: "Sub Total",
              style: styles.blackLabelStyle
            },
            {
              text: Price.toString(
                order?.establishment?.currency_symbol,
                order.sub_total
              ),
              style: styles.blackLabelStyle,
              textType: TEXT_TYPE.SEMI_BOLD
            }
          )}

          {user?.id === order.user_id &&
            (order?.order_tip ?? 0) > 0 &&
            order?.payment_split?.find((item) => item.id === user?.id) !==
              null && (
              <>
                {orderSummarySeparator()}
                {itemAmountWithLabel(
                  { text: "Tip", style: styles.blackLabelStyle },
                  {
                    text: Price.toString(
                      order?.establishment?.currency_symbol,
                      order.order_tip
                    ),
                    style: styles.blackLabelStyle,
                    textType: TEXT_TYPE.SEMI_BOLD
                  }
                )}
              </>
            )}

          {(order?.delivery_charges ?? 0) > 0 && (
            <>
              {orderSummarySeparator()}
              {itemAmountWithLabel(
                {
                  text: "Delivery Charges",
                  style: styles.blackLabelStyle
                },
                {
                  text: Price.toString(
                    order?.establishment?.currency_symbol,
                    order.delivery_charges
                  ),
                  style: styles.blackLabelStyle,
                  textType: TEXT_TYPE.SEMI_BOLD
                }
              )}
            </>
          )}

          {orderSummarySeparator()}
          {itemAmountWithLabel(
            {
              text: "Grand Total",
              style: styles.coloredLabelStyle,
              textType: TEXT_TYPE.BOLD
            },
            {
              text: Price.toString(
                order?.establishment?.currency_symbol,
                order.total
              ),
              style: styles.coloredLabelStyle,
              textType: TEXT_TYPE.SEMI_BOLD
            }
          )}

          {isSplitPayments(order?.payment_split ?? [], order.user_id) && (
            <>
              {orderSummarySeparator()}
              {itemAmountWithLabel(
                {
                  text: "Your Splitted amount",
                  style: styles.blackLabelStyle,
                  textType: TEXT_TYPE.SEMI_BOLD
                },
                {
                  text: Price.toString(
                    order?.establishment?.currency_symbol,
                    (order?.payment_split?.[0]?.amount ?? 0.0) +
                      (order?.payment_split?.[0]?.discount ?? 0.0)
                  ),
                  style: styles.blackLabelStyle,
                  textType: TEXT_TYPE.SEMI_BOLD
                }
              )}
            </>
          )}

          {eScreen !== EScreen.MEMBER_DISCOUNT && (
            <>
              {/* Member discount */}
              {order?.offer && (
                <>
                  {orderSummarySeparator()}
                  {itemAmountWithLabel(
                    {
                      text: order?.offer.text,
                      style: styles.blackLabelStyle,
                      textType: TEXT_TYPE.SEMI_BOLD
                    },
                    {
                      text: Price.toString(
                        order.establishment.region.currency_symbol,
                        order?.offer?.discount
                      ),
                      //  ??
                      // offerGetDiscount(
                      //   payingAmountWithOutDeliveryChargesAndTip(order),
                      //   order.offer,
                      //   order.establishment.region.currency_symbol
                      // ),
                      style: styles.blackLabelStyle,
                      textType: TEXT_TYPE.SEMI_BOLD
                    }
                  )}
                </>
              )}

              {/* total amount to pay by split  user */}
              {(order.payment_split?.length ?? 0) > 0 && (
                <>
                  {orderSummarySeparator()}
                  {itemAmountWithLabel(
                    {
                      text: `${
                        (order?.payment_split?.length ?? 0) > 0 &&
                        order?.payment_split?.[0]?.type ===
                          ESplitPaymentStatus.UN_PAID
                          ? "Total"
                          : "Total Paid"
                      }`,
                      style: styles.coloredLabelStyle,
                      textType: TEXT_TYPE.SEMI_BOLD
                    },
                    {
                      text: Price.toString(
                        order?.establishment?.currency_symbol,
                        getSplitAmount(
                          order?.payment_split?.[0]?.type ??
                            ESplitPaymentStatus.PAID,
                          order
                        )
                      ),
                      style: styles.coloredLabelStyle,
                      textType: TEXT_TYPE.SEMI_BOLD
                    }
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.theme?.interface["100"],
    padding: SPACE.md,
    borderRadius: 10
  },
  separator: { paddingTop: SPACE.md, paddingBottom: SPACE.md },
  title: { color: COLORS.theme?.interface["900"] },
  titleWithAmount: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  blackLabelStyle: {
    color: COLORS.theme?.interface["900"],
    fontSize: FONT_SIZE._2xs
  },
  coloredLabelStyle: {
    color: COLORS.theme?.primaryShade["700"],
    fontSize: FONT_SIZE._2xs
  }
});

export default OrderSummary;
