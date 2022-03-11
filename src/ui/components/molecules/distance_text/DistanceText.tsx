import Pin from "assets/images/pin.svg";
import { COLORS, FONT_SIZE, SPACE } from "config";
import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { AppLabel } from "ui/components/atoms/app_label/AppLabel";
import { milesText } from "utils/Util";

type Props = {
  containerStyle?: StyleProp<ViewStyle>;
  distance: number;
};

function DistanceText({ containerStyle, distance }: Props) {
  return (
    <View style={[styles.container, containerStyle]}>
      <Pin style={styles.icon} />
      <AppLabel text={`${milesText(distance)} away`} style={styles.text} />
    </View>
  );
}
export default DistanceText;

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center" },
  icon: {},
  text: {
    marginStart: SPACE._2xs,
    fontSize: FONT_SIZE._3xs,
    color: COLORS.theme?.primaryShade["700"]
  }
});
