import React from "react";
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle
} from "react-native";
import * as Progress from "react-native-progress";
import { AppLabel } from "ui/components/atoms/app_label/AppLabel";
import { FONT_SIZE } from "config/Dimens";
import { usePreferredTheme } from "hooks";

export interface AppProgressBarProps {
  style?: StyleProp<ViewStyle>;
  borderWidth?: number;
  borderRadius?: number;
  filledColor?: string;
  unFilledColor?: string;
  shouldShowBottomText?: boolean;
  bottomTextStyle?: StyleProp<TextStyle>;
  progressPercentage: number; //0 to 100
}

export const AppProgressBar = React.memo<AppProgressBarProps>(
  ({
    style,
    borderWidth = 0,
    borderRadius = 50,
    unFilledColor,
    filledColor,
    shouldShowBottomText = true,
    bottomTextStyle,
    progressPercentage
  }) => {
    const { themedColors } = usePreferredTheme();
    const progress = progressPercentage / 100;

    if (progressPercentage < 0 || progressPercentage > 100) {
      throw new Error(
        "InValid 'progressPercentage' provided to AppProgressBar "
      );
    }

    return (
      <View style={[styles.container, style]}>
        <Progress.Bar
          progress={progress}
          width={null}
          borderWidth={borderWidth}
          borderRadius={borderRadius}
          height={20}
          unfilledColor={
            unFilledColor ? unFilledColor : themedColors.interface["500"]
          }
          useNativeDriver={true}
          animationType="timing"
          color={filledColor ? filledColor : themedColors.interface["900"]}
        />
        {shouldShowBottomText && (
          <View testID="bottom-view" style={styles.textWrapper}>
            <AppLabel
              text="Complete profile & questionnaire: "
              style={[styles.textStyle, bottomTextStyle]}
            />
            <AppLabel
              text={progressPercentage + "%"}
              style={[styles.textStyle, styles.boldText, bottomTextStyle]}
            />
          </View>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  textWrapper: {
    flexDirection: "row",
    paddingTop: 5
  },
  boldText: {
    fontWeight: "700"
  },
  textStyle: {
    fontSize: FONT_SIZE.xs,
    fontWeight: "400"
  }
});
