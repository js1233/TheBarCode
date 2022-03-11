import { COLORS, FONT_SIZE, SPACE } from "config";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";

import Home from "assets/images/home.svg";
import Location from "assets/images/location.svg";
import Office from "assets/images/office.svg";
import Edit from "assets/images/edit.svg";
import Trash from "assets/images/trash.svg";
import { Address } from "models/Address";
import { AppButton } from "ui/components/molecules/app_button/AppButton";
import { ActivityIndicator } from "react-native-paper";

type Props = {
  address: Address;
  onDeleteAddress: (id: number) => void;
  openEditAddress: (address: Address) => void;
  selectAddress: (address: Address) => void;
  showSelectAddressBtn: boolean;
  shouldShowProgressBarOnDelete: boolean;
};

export const ItemAddress = React.memo<Props>(
  ({
    address,
    onDeleteAddress,
    openEditAddress,
    selectAddress,
    showSelectAddressBtn,
    shouldShowProgressBarOnDelete
  }) => {
    return (
      <View style={styles.container}>
        <View style={styles.iconWithMessage}>
          <View style={styles.roundedIcon}>
            {address.title === "Home" ? (
              <Home width={18} height={18} />
            ) : address.title === "Office" ? (
              <Office width={18} height={18} />
            ) : (
              <Location width={18} height={18} />
            )}
          </View>
          <View style={styles.descriptionContainer}>
            <AppLabel
              text={address.address}
              numberOfLines={0}
              style={styles.message}
              textType={TEXT_TYPE.NORMAL}
            />
            <View style={styles.bottomContainer}>
              <AppLabel
                text={address.title.toUpperCase()}
                style={styles.title}
                textType={TEXT_TYPE.SEMI_BOLD}
              />
              <View style={styles.innerContainer}>
                <Pressable
                  style={{
                    paddingVertical: SPACE._2xs
                  }}
                  onPress={() => openEditAddress(address)}>
                  <Edit width={18} height={18} style={styles.editIcon} />
                </Pressable>
                <Pressable
                  style={{
                    padding: SPACE._2xs
                  }}
                  onPress={() => onDeleteAddress(address.id)}>
                  {!shouldShowProgressBarOnDelete && (
                    <Trash width={18} height={18} />
                  )}
                  {shouldShowProgressBarOnDelete && (
                    <ActivityIndicator
                      size={SPACE.lg}
                      color={COLORS.theme?.primaryShade[800]}
                    />
                  )}
                </Pressable>
              </View>
            </View>
          </View>
        </View>
        {showSelectAddressBtn && (
          <AppButton
            text="Select Address"
            buttonStyle={styles.btn}
            textType={TEXT_TYPE.SEMI_BOLD}
            onPress={() => {
              selectAddress(address);
            }}
          />
        )}
      </View>
    );
  }
);

export const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.theme?.primaryBackground,
    borderColor: COLORS.theme?.borderColor,
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
  innerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: SPACE.sm
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
  message: {
    color: COLORS.theme?.interface[900]
  },
  title: {
    fontSize: FONT_SIZE._3xs,
    paddingTop: SPACE.sm,
    color: COLORS.theme?.interface[700]
  },
  btn: {
    marginTop: SPACE.md
  }
});
