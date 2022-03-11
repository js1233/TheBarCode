import { COLORS, FONT_SIZE, SPACE } from "config";
import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";

type Props = {
  containerStyle?: StyleProp<ViewStyle>;
  text: string;
  isSelected: boolean;
};

const ItemSearchTab: React.FC<Props> = ({
  containerStyle,
  text,
  isSelected
}: Props) => {
  return (
    <View
      style={[
        styles.container,
        isSelected ? styles.selectedContainer : styles.unselectedContainer,
        containerStyle
      ]}>
      <AppLabel
        text={text}
        textType={isSelected ? TEXT_TYPE.SEMI_BOLD : TEXT_TYPE.NORMAL}
        style={[
          styles.text,
          isSelected ? styles.selectedText : styles.unselectedText
        ]}
      />
    </View>
  );
};

export default ItemSearchTab;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACE.lg,
    paddingVertical: SPACE.sm,
    borderRadius: 7,
    marginLeft: SPACE._2md
  },
  selectedContainer: {
    backgroundColor: COLORS.theme?.primaryShade["700"]
  },
  unselectedContainer: {
    backgroundColor: COLORS.theme?.interface["200"]
  },
  text: { fontSize: FONT_SIZE.sm },
  selectedText: {
    color: COLORS.white
  },
  unselectedText: {
    color: COLORS.theme?.interface["700"]
  }
});
