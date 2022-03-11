import React, { FC, useCallback } from "react";
import { checkoutPrice, menuItemPrice, Order } from "models/Order";
import Screen from "ui/components/atoms/Screen";
import OrderSummary from "ui/components/organisms/order_summary/OrderSummary";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import { COLORS, FONT_SIZE, SPACE } from "config";
import {
  AppLabel,
  AppLabelProps,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import { FlatListWithPb } from "ui/components/organisms/flat_list/FlatListWithPb";
import Separator from "ui/components/atoms/separator/Separator";
import { useAppSelector } from "hooks/redux";
import { RootState } from "stores/store";
import { Price } from "utils/Util";
import {
  getPaidAmountWithDiscount,
  getPercentageText,
  SplitPayment
} from "models/SplitPayment";
import {
  AppButton,
  BUTTON_TYPES
} from "ui/components/molecules/app_button/AppButton";

type Props = {
  order: Order | undefined;
  onPress: (order: Order) => void;
  isLoading: boolean;
};

const OrderReviewScreen: FC<Props> = ({ order, onPress, isLoading }) => {
  const { user } = useAppSelector((state: RootState) => state.auth);

  function itemAmountWithLabel(
    title?: string,
    amount?: string,
    leftAppLabelProps?: AppLabelProps,
    rightAppLabelProps?: AppLabelProps,
    tip?: string | undefined
  ) {
    return (
      <View style={styles.titleWithAmount}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between"
          }}>
          <AppLabel text={title} {...leftAppLabelProps} />
          <AppLabel text={amount} {...rightAppLabelProps} />
        </View>
        {tip && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between"
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
          ? `You (Pay ${getPercentageText(
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
    [order, user]
  );

  return (
    <Screen style={styles.container} shouldAddBottomInset={true}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingVertical: SPACE._2xl
        }}>
        <View style={{ paddingHorizontal: SPACE.lg }}>
          {order && <OrderSummary order={order} />}

          {((order?.payment_split?.length ?? 0) > 0 ||
            (order?.payment_split?.length === 0 &&
              user?.id !== order?.payment_split?.[0]?.id)) && (
            <View>
              {(order?.payment_split?.length ?? 0) > 0 && (
                <AppLabel
                  text={"Split Bill"}
                  textType={TEXT_TYPE.BOLD}
                  style={styles.splitText}
                />
              )}
              <View style={styles.paymentSplitContainer}>
                <ScrollView
                  horizontal={true}
                  scrollEnabled={false}
                  contentContainerStyle={{
                    flex: 1
                  }}>
                  <FlatListWithPb
                    data={order!.payment_split}
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
        </View>
      </ScrollView>

      {order && (
        <View style={[styles.bottomView]}>
          <AppButton
            text={`Continue - ${Price.toString(
              order?.establishment?.region?.currency_symbol,
              checkoutPrice(order!)
            )}`}
            textType={TEXT_TYPE.SEMI_BOLD}
            buttonType={BUTTON_TYPES.NORMAL}
            onPress={() => onPress(order)}
          />
        </View>
      )}

      {isLoading && (
        <View
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "red"
          }}>
          <ActivityIndicator
            testID="initial-loader"
            size="large"
            color={COLORS.theme?.interface["900"]}
            style={[
              styles.initialPb,
              { backgroundColor: COLORS.theme?.primaryBackground }
            ]}
          />
        </View>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.theme?.primaryBackground
  },
  titleWithAmount: {
    justifyContent: "space-between",
    padding: SPACE.md
  },
  orderSummary: { paddingHorizontal: SPACE.lg },
  separator: {
    marginHorizontal: SPACE.md
  },
  blackLabelStyle: {
    color: COLORS.theme?.interface["900"],
    fontSize: FONT_SIZE._2xs
  },
  paymentSplitContainer: {
    borderRadius: 10,
    backgroundColor: COLORS.theme?.interface["100"]
  },
  splitText: { marginVertical: SPACE.lg },
  initialPb: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  bottomView: {
    backgroundColor: COLORS.theme?.interface[50],
    paddingHorizontal: SPACE.lg,
    // paddingBottom: SPACE.lg,
    borderTopColor: COLORS.theme?.borderColor,
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderWidth: 1,
    paddingTop: SPACE._2md
  }
});

export default OrderReviewScreen;
