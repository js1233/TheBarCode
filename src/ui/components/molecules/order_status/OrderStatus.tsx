import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import EOrderStatus, {
  getStatusProperty,
  StatusProperty
} from "models/enums/EOrderStatus";
import { COLORS, FONT_SIZE, SPACE } from "config";

type Props = {
  containerStyle?: StyleProp<ViewStyle>;
  status: EOrderStatus;
};

export const OrderStatus: React.FC<Props> = ({
  containerStyle,
  status
}) => {
  const statusProperty: StatusProperty = getStatusProperty(status);
  return (
    <View
      style={[
        styles.statusContainer,
        { backgroundColor: statusProperty.backgroundColor },
        containerStyle
      ]}>
      <AppLabel
        text={statusProperty.displayText}
        textType={TEXT_TYPE.BOLD}
        style={[styles.status, { color: COLORS.theme?.primaryBackground }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  statusContainer: {
    paddingVertical: SPACE.xs,
    paddingHorizontal: SPACE.lg,
    borderRadius: 8,
    justifyContent: "center"
  },
  status: {
    color: COLORS.black,
    fontSize: FONT_SIZE._3xs
  }
});
