import { COLORS, FONT_SIZE, SPACE } from "config";
import Strings from "config/Strings";
import React, { FC } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import QRCode from "react-native-qrcode-svg";
import Screen from "ui/components/atoms/Screen";
import {
  AppButton,
  BUTTON_TYPES
} from "ui/components/molecules/app_button/AppButton";
import { checkoutPrice, Order } from "models/Order";
import OrderSummary from "ui/components/organisms/order_summary/OrderSummary";
import { Price } from "utils/Util";

type Props = {
  order: Order;
  onPress: () => void;
};
export const SplitTheBillView: FC<Props> = ({ order, onPress }) => {
  return (
    <Screen style={styles.container} shouldAddBottomInset={true}>
      <ScrollView
        keyboardShouldPersistTaps={"handled"}
        contentContainerStyle={styles.scrollView}>
        <View style={{ paddingHorizontal: SPACE.lg }}>
          <OrderSummary order={order} showMenuItem={false} />

          <AppLabel
            text={Strings.SplitTheBill.head}
            textType={TEXT_TYPE.BOLD}
            numberOfLines={0}
            style={[styles.textStyle, { fontSize: FONT_SIZE.sm }]}
          />
          <AppLabel
            text={Strings.SplitTheBill.text}
            numberOfLines={0}
            style={[
              styles.textStyle,
              {
                color: COLORS.theme?.interface["700"],
                fontSize: FONT_SIZE._3xs
              }
            ]}
          />
          <View style={styles.qrCode}>
            <QRCode value={order.id.toString()} size={150} />
          </View>
          <AppLabel
            text={Strings.SplitTheBill.ins_text}
            textType={TEXT_TYPE.SEMI_BOLD}
            numberOfLines={0}
            style={[
              styles.textStyle,
              {
                color: COLORS.theme?.primaryShade[700],
                fontSize: FONT_SIZE.sm
              }
            ]}
          />
        </View>
      </ScrollView>

      <View style={[styles.bottomView]}>
        <AppButton
          text={`Continue - ${Price.toString(
            order.establishment.region.currency_symbol,
            checkoutPrice(order)
          )}`}
          textType={TEXT_TYPE.SEMI_BOLD}
          buttonType={BUTTON_TYPES.NORMAL}
          onPress={onPress}
        />
      </View>
    </Screen>
  );
};
const styles = StyleSheet.create({
  scrollView: {
    flex: 1
  },
  qrCode: {
    alignSelf: "center",
    padding: SPACE.lg
  },
  container: {
    flex: 1,
    paddingTop: SPACE._2xl,

    backgroundColor: COLORS.theme?.primaryBackground
  },
  scrollViewContent: {
    flexGrow: 1,
    flexDirection: "column"
  },
  textStyle: {
    textAlign: "center",
    marginTop: SPACE.md
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
