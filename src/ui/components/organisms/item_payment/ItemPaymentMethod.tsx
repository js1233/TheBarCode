import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Trash from "assets/images/trash.svg";
import CreditCard from "assets/images/ic_credit_card.svg";
import { PaymentMethod } from "models/enums/PaymentMethod";
import { COLORS, FONT_SIZE, SPACE } from "config";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import { LinkButton } from "ui/components/atoms/link_button/LinkButton";

type Props = {
  payment: PaymentMethod;
  onDeletePaymentMethod: (id: number, isSelected?: boolean) => void;
  shouldShowProgressBarOnDelete: boolean;
  isSelected: boolean;
};

export const ItemPaymentMethod = React.memo<Props>(
  ({
    payment,
    onDeletePaymentMethod,
    shouldShowProgressBarOnDelete,
    isSelected = false
  }) => {
    let hideString = "\u2022";
    return (
      <View
        style={[
          styles.container,
          {
            borderColor: isSelected
              ? COLORS.theme?.primaryColor
              : COLORS.theme?.borderColor
          }
        ]}>
        <Pressable
          style={({ pressed }) => [
            { opacity: pressed && isSelected ? 0.5 : 1.0 }
          ]}
          onPress={() => {
            onDeletePaymentMethod(payment.id, true);
          }}>
          <View style={styles.iconWithMessage}>
            <View style={styles.roundedIcon}>
              <CreditCard width={18} height={18} />
            </View>
            <View style={styles.descriptionContainer}>
              <AppLabel
                text={
                  hideString.repeat(4) +
                  " " +
                  hideString.repeat(4) +
                  " " +
                  hideString.repeat(4) +
                  " " +
                  payment.ending_in
                }
                numberOfLines={0}
                style={styles.cardNo}
                textType={TEXT_TYPE.NORMAL}
              />
              <View style={styles.bottomContainer}>
                <AppLabel
                  text={payment.name.toUpperCase()}
                  style={styles.title}
                  textType={TEXT_TYPE.SEMI_BOLD}
                />
                <LinkButton
                  text={""}
                  textType={TEXT_TYPE.SEMI_BOLD}
                  leftIcon={() => (
                    <Trash
                      width={18}
                      height={18}
                      onPress={() => onDeletePaymentMethod(payment.id)}
                    />
                  )}
                  shouldShowProgressBar={shouldShowProgressBarOnDelete}
                />
              </View>
            </View>
          </View>
        </Pressable>
      </View>
    );
  }
);

export const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.theme?.primaryBackground,
    borderRadius: 12,
    borderWidth: 0.5,
    paddingTop: SPACE.md,
    paddingLeft: SPACE.md,
    paddingBottom: SPACE.lg,
    paddingRight: SPACE.md,
    marginTop: SPACE.lg
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  iconWithMessage: {
    flexDirection: "row"
  },
  roundedIcon: {
    width: 30,
    height: 30,
    backgroundColor: COLORS.theme?.primaryBackground,
    borderRadius: 30,
    borderColor: COLORS.theme?.borderColor,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center"
  },
  editIcon: {
    marginRight: SPACE.lg
  },
  descriptionContainer: { marginLeft: SPACE._2md, flex: 1 },
  cardNo: {
    color: COLORS.theme?.interface[900]
  },
  title: {
    fontSize: FONT_SIZE._3xs,
    paddingTop: SPACE._2md,
    color: COLORS.theme?.interface[700]
  }
});
