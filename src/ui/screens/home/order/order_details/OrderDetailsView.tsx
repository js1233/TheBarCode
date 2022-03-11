import React, { FC, useCallback } from "react";
import { menuItemPrice, Order } from "models/Order";
import Screen from "ui/components/atoms/Screen";
import OrderSummary from "ui/components/organisms/order_summary/OrderSummary";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import { COLORS, FONT_SIZE, SPACE, STRINGS } from "config";
import {
  AppLabel,
  AppLabelProps,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import { FlatListWithPb } from "ui/components/organisms/flat_list/FlatListWithPb";
import Separator from "ui/components/atoms/separator/Separator";
import { useAppSelector } from "hooks/redux";
import { RootState } from "stores/store";
import { AppLog, Price, TAG } from "utils/Util";
import {
  getPaidAmountWithDiscount,
  getPercentageText,
  SplitPayment
} from "models/SplitPayment";
import EOrderType from "models/enums/EOrderType";

type Props = {
  order: Order;
  isOrderJustCompleted: boolean;
  onOrderStatusPress: () => void;
};

const OrderDetailsView: FC<Props> = ({
  order,
  isOrderJustCompleted,
  onOrderStatusPress
}) => {
  const { user } = useAppSelector((state: RootState) => state.auth);
  AppLog.log(() => "order in view: " + JSON.stringify(order), TAG.API);

  function itemAmountWithLabel(
    title?: string,
    amount?: string,
    leftAppLabelProps?: AppLabelProps,
    rightAppLabelProps?: AppLabelProps,
    tip?: string | undefined
  ) {
    return (
      <View>
        <View style={styles.titleWithAmount}>
          <AppLabel text={title} {...leftAppLabelProps} />
          <AppLabel text={amount} {...rightAppLabelProps} />
        </View>
        {tip && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: SPACE.md
            }}>
            <AppLabel text="Tip" />
            <AppLabel text={tip} textType={TEXT_TYPE.SEMI_BOLD} />
          </View>
        )}
      </View>
    );
  }

  const listItem = useCallback(
    ({ item, index }: { item: SplitPayment; index: number }) => {
      return itemAmountWithLabel(
        user!.id === item.id
          ? `You (Paid ${getPercentageText(
              item,
              menuItemPrice(order?.menu ?? order?.menuItems ?? [])
            )}%)`
          : `${item.name} (Paid ${getPercentageText(
              item,
              menuItemPrice(order?.menu ?? order?.menuItems ?? [])
            )}%)`,
        Price.toString(
          order?.establishment.region.currency_symbol,
          getPaidAmountWithDiscount(item)
        ),
        {
          style: [
            styles.blackLabelStyle,
            index === 0 ? { color: COLORS.theme?.primaryColor } : {}
          ],
          textType: index === 0 ? TEXT_TYPE.SEMI_BOLD : TEXT_TYPE.NORMAL
        },

        {
          style: [
            styles.blackLabelStyle,
            index === 0 ? { color: COLORS.theme?.primaryColor } : {}
          ],
          textType: TEXT_TYPE.SEMI_BOLD
        },
        user!.id === item.id && (order?.order_tip ?? 0) > 0
          ? Price.toString(
              order?.establishment.region.currency_symbol,
              order?.order_tip
            )
          : undefined
      );
    },
    [user, order]
  );

  return (
    <Screen style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingVertical: SPACE._2xl
        }}>
        {isOrderJustCompleted && (
          <AppLabel
            text={
              order.type === EOrderType.DELIVERY
                ? STRINGS.orderType.placed_order_for_deliver
                : STRINGS.orderType.placed_order
            }
            textType={TEXT_TYPE.SEMI_BOLD}
            numberOfLines={0}
            style={{
              marginHorizontal: SPACE._2xl,
              textAlign: "center",
              marginBottom: SPACE.lg
            }}
          />
        )}

        {order && (
          <View style={styles.orderSummary}>
            <OrderSummary order={order} />
          </View>
        )}

        {((order?.payment_split?.length ?? 0) > 1 ||
          ((order?.payment_split?.length ?? 0) === 1 &&
            user?.id !== order?.payment_split?.[0]?.id)) && (
          <View>
            <AppLabel
              text={"Split Bill"}
              textType={TEXT_TYPE.BOLD}
              style={styles.splitText}
            />
            <View style={styles.paymentSplitContainer}>
              <ScrollView
                horizontal={true}
                scrollEnabled={false}
                contentContainerStyle={{ flex: 1 }}>
                <FlatListWithPb
                  data={order.payment_split}
                  renderItem={listItem}
                  style={{ flex: 1 }}
                  ItemSeparatorComponent={() => (
                    <View style={styles.separator}>
                      <Separator color={COLORS.white} thickness={1.0} />
                    </View>
                  )}
                />
              </ScrollView>
            </View>
          </View>
        )}
      </ScrollView>

      {isOrderJustCompleted && (
        <TouchableOpacity
          onPress={onOrderStatusPress}
          style={{ alignItems: "center" }}>
          <AppLabel
            text={"View order status"}
            style={styles.orderStatus}
            textType={TEXT_TYPE.SEMI_BOLD}
          />
        </TouchableOpacity>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.theme?.primaryBackground,
    justifyContent: "center"
  },
  titleWithAmount: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: SPACE.md
  },
  orderSummary: { paddingHorizontal: SPACE.lg },
  separator: { paddingTop: SPACE.md, paddingBottom: SPACE.md },
  blackLabelStyle: {
    color: COLORS.theme?.interface["900"],
    fontSize: FONT_SIZE._2xs
  },
  paymentSplitContainer: {
    marginHorizontal: SPACE.lg,
    borderRadius: 10,
    backgroundColor: COLORS.theme?.interface["100"]
  },
  splitText: { padding: SPACE.lg },
  orderStatus: {
    color: COLORS.theme?.primaryColor,
    marginBottom: SPACE._2lg,
    fontSize: FONT_SIZE.lg
  }
});

export default OrderDetailsView;
