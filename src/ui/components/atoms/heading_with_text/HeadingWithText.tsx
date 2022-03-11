import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import { FONT_SIZE, STRINGS } from "config";

interface OwnProps {
  containerStyle?: StyleProp<ViewStyle>;
  headingText: string;
  text?: string;
  headingStyle?: StyleProp<ViewStyle>;
  headingTextType?: TEXT_TYPE;
  textStyle?: StyleProp<ViewStyle>;
}

type Props = OwnProps;

export const HeadingWithText = React.memo<Props>(
  ({
    containerStyle,
    text,
    headingText,
    headingStyle,
    textStyle,
    headingTextType = TEXT_TYPE.SEMI_BOLD
  }) => {
    return (
      <View testID={"HEADING_WITH_TEXT"} style={containerStyle}>
        <AppLabel
          text={headingText}
          textType={headingTextType}
          style={[{ fontSize: FONT_SIZE.lg }, headingStyle]}
        />
        <AppLabel
          text={text ?? STRINGS.common.label_n_a}
          numberOfLines={0}
          style={[{ fontSize: FONT_SIZE.sm }, textStyle]}
        />
      </View>
    );
  }
);
