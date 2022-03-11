import { COLORS, FONT_SIZE, SPACE } from "config";
import Strings from "config/Strings";
import {
  offerGetDiscount,
  OrderOffer
} from "models/api_responses/OfferDetailsResponseModel";
import { DropDownItem } from "models/DropDownItem";
import EScreen from "models/enums/EScreen";
import { OptionsData } from "models/OptionsData";
import {
  checkoutPrice,
  getOrderWithOutBundleBogoItems,
  isOrderContainBundleBogo,
  Order,
  payingAmountWithOutDeliveryChargesAndTip
} from "models/Order";
import React, { FC, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import MultilineSpannableText from "ui/components/atoms/multiline_spannable_text/MultilineSpannableText";
import {
  DIRECTION_TYPE,
  RadioGroup
} from "ui/components/atoms/radio_group/RadioGroup";
import Screen from "ui/components/atoms/Screen";
import {
  AppButton,
  BUTTON_TYPES
} from "ui/components/molecules/app_button/AppButton";
import OrderSummary from "ui/components/organisms/order_summary/OrderSummary";
import { AppLog, Price, shadowStyleProps, TAG } from "utils/Util";
import InfoCircle from "assets/images/ic_info_circle.svg";

type Props = {
  offerDetailsData: OptionsData[];
  order: Order;
  onPress: (order: Order) => void;
  offersMessage: string | null;
  isError: boolean;
  isReloadRequired: boolean;
  onReloadClick: () => void;
  offers: OrderOffer[];
  isLoading: boolean;
};

export const MemberDiscountView: FC<Props> = ({
  offerDetailsData,
  order,
  onPress,
  offersMessage,
  isError,
  isReloadRequired,
  onReloadClick,
  offers,
  isLoading
}) => {
  const [selectedOfferText, setSelectedOfferText] = useState<string>();
  const onSelectionChange = (item: DropDownItem) => {
    if (item) {
      // AppLog.log(
      //   () => "OnSelectionChange item#" + JSON.stringify(item),
      //   TAG.Order_Summary
      // );

      if (offers.find((_item) => _item.text === item.value)) {
        let offer = offers.find((_item) => _item.text === item.value)!;

        if (offersMessage?.includes("credit will be deducted")) {
          offer.user_credit = true;
        }
        order.offer = offer;

        AppLog.log(
          () =>
            "OnSelectionChange#" + JSON.stringify(checkoutPrice(order)),
          TAG.Order_Summary
        );
      } else {
        AppLog.log(
          () =>
            "OnSelectionChange# else" +
            JSON.stringify(checkoutPrice(order)),
          TAG.Order_Summary
        );

        order.offer = undefined;
      }
      setSelectedOfferText(item.text);
    }
  };

  return (
    <Screen style={styles.container} shouldAddBottomInset={true}>
      <ScrollView
        style={styles.scrollView}
        keyboardShouldPersistTaps={"handled"}
        contentContainerStyle={styles.scrollView}>
        <View style={{ paddingHorizontal: SPACE.lg }}>
          <OrderSummary
            order={order}
            showMenuItem={false}
            eScreen={EScreen.MEMBER_DISCOUNT}
          />
          <AppLabel
            text={Strings.memberDiscount.redeem_offer}
            textType={TEXT_TYPE.BOLD}
            style={styles.textStyle}
          />
          <RadioGroup
            values={offerDetailsData}
            direction={DIRECTION_TYPE.VERTICAL}
            onChange={onSelectionChange}
            showCustomIcons={true}
            strokeColorOnCustomIcon="#727272"
          />

          {isLoading && (
            <ActivityIndicator
              testID="initial-loader"
              size="large"
              color={COLORS.theme?.interface["900"]}
              style={[
                styles.initialPb,
                { backgroundColor: COLORS.theme?.primaryBackground }
              ]}
            />
          )}
          {offersMessage !== "" && offersMessage !== null && (
            <AppLabel
              text={offersMessage}
              numberOfLines={0}
              style={{
                marginTop: SPACE.md,
                color: isError
                  ? COLORS.red
                  : COLORS.theme?.interface["700"],
                fontSize: FONT_SIZE._2xs
              }}
            />
          )}

          {isReloadRequired && (
            <>
              <MultilineSpannableText
                rootTextStyle={{
                  marginTop: SPACE.md
                }}
                text={["Please", " Click here", " to reload."]}
                containerStyle={{
                  flexDirection: "row"
                }}
                appLabelProps={[
                  {
                    style: [
                      {
                        fontSize: FONT_SIZE._2xs,
                        color: COLORS.theme?.interface["900"]
                      }
                    ]
                  },
                  {
                    style: [
                      {
                        fontSize: FONT_SIZE._2xs,
                        color: COLORS.theme?.primaryColor,
                        marginTop: 3
                      }
                    ],
                    onPress: onReloadClick
                  },
                  {
                    style: [
                      {
                        fontSize: FONT_SIZE._2xs,
                        color: COLORS.theme?.interface["900"]
                      }
                    ]
                  }
                ]}
              />
            </>
          )}

          {selectedOfferText && selectedOfferText !== "none" && (
            <View
              style={{
                marginTop: SPACE._2xl,
                borderRadius: 10,
                paddingVertical: SPACE.md,
                paddingHorizontal: SPACE.md,
                backgroundColor: COLORS.theme?.interface["200"],
                ...shadowStyleProps
              }}>
              <AppLabel
                text="Offer"
                style={{
                  textTransform: "uppercase",
                  fontSize: FONT_SIZE._2xs
                }}
                textType={TEXT_TYPE.SEMI_BOLD}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: SPACE.sm
                }}>
                <AppLabel text={order.offer?.text} />

                <AppLabel
                  text={`Saving ${offerGetDiscount(
                    payingAmountWithOutDeliveryChargesAndTip(
                      getOrderWithOutBundleBogoItems({ ...order })
                    ),
                    order.offer,
                    order.establishment.region.currency_symbol
                  )}`}
                  textType={TEXT_TYPE.SEMI_BOLD}
                  style={{
                    color: COLORS.theme?.primaryColor
                  }}
                />
              </View>
            </View>
          )}
          {!isLoading && isOrderContainBundleBogo(order) && (
            <View
              style={{ flexDirection: "row", marginVertical: SPACE.md }}>
              <InfoCircle
                width={15}
                height={15}
                fill={COLORS.theme?.primaryShade[700]}
                style={{ marginTop: 1 }}
              />
              <AppLabel
                text="Please note the discount will only be applied on single items."
                numberOfLines={0}
                style={{
                  paddingLeft: SPACE.xs,
                  color: COLORS.theme?.primaryShade[700],
                  fontSize: FONT_SIZE._3xs
                }}
              />
            </View>
          )}
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
          onPress={() => onPress(order)}
          isDisable={isLoading}
        />
      </View>
    </Screen>
  );
};
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: SPACE._2xl,
    backgroundColor: COLORS.theme?.primaryBackground
  },
  scrollView: {
    flex: 1
  },
  textStyle: {
    fontSize: FONT_SIZE.base,
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
  },
  initialPb: {
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center"
  }
});
