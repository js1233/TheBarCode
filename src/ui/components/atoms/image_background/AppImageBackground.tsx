import { usePreferredTheme } from "hooks";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacityProps,
  TouchableWithoutFeedback,
  View,
  ViewStyle
} from "react-native";
import { SvgProp } from "utils/Util";

export interface AppImageBackgroundProps extends TouchableOpacityProps {
  containerStyle?: StyleProp<ViewStyle>;
  icon?: SvgProp;
  containerShape: CONTAINER_TYPES;
  onPress?: () => void;
}

export enum CONTAINER_TYPES {
  CIRCLE = "circle",
  SQUARE = "square"
}

export const AppImageBackground = React.memo<AppImageBackgroundProps>(
  ({ containerStyle, icon, containerShape, onPress }) => {
    const theme = usePreferredTheme();
    const imageWithBgJsx = (
      <View
        style={[
          style.container,
          {
            backgroundColor: theme.themedColors.primaryBackground,
            shadowColor: theme.themedColors.primaryBackground
          },
          containerShape === CONTAINER_TYPES.CIRCLE
            ? style.circleShape
            : style.squareShape,
          containerStyle
        ]}>
        {icon?.(theme.themedColors.primaryColor, 20, 20)}
      </View>
    );

    if (onPress) {
      return (
        <TouchableWithoutFeedback
          testID="image-container"
          onPress={onPress}>
          {imageWithBgJsx}
        </TouchableWithoutFeedback>
      );
    } else {
      return imageWithBgJsx;
    }
  }
);

const style = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 3,
    shadowOpacity: 0.15
  },
  squareShape: {
    borderRadius: 5
  },
  circleShape: {
    borderRadius: 50
  },
  icon: {
    width: "50%",
    height: undefined,
    aspectRatio: 1
  }
});
