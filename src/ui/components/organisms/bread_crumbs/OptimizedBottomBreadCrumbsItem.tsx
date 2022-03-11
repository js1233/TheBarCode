import React, { FC } from "react";
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from "react-native";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import { FONT_SIZE, SPACE } from "config/Dimens";

type Props = {
  title: string;
  onPress: () => void;
  style: StyleProp<ViewStyle>;
  textStyle: StyleProp<TextStyle>;
  textType: TEXT_TYPE;
};
const BottomBreadCrumbsItem: FC<Props> = ({
  title,
  onPress,
  style,
  textStyle,
  textType
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.mainContainer, style]}>
        <AppLabel
          text={title}
          style={[styles.text, textStyle]}
          textType={textType}
        />
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    borderRadius: 6,
    marginRight: SPACE.md
  },
  text: {
    fontSize: FONT_SIZE.xs,
    includeFontPadding: false,
    paddingVertical: SPACE.sm,
    paddingHorizontal: SPACE._2md
  }
});
export default BottomBreadCrumbsItem;
