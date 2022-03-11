import { COLORS, FONT_SIZE, SPACE } from "config";
import Strings from "config/Strings";
import { OptionsData } from "models/OptionsData";
import { Order } from "models/Order";
import React, { FC, useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import Screen from "ui/components/atoms/Screen";
import {
  AppButton,
  BUTTON_TYPES
} from "ui/components/molecules/app_button/AppButton";
import OrderSummary from "ui/components/organisms/order_summary/OrderSummary";
import RadioButtonActive from "assets/images/radio-btn-active.svg";
import RadioButtonInActive from "assets/images/radio-btn-inactive.svg";
import Separator, { Type } from "ui/components/atoms/separator/Separator";
import { AppInputField } from "ui/components/molecules/appinputfield/AppInputField";
import SimpleToast from "react-native-simple-toast";
import ESplitType from "models/enums/ESplitType";

type Props = {
  order: Order;
  radioData: OptionsData[];
  onButtonPress: (value: {
    payByMe: number;
    splitType: ESplitType;
  }) => void;
};
export const SplitTypeView: FC<Props> = ({ order, onButtonPress }) => {
  const [selectedType, setSelectedType] = useState<number>(0);
  const [percentage, setPercentage] = useState<number | undefined>();
  const [fixedAmount, setFixedAmount] = useState<number | undefined>();

  const setSelectedOrderType = useCallback((index: number) => {
    setSelectedType(index);
  }, []);

  const getRadioButton = (index: number) => {
    return selectedType === index ? (
      <RadioButtonActive stroke={COLORS.theme?.borderColor} />
    ) : (
      <RadioButtonInActive stroke={COLORS.theme?.borderColor} />
    );
  };

  const onSubmit = () => {
    let payByMe: number = 0.0;

    switch (selectedType) {
      case 0:
        payByMe = order.total / 2;
        onButtonPress({
          payByMe: order.total / 2,
          splitType: ESplitType.SPLIT_FIFTY_FIFTY
        });

        return;
      case 1: //dine in
        if (!fixedAmount) {
          SimpleToast.show("Amount field is required");
          return;
        } else if (fixedAmount <= 0 || fixedAmount! > order.total) {
          SimpleToast.show("Invalid Amount");
          return;
        }
        onButtonPress({
          payByMe: fixedAmount,
          splitType: ESplitType.SPLIT_FIXED_AMOUNT
        });
        return;

      case 2:
        if (!percentage) {
          SimpleToast.show("Percentage field is required");
          return;
        } else if (percentage <= 0 || percentage > 100) {
          SimpleToast.show("Invalid Percentage");
          return;
        }
        payByMe = (percentage * order?.total) / 100;

        onButtonPress({
          payByMe: payByMe,
          splitType: ESplitType.SPLIT_BY_PERCENTAGE
        });

        return;

      default:
        return;
    }
  };

  return (
    <Screen style={styles.container}>
      <ScrollView>
        <View style={{ paddingHorizontal: SPACE.lg }}>
          {order && <OrderSummary order={order} />}

          <AppLabel
            text={Strings.splitType.split_text}
            textType={TEXT_TYPE.BOLD}
            style={styles.textStyle}
          />
          <View
            style={[
              styles.tableService,
              {
                backgroundColor:
                  COLORS.theme?.interface[
                    selectedType !== 0 ? "200" : "100"
                  ]
              }
            ]}>
            <Pressable
              style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1.0 }]}
              onPress={() => {
                setSelectedOrderType(0);
              }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}>
                <AppLabel
                  text={"50 - 50 Equal Split"}
                  style={styles.selectOrder}
                  textType={TEXT_TYPE.SEMI_BOLD}
                />

                {getRadioButton(0)}
              </View>
            </Pressable>
          </View>
          <View
            style={[
              styles.tableService,
              {
                backgroundColor:
                  COLORS.theme?.interface[
                    selectedType !== 1 ? "200" : "100"
                  ]
              }
            ]}>
            <Pressable
              style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1.0 }]}
              onPress={() => {
                setSelectedOrderType(1);
              }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}>
                <AppLabel
                  text={"Split by fixed amount"}
                  style={styles.selectOrder}
                  textType={TEXT_TYPE.SEMI_BOLD}
                />

                {getRadioButton(1)}
              </View>
              {selectedType === 1 && (
                <>
                  <View style={{ marginBottom: SPACE.md }} />
                  <Separator
                    type={Type.HORIZONTAL}
                    color={COLORS.white}
                    thickness={1}
                  />
                  <View style={{ marginTop: SPACE._2md }}>
                    <AppInputField
                      viewStyle={[styles.inputFieldContainer]}
                      placeholder="Enter amount"
                      placeholderTextColor={COLORS.theme?.interface["500"]}
                      onChangeText={(text) => {
                        setFixedAmount(Number(text));
                      }}
                      keyboardType="number-pad"
                    />
                  </View>
                </>
              )}
            </Pressable>
          </View>

          <View
            style={[
              styles.tableService,
              {
                backgroundColor:
                  COLORS.theme?.interface[
                    selectedType !== 2 ? "200" : "100"
                  ]
              }
            ]}>
            <Pressable
              style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1.0 }]}
              onPress={() => {
                setSelectedOrderType(2);
              }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}>
                <AppLabel
                  text={"Split by percentage (%)"}
                  style={styles.selectOrder}
                  textType={TEXT_TYPE.SEMI_BOLD}
                />

                {getRadioButton(2)}
              </View>
              {selectedType === 2 && (
                <>
                  <View style={{ marginBottom: SPACE.md }} />
                  <Separator
                    type={Type.HORIZONTAL}
                    color={COLORS.white}
                    thickness={1}
                  />
                  <View style={{ marginTop: SPACE._2md }}>
                    <AppInputField
                      viewStyle={[styles.inputFieldContainer]}
                      placeholder={"Enter Percentage"}
                      placeholderTextColor={COLORS.theme?.interface["500"]}
                      onChangeText={(text) => setPercentage(Number(text))}
                      keyboardType="number-pad"
                    />
                  </View>
                </>
              )}
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.bottomView]}>
        <AppButton
          text={Strings.splitType.btn_text}
          textType={TEXT_TYPE.SEMI_BOLD}
          buttonType={BUTTON_TYPES.NORMAL}
          onPress={() => {
            onSubmit();
          }}
        />
      </View>
    </Screen>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: SPACE._2xl
  },
  textStyle: {
    fontSize: FONT_SIZE.base,
    marginTop: SPACE.md
  },
  selectOrder: {
    color: COLORS.theme?.interface["900"],
    fontSize: FONT_SIZE._2xs
  },
  inputFieldContainer: {
    marginTop: SPACE.xs,
    height: 44,
    backgroundColor: COLORS.theme?.primaryBackground,
    borderColor: COLORS.theme?.borderColor
  },
  tableService: {
    marginTop: SPACE.lg,
    paddingHorizontal: SPACE.md,
    paddingVertical: SPACE._2md,
    backgroundColor: COLORS.theme?.primaryBackground,
    borderRadius: 10
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
