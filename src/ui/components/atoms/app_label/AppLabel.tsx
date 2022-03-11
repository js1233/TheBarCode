import { FONT_SIZE, FONT_SIZE_LINE_HEIGHT } from "config/Dimens";
import Fonts from "config/Fonts";
import { usePreferredTheme } from "hooks";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  TextStyle
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export interface AppLabelProps extends TextProps {
  text?: string;
  style?: StyleProp<TextStyle>;
  onPress?: () => void;
  textType?: TEXT_TYPE;
}

type Props = AppLabelProps;

export enum TEXT_TYPE {
  NORMAL = "normal",
  ITALIC = "italic",
  BOLD = "bold",
  UNDERLINE = "underline",
  LINE_THROUGH = "line-through",
  SEMI_BOLD = "semi-bold"
}

export const AppLabel = React.memo<Props>(
  ({ text, style, onPress, textType, ...rest }) => {
    const theme = usePreferredTheme();

    const getTextStyle = () => {
      if (textType === TEXT_TYPE.NORMAL) {
        return styles.normal;
      } else if (textType === TEXT_TYPE.ITALIC) {
        return styles.italic;
      } else if (textType === TEXT_TYPE.BOLD) {
        return styles.bold;
      } else if (textType === TEXT_TYPE.UNDERLINE) {
        return styles.underLine;
      } else if (textType === TEXT_TYPE.LINE_THROUGH) {
        return styles.lineThrough;
      } else if (textType === TEXT_TYPE.SEMI_BOLD) {
        return styles.semi_bold;
      } else {
        return styles.normal;
      }
    };

    const textJsx = (
      <Text
        style={[
          getTextStyle(),
          {
            color: theme.themedColors.interface["900"],
            fontSize: FONT_SIZE.sm
          },
          {
            lineHeight: FONT_SIZE_LINE_HEIGHT.ofFontSize(
              // @ts-ignore
              StyleSheet.flatten(style)?.fontSize ?? 16.0
            )
          },
          style
        ]}
        numberOfLines={1}
        {...rest}>
        {text}
      </Text>
    );

    if (onPress) {
      return (
        <TouchableOpacity activeOpacity={0.3} onPress={onPress}>
          {textJsx}
        </TouchableOpacity>
      );
    } else {
      return textJsx;
    }
  }
);

const styles = StyleSheet.create({
  bold: {
    fontFamily: Fonts.bold
  },
  normal: {
    fontFamily: Fonts.regular
  },
  semi_bold: {
    fontFamily: Fonts.semi_bold
  },
  italic: {
    fontStyle: "italic"
  },
  underLine: {
    textDecorationLine: "underline"
  },
  lineThrough: {
    textDecorationLine: "line-through"
  }
});
