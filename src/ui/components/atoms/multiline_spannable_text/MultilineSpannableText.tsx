import React from "react";
import { StyleProp, Text, TextStyle, View, ViewStyle } from "react-native";
import { AppLabelProps } from "ui/components/atoms/app_label/AppLabel";

export interface SpannableProps {
  containerStyle?: StyleProp<ViewStyle>;
  text: Array<string>;
  appLabelProps: Array<AppLabelProps>;
  numberOfLines?: number;
  rootTextStyle?: StyleProp<TextStyle>;
}

type Props = SpannableProps;

const MultilineSpannableText = React.memo<Props>(
  ({
    text,
    containerStyle,
    appLabelProps,
    rootTextStyle,
    numberOfLines = 0
  }) => {
    if (
      text.length > 0 &&
      appLabelProps.length > 0 &&
      text.length === appLabelProps.length
    ) {
      return (
        <View testID={"SPANNABLE_TEXT"} style={containerStyle}>
          <Text
            numberOfLines={numberOfLines}
            style={[rootTextStyle, { textAlign: "center" }]}>
            {text.map((item, index) => (
              <Text key={index} {...appLabelProps[index]}>
                {item}
              </Text>
            ))}
          </Text>
        </View>
      );
    } else {
      return <View />;
    }
  }
);

export default MultilineSpannableText;
