import { COLORS, FONT_SIZE, SPACE } from "config";
import { usePreferredTheme } from "hooks";
import React from "react";
import {
  ActivityIndicator,
  ImageStyle,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle
} from "react-native";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import { SvgProp } from "utils/Util";

export interface LinkButtonProps extends TouchableOpacityProps {
  onPress?: () => void;
  text: string;
  textStyle?: StyleProp<TextStyle>;
  leftIcon?: SvgProp;
  rightIcon?: SvgProp;
  iconStyle?: StyleProp<ImageStyle>;
  viewStyle?: StyleProp<ViewStyle>;
  textType?: TEXT_TYPE;
  numberOfLines?: number;
  shouldShowProgressBar?: boolean;
}

export const LinkButton = React.memo<LinkButtonProps>(
  ({
    text,
    onPress,
    textStyle,
    leftIcon,
    rightIcon,
    viewStyle,
    textType = TEXT_TYPE.NORMAL,
    numberOfLines = 1,
    shouldShowProgressBar = false
  }) => {
    const theme = usePreferredTheme();

    const view = () => {
      return (
        <View style={[style.container, viewStyle]}>
          {!shouldShowProgressBar && leftIcon
            ? leftIcon?.(theme.themedColors.primaryColor, 20, 20)
            : null}
          {!shouldShowProgressBar && (
            <AppLabel
              numberOfLines={numberOfLines}
              textType={textType}
              style={[
                style.text,
                { color: COLORS.theme?.primaryShade["700"] },
                leftIcon
                  ? { paddingLeft: SPACE.sm }
                  : { paddingRight: SPACE.sm },
                textStyle
              ]}
              text={text}
            />
          )}
          {!shouldShowProgressBar && rightIcon
            ? rightIcon?.(theme.themedColors.primaryColor, 20, 20)
            : null}
          {shouldShowProgressBar && (
            <ActivityIndicator
              testID="loader"
              size="small"
              color={COLORS.theme?.primaryShade["700"]}
              style={{ marginRight: SPACE.lg }}
            />
          )}
        </View>
      );
    };

    if (onPress) {
      return (
        <TouchableOpacity onPress={onPress}>{view()}</TouchableOpacity>
      );
    } else {
      return view();
    }
  }
);

const style = StyleSheet.create({
  text: {
    fontSize: FONT_SIZE.xs,
    includeFontPadding: false
  },
  leftIcon: {
    marginLeft: SPACE.sm,
    width: 20,
    height: 20
  },
  rightIcon: {
    marginRight: SPACE.sm,
    width: 20,
    height: 20
  },
  container: {
    flexDirection: "row",
    alignItems: "center"
  }
});
