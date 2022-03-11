import React, { FC, useCallback, useState } from "react";
import { PaymentMethod } from "models/enums/PaymentMethod";
import { FlatListWithPb } from "ui/components/organisms/flat_list/FlatListWithPb";
import { ItemPaymentMethod } from "ui/components/organisms/item_payment/ItemPaymentMethod";
import { Pressable, StyleSheet, View } from "react-native";
import { COLORS, FONT_SIZE, SPACE } from "config";
import Screen from "ui/components/atoms/Screen";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import { AppButton } from "ui/components/molecules/app_button/AppButton";
import { checkoutPrice, Order } from "models/Order";
import { Price } from "utils/Util";
import Plus from "assets/images/plus.svg";
import MultilineSpannableText from "ui/components/atoms/multiline_spannable_text/MultilineSpannableText";
import Checked from "assets/images/checkedButton.svg";
import UnChecked from "assets/images/unChecked.svg";
import { usePreventDoubleTap } from "hooks";

type Props = {
  paymentMethodData: PaymentMethod[];
  shouldShowProgressBar: boolean;
  onDeletePaymentMethod: (
    id: number,
    index: number,
    isSelected: boolean
  ) => void;
  shouldShowProgressBarOnDelete: boolean;
  deleteItemIndex: number;
  order: Order | undefined;
  selectedIndex: number;
  openAddAddress: () => void;
  refreshCallback: (onComplete?: () => void) => void;
  onContinueButtonPress: () => void;
  onApplePayPress: () => void;
  continueButtonProgress: boolean;
  showApplePay: boolean;
  applePayLoader: boolean;
  openTermsScreen: () => void;
};

export const MyPaymentMethodView: FC<Props> = ({
  paymentMethodData,
  shouldShowProgressBar,
  onDeletePaymentMethod,
  shouldShowProgressBarOnDelete,
  deleteItemIndex,
  order,
  selectedIndex,
  openAddAddress,
  refreshCallback,
  onContinueButtonPress,
  continueButtonProgress,
  showApplePay,
  onApplePayPress,
  applePayLoader,
  openTermsScreen
}) => {
  const [terms, setTerms] = useState(false);
  const listItem = useCallback(
    ({ item, index }: { item: PaymentMethod; index: number }) => {
      return (
        <ItemPaymentMethod
          payment={item}
          onDeletePaymentMethod={(
            _id: number,
            isSelected: boolean = false
          ) => onDeletePaymentMethod(item.id, index, isSelected)}
          shouldShowProgressBarOnDelete={
            shouldShowProgressBarOnDelete && index === deleteItemIndex
          }
          isSelected={selectedIndex === index && order !== undefined}
        />
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onDeletePaymentMethod]
  );

  const termsClick = usePreventDoubleTap(
    () => setTerms((prev) => !prev),
    200
  );

  return (
    <Screen
      style={styles.container}
      bottomSafeAreaColor={COLORS.theme?.secondaryBackground}>
      <View style={{ flex: 1, paddingHorizontal: SPACE.lg }}>
        <FlatListWithPb
          data={paymentMethodData}
          shouldShowProgressBar={shouldShowProgressBar}
          renderItem={listItem}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          extraData={selectedIndex}
          pullToRefreshCallback={refreshCallback}
          retryCallback={refreshCallback}
          ListFooterComponent={() =>
            order ? (
              <Pressable onPress={openAddAddress}>
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: SPACE.lg,
                    flex: 1
                  }}>
                  <Plus
                    stroke={COLORS.theme?.primaryColor}
                    style={{ marginTop: 4 }}
                  />
                  <AppLabel
                    text="Add new payment card"
                    textType={TEXT_TYPE.SEMI_BOLD}
                    style={{
                      color: COLORS.theme?.primaryColor,
                      fontSize: FONT_SIZE.xs,
                      marginStart: SPACE.xs
                    }}
                  />
                </View>
              </Pressable>
            ) : null
          }
        />
      </View>

      {order && (
        <View style={[styles.bottomView]}>
          <View style={{ flexDirection: "row" }}>
            <Pressable
              onPress={termsClick}
              style={{
                marginEnd: SPACE.lg,
                marginTop: 2,
                paddingTop: SPACE._2md,
                paddingRight: SPACE.sm
              }}>
              {terms ? (
                <Checked stroke={COLORS.theme?.primaryColor} />
              ) : (
                <UnChecked />
              )}
            </Pressable>

            <MultilineSpannableText
              numberOfLines={0}
              rootTextStyle={{
                marginTop: SPACE._2md,
                marginBottom: SPACE.md
              }}
              text={[
                "Please accept the ",
                "Terms and Conditions",
                " to continue."
              ]}
              containerStyle={{
                flex: 1,
                flexDirection: "row"
              }}
              appLabelProps={[
                {
                  style: [
                    {
                      fontSize: FONT_SIZE._2xs,
                      color: COLORS.theme?.interface["900"]
                    }
                  ],
                  onPress: termsClick
                },
                {
                  style: [
                    {
                      fontSize: FONT_SIZE._2xs,
                      color: COLORS.theme?.primaryColor,
                      marginTop: 3
                    }
                  ],
                  onPress: openTermsScreen
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
          </View>

          {showApplePay && (
            <AppButton
              text={`Pay With Apple Pay - ${Price.toString(
                order.establishment.region.currency_symbol,
                checkoutPrice(order)
              )}`}
              textType={TEXT_TYPE.SEMI_BOLD}
              onPress={onApplePayPress}
              isDisable={!terms || applePayLoader}
              shouldShowProgressBar={applePayLoader}
              buttonStyle={{
                marginBottom: SPACE._2md,
                backgroundColor: COLORS.black
              }}
            />
          )}

          <AppButton
            text={`Continue - ${Price.toString(
              order.establishment.region.currency_symbol,
              checkoutPrice(order)
            )}`}
            textType={TEXT_TYPE.SEMI_BOLD}
            isDisable={
              (paymentMethodData?.length ?? 0) <= 0 ||
              continueButtonProgress ||
              !terms
            }
            onPress={onContinueButtonPress}
            shouldShowProgressBar={continueButtonProgress}
            buttonStyle={{
              marginBottom: SPACE._2md
            }}
          />
        </View>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  list: { flex: 1 },
  container: {
    flex: 1
  },
  bottomView: {
    backgroundColor: COLORS.theme?.interface[50],
    paddingHorizontal: SPACE.lg,
    // paddingBottom: SPACE.lg,
    borderTopColor: COLORS.theme?.borderColor,
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderWidth: 1
  }
});
