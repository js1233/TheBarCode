import { COLORS, FONT_SIZE } from "config";
import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";

type Props = {
  containerStyle?: StyleProp<ViewStyle>;
  day: string;
  time: string;
  isCurrent: boolean;
};

const ItemVenueTiming: React.FC<Props> = ({
  containerStyle,
  day,
  time,
  isCurrent
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <AppLabel
        style={[
          styles.day,
          isCurrent
            ? { color: COLORS.theme?.interface["700"] }
            : { color: COLORS.theme?.interface["500"] }
        ]}
        text={day}
        textType={isCurrent ? TEXT_TYPE.SEMI_BOLD : TEXT_TYPE.NORMAL}
      />
      <AppLabel
        style={[
          styles.time,
          isCurrent
            ? { color: COLORS.theme?.interface["700"] }
            : { color: COLORS.theme?.interface["500"] }
        ]}
        text={time}
        textType={isCurrent ? TEXT_TYPE.SEMI_BOLD : TEXT_TYPE.NORMAL}
      />
    </View>
  );
};

export default ItemVenueTiming;

const styles = StyleSheet.create({
  container: { flexDirection: "row" },
  day: { flexGrow: 1, fontSize: FONT_SIZE._2xs },
  time: { fontSize: FONT_SIZE._2xs }
});
