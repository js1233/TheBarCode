import { FONT_SIZE, SPACE } from "config";
import Colors from "config/Colors";
import { KeyValue } from "models/KeyValue";
import React from "react";
import { StyleProp, StyleSheet, TextStyle, View } from "react-native";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";

export interface ItemTimingProps {
  data: KeyValue;
  isSelected: boolean;
  selectedItemColor?: StyleProp<TextStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const ItemTiming = React.memo<ItemTimingProps>(
  ({ data, isSelected, selectedItemColor, textStyle }) => {
    return (
      <View style={styles.container}>
        <AppLabel
          text={data.label}
          style={[
            styles.title,
            isSelected ? selectedItemColor : textStyle
          ]}
          textType={isSelected ? TEXT_TYPE.BOLD : TEXT_TYPE.NORMAL}
        />
        <AppLabel
          textType={isSelected ? TEXT_TYPE.BOLD : TEXT_TYPE.NORMAL}
          text={data.value}
          style={[
            styles.title,
            isSelected ? selectedItemColor : textStyle
          ]}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    paddingLeft: SPACE.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: SPACE.lg
  },
  title: {
    alignSelf: "center",
    fontSize: FONT_SIZE.sm,
    paddingTop: SPACE.xl,
    color: Colors.colors.black
  },
  toggleIconContainer: {
    marginTop: SPACE.lg
  }
});
