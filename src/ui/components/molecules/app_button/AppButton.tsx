import { FONT_SIZE, SPACE } from "config";
import Colors from "config/Colors";
import { usePreferredTheme } from "hooks";
import React, { useEffect, useState } from "react";
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

export interface AppButtonProps extends TouchableOpacityProps {
  onPress?: () => void;
  text?: string;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  textDisableStyle?: StyleProp<TextStyle>;
  textContainerStyle?: StyleProp<ViewStyle>;
  shouldShowProgressBar?: boolean;
  loaderSize?: number;
  loaderColor?: string;
  leftIcon?: SvgProp | undefined;
  rightIcon?: SvgProp;
  buttonType?: BUTTON_TYPES;
  isDisable?: boolean;
  buttonDisableStyle?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ImageStyle>;
  shouldShowError?: boolean;
  textType?: TEXT_TYPE;
  shouldNotOptimize?: boolean;
  shouldAlignTextWithLeftIconWithFullWidth?: boolean;
}

export enum BUTTON_TYPES {
  NORMAL = "normal",
  BORDER = "border",
  DASH = "dashed"
}

export const AppButton = React.memo<AppButtonProps>(
  ({
    text,
    onPress,
    iconStyle,
    buttonStyle,
    textStyle,
    textDisableStyle,
    shouldShowProgressBar = false,
    loaderSize = 15,
    loaderColor,
    leftIcon,
    rightIcon,
    buttonType = BUTTON_TYPES.NORMAL,
    isDisable = false,
    buttonDisableStyle,
    shouldShowError = false,
    textType = TEXT_TYPE.NORMAL,
    shouldAlignTextWithLeftIconWithFullWidth = false,
    textContainerStyle
  }) => {
    const theme = usePreferredTheme();
    const [customDisabled, setIsDisabled] = useState<boolean>(isDisable);

    useEffect(() => {
      let timeout: any;
      if (isDisable) {
        setIsDisabled(isDisable);
      } else {
        //when we need to close screen after button click, changing isDisable to false
        //trigger a second click due to whic hapi is called again to prevent this {isDisbaled:false}
        //is calling after a little delay, to properly close the parent screen in the meantime
        timeout = setTimeout(() => {
          setIsDisabled(isDisable);
        }, 300);
      }

      () => clearTimeout(timeout);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDisable]);

    const getButtonStyle = () => {
      if (buttonType === BUTTON_TYPES.DASH) {
        return [
          style.buttonWithDash,
          { borderColor: theme.themedColors.primaryColor }
        ];
      } else if (buttonType === BUTTON_TYPES.BORDER) {
        return [
          style.buttonWithBorder,
          {
            borderColor: shouldShowError
              ? Colors.colors.red
              : theme.themedColors.primaryColor
          }
        ];
      }
    };

    const getShadowStyle = () => {
      if (!customDisabled) {
        return [
          style.buttonWithShadow,
          { shadowColor: theme.themedColors.primaryBackground }
        ];
      }
    };

    return (
      <TouchableOpacity
        onPress={shouldShowProgressBar ? undefined : onPress}
        disabled={customDisabled}
        style={[
          style.button,
          getShadowStyle(),
          getButtonStyle(),
          {
            backgroundColor: theme.themedColors.primaryColor
          },
          customDisabled
            ? buttonDisableStyle ?? [
                buttonStyle,
                { backgroundColor: theme.themedColors.interface[400] }
              ]
            : buttonStyle
        ]}>
        <View testID="button-container" style={style.viewContainer}>
          {leftIcon && !shouldShowProgressBar && (
            <View
              style={[
                iconStyle,
                style.leftIconContainer,
                !shouldAlignTextWithLeftIconWithFullWidth
                  ? style.leftIconContainerPosition
                  : undefined
              ]}>
              {leftIcon?.(theme.themedColors.primaryColor, 20, 20)}
            </View>
          )}
          <View
            style={[
              style.textWithLoader,
              !shouldAlignTextWithLeftIconWithFullWidth
                ? style.textWithLoaderFlex
                : undefined,
              textContainerStyle
            ]}>
            {!shouldShowProgressBar && (
              <AppLabel
                style={[
                  style.text,
                  customDisabled ? textDisableStyle : textStyle
                ]}
                text={text}
                textType={textType}
                allowFontScaling={false}
              />
            )}
            {shouldShowProgressBar && (
              <ActivityIndicator
                testID="loader"
                style={[style.loader]}
                size={loaderSize}
                color={
                  loaderColor ?? theme.themedColors.secondaryBackground
                }
              />
            )}
          </View>
          {rightIcon && !shouldShowProgressBar && (
            <View style={style.rightIconContainer}>
              {rightIcon?.(theme.themedColors.primaryColor, 20, 20)}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }
);

const style = StyleSheet.create({
  buttonWithShadow: {
    elevation: 1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 3,
    shadowOpacity: 0.15
  },
  text: {
    fontSize: FONT_SIZE.base,
    overflow: "hidden",
    color: Colors.colors.white
  },
  loader: {
    marginLeft: 10
  },
  textWithLoader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  textWithLoaderFlex: {
    flex: 1
  },
  leftIconContainer: {
    alignItems: "flex-start",
    marginLeft: SPACE.sm
  },
  leftIconContainerPosition: {
    position: "absolute",
    left: SPACE.sm
  },
  leftIcon: {
    marginLeft: 10,
    width: 20,
    height: 20
  },
  rightIconContainer: {
    position: "absolute",
    right: SPACE.lg,
    justifyContent: "flex-end",
    alignItems: "flex-end"
  },
  rightIcon: {
    marginRight: 10,
    width: 20,
    height: 20
  },
  buttonWithBorder: {
    borderWidth: 1,
    borderStyle: "solid"
  },
  buttonWithDash: {
    borderWidth: 1,
    borderStyle: "dashed"
  },
  button: {
    alignSelf: "center",
    flexDirection: "row",
    width: "100%",
    minHeight: 44,
    maxHeight: 55,
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 25
  },
  viewContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACE.sm
  }
});
