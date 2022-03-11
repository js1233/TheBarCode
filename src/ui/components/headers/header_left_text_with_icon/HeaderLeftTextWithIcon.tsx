import Back from "assets/images/plus.svg";
import { FONT_SIZE, SPACE } from "config";
import { usePreferredTheme } from "hooks";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacityProps,
  ViewStyle
} from "react-native";
import { LinkButton } from "ui/components/atoms/link_button/LinkButton";
import { SvgProp } from "utils/Util";
import { TEXT_TYPE } from "ui/components/atoms/app_label/AppLabel";

export interface HeaderLeftTextWithIconProps
  extends TouchableOpacityProps {
  text?: string;
  icon?: SvgProp;
  onPress: () => void;
  textStyle?: StyleProp<TextStyle>;
  textType?: TEXT_TYPE;
  containerStyle?: StyleProp<ViewStyle>;
}

const HeaderLeftTextWithIcon = React.memo<HeaderLeftTextWithIconProps>(
  ({ text = "", icon, onPress, textStyle, textType, containerStyle }) => {
    const theme = usePreferredTheme();
    const closeIcon: SvgProp = () => {
      return (
        <Back
          width={12}
          height={12}
          fill={theme.themedColors.primaryColor}
        />
      );
    };

    return (
      <LinkButton
        text={text}
        onPress={onPress}
        leftIcon={icon ? icon : closeIcon}
        textStyle={[
          { color: theme.themedColors.primaryColor },
          style.text,
          textStyle
        ]}
        viewStyle={[style.container, containerStyle]}
        textType={textType}
      />
    );
  }
);

const style = StyleSheet.create({
  container: {
    marginLeft: SPACE.sm,
    height: "100%",
    justifyContent: "center"
  },
  text: {
    paddingLeft: 2,
    fontSize: FONT_SIZE.xs
  }
});

export default HeaderLeftTextWithIcon;
