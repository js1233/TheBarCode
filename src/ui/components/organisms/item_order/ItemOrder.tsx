import { COLORS, FONT_SIZE, SPACE } from "config";
import usePreferredTheme from "hooks/theme/usePreferredTheme";
import React, { useCallback } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import { OrderStatus } from "ui/components/molecules/order_status/OrderStatus";
import RightArrow from "assets/images/ic_right_arrow.svg";
import { toString } from "models/DateTime";
import { Order } from "models/Order";
import { AppButton } from "ui/components/molecules/app_button/AppButton";
import Strings from "config/Strings";
import EOrderStatus from "models/enums/EOrderStatus";

type Props = {
  order: Order;
  onPress?: (order: Order) => void;
  onReOrder: (order: Order) => void;
  onCancelOrderClick: (order: Order) => void;
  shouldShowProgressBar?: boolean;
  cancelOrderLoader?: boolean;
};

const ItemOrder = React.memo<Props>(
  ({
    order,
    onPress,
    onReOrder,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onCancelOrderClick,
    shouldShowProgressBar,
    cancelOrderLoader
  }) => {
    const { themedColors } = usePreferredTheme();
    const _onPress = useCallback(() => {
      onPress?.(order);
    }, [onPress, order]);
    return (
      <>
        <Pressable
          onPress={_onPress}
          style={[
            styles.container,
            { backgroundColor: COLORS.theme?.interface[100] }
          ]}>
          <View style={styles.dateAndOrderContainer}>
            <AppLabel
              text={"Order No# " + order.id.toString()}
              textType={TEXT_TYPE.SEMI_BOLD}
              style={[
                styles.orderText,
                { color: COLORS.theme?.interface[900] }
              ]}
            />
            <View style={styles.dateAndIcon}>
              <AppLabel
                text={toString(order.created_at)}
                style={[
                  styles.date,
                  { color: COLORS.theme?.interface[500] }
                ]}
              />
              <RightArrow
                width={14}
                height={14}
                fill={COLORS.theme?.interface[400]}
              />
            </View>
          </View>

          <View style={styles.nameAndStatusContainer}>
            <AppLabel
              text={order.establishment.title}
              style={styles.nameText}
            />
            <OrderStatus status={order.status!} />
          </View>
          <View style={styles.reasonContainer}>
            {order.status === "rejected" && (
              <AppLabel
                text={order.reason}
                numberOfLines={0}
                style={styles.rejectedReasonText}
              />
            )}
          </View>
          <View
            style={[
              styles.totalContainer,
              { backgroundColor: themedColors.secondaryBackground }
            ]}>
            <AppLabel
              text={
                order.establishment.region.currency_symbol +
                " " +
                order?.total?.toFixed(2).toString()
              }
              textType={TEXT_TYPE.SEMI_BOLD}
              style={[
                styles.orderText,
                { color: COLORS.theme?.primaryShade[700] }
              ]}
            />

            {order.offer_type !== "exclusive" && order.is_approved && (
              <AppButton
                text={Strings.reOrder.title}
                buttonStyle={styles.reOrder}
                textType={TEXT_TYPE.SEMI_BOLD}
                onPress={() => {
                  onReOrder(order);
                }}
                shouldShowProgressBar={shouldShowProgressBar}
              />
            )}

            {/* will do this work after backend */}
            {!order.is_approved &&
              order.status !== EOrderStatus.CANCELLED &&
              order.status !== EOrderStatus.REJECTED && (
                <AppButton
                  text={Strings.reOrder.cancel_order}
                  buttonStyle={[
                    styles.reOrder,
                    { backgroundColor: COLORS.red }
                  ]}
                  textType={TEXT_TYPE.SEMI_BOLD}
                  onPress={() => {
                    onCancelOrderClick(order);
                  }}
                  shouldShowProgressBar={cancelOrderLoader}
                />
              )}
          </View>
        </Pressable>
      </>
    );
  }
);

export const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    borderRadius: SPACE.md,
    marginVertical: SPACE._2md,
    paddingVertical: 10
  },
  dateAndOrderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACE.md
  },
  reOrder: {
    height: 40,
    marginTop: SPACE.md
  },
  reasonContainer: {
    marginLeft: SPACE.md
  },
  nameAndStatusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACE.md,
    marginTop: SPACE.md
  },
  rejectedReasonText: {
    color: COLORS.theme?.interface[500],
    fontStyle: "italic",
    padding: SPACE._2xs
  },
  nameText: {
    fontSize: FONT_SIZE.sm
  },
  orderText: {
    fontSize: FONT_SIZE._2xs,
    marginRight: SPACE._2xs
  },
  date: {
    fontSize: FONT_SIZE._2xs,
    marginRight: SPACE._2xs
  },
  totalContainer: {
    paddingHorizontal: SPACE.md,
    marginTop: SPACE._2xs
  },
  dateAndIcon: { flexDirection: "row", alignItems: "center" }
});

export default ItemOrder;
