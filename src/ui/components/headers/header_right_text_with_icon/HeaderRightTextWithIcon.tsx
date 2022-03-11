import { FONT_SIZE, SPACE } from "config";
import { usePreferredTheme } from "hooks";
import React from "react";
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacityProps,
  View,
  ViewStyle
} from "react-native";
import { LinkButton } from "ui/components/atoms/link_button/LinkButton";
import { SvgProp } from "utils/Util";
import Forward from "assets/images/forward.svg";
import { TEXT_TYPE } from "ui/components/atoms/app_label/AppLabel";

export interface HeaderRightTextWithIconProps
  extends TouchableOpacityProps {
  text?: string;
  icon?: SvgProp;
  onPress?: () => void;
  textStyle?: StyleProp<TextStyle>;
  textType?: TEXT_TYPE;
  shouldShowLoader?: boolean;
  showIcon?: boolean;
  viewStyle?: StyleProp<ViewStyle>;
}

const HeaderRightTextWithIcon = React.memo<HeaderRightTextWithIconProps>(
  ({
    text = "",
    icon,
    onPress,
    textStyle,
    textType = TEXT_TYPE.NORMAL,
    shouldShowLoader = false,
    showIcon = true,
    viewStyle
  }) => {
    const theme = usePreferredTheme();

    const forwardIcon: SvgProp = () => {
      return (
        <Forward
          width={12}
          height={12}
          fill={theme.themedColors.primaryColor}
        />
      );
    };

    return (
      <>
        {shouldShowLoader && (
          <View style={style.loadMore}>
            <ActivityIndicator
              size="small"
              color={theme.themedColors.primaryColor}
            />
          </View>
        )}

        {!shouldShowLoader && (
          <LinkButton
            text={text}
            onPress={onPress}
            rightIcon={
              showIcon && icon ? icon : showIcon ? forwardIcon : null
            }
            textStyle={[
              {
                color: theme.themedColors.interface["900"]
              },
              style.text,
              textStyle
            ]}
            textType={textType}
            viewStyle={[style.container, viewStyle]}
          />
        )}
      </>
    );
  }
);

const style = StyleSheet.create({
  container: {
    marginRight: SPACE.sm,
    height: "100%",
    justifyContent: "center"
  },
  text: {
    paddingRight: 2,
    fontSize: FONT_SIZE.xs
  },
  loadMore: {
    height: "100%",
    width: 50,
    marginRight: SPACE.sm,
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center"
  }
});

export default HeaderRightTextWithIcon;
