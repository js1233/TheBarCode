import { COLORS, FONT_SIZE } from "config";
import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";

type Props = {
  containerStyle?: StyleProp<ViewStyle>;
  label: string;
  value: string;
};

export function ReloadBannerInfo({ containerStyle, label, value }: Props) {
  return (
    <View style={[styles.container, containerStyle]}>
      <AppLabel
        style={styles.value}
        text={value}
        textType={TEXT_TYPE.SEMI_BOLD}
      />
      <AppLabel style={styles.label} text={label} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "column", alignItems: "center" },
  value: { fontSize: FONT_SIZE.sm, color: COLORS.white },
  label: {
    fontSize: FONT_SIZE._3xs,
    color: COLORS.theme?.interface["200"]
  }
});
