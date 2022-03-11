import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle
} from "react-native";
import Plus from "assets/images/plus.svg";
import Minus from "assets/images/ic_minus.svg";
import { AppLabel } from "ui/components/atoms/app_label/AppLabel";
import { COLORS } from "config";
// test missing
type Props = {
  containerStyle?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<ViewStyle>;
  initialValue?: number;
  min?: number;
  max?: number;
  onValueChange?: (value: number, shouldAdd: boolean) => void;
  shouldDisableRightButton: boolean;
  shouldDisableLeftButton: boolean;
  shouldStepperUpdateCount?: boolean;
};

export const Stepper = React.memo<Props>( // use default exports
  ({
    containerStyle,
    buttonStyle,
    textStyle,
    initialValue,
    min = 1,
    max,
    onValueChange,
    shouldDisableRightButton,
    shouldDisableLeftButton,
    shouldStepperUpdateCount = true
  }) => {
    const [count, setCount] = useState(initialValue ?? min ?? 1);

    useEffect(() => {
      setCount(initialValue!);
    }, [initialValue]);

    return (
      <View style={[styles.container, containerStyle]}>
        <Pressable
          onPress={() => {
            const newCount = count - 1;
            if (newCount >= min && shouldDisableRightButton === false) {
              onValueChange?.(newCount, false);
              shouldStepperUpdateCount && setCount(newCount);
            }
          }}>
          <View
            style={[
              styles.iconBg,
              {
                backgroundColor:
                  count !== min && shouldDisableRightButton === false
                    ? COLORS.theme?.primaryShade[700]
                    : COLORS.theme?.interface[300]
                /* use primary shade from Figma */
              }
            ]}>
            <Minus
              width={12}
              height={12}
              fill={COLORS.theme?.primaryBackground}
            />
          </View>
        </Pressable>
        <AppLabel style={[textStyle]} text={count.toString()} />
        <Pressable
          onPress={() => {
            const newCount = count + 1;
            if (
              (max === undefined || (max && newCount <= max)) &&
              shouldDisableLeftButton === false
            ) {
              onValueChange?.(newCount, true);
              shouldStepperUpdateCount && setCount(newCount);
            }
          }}>
          <View
            style={[
              styles.iconBg,
              {
                backgroundColor:
                  count !== max && shouldDisableLeftButton === false
                    ? COLORS.theme?.primaryShade[700]
                    : COLORS.theme
                        ?.interface[300] /* use primary shade from Figma */
              },
              buttonStyle
            ]}>
            <Plus
              width={12}
              height={12}
              fill={
                COLORS.theme
                  ?.primaryBackground /* avoid using hard-coded color*/
              }
            />
          </View>
        </Pressable>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: COLORS.theme?.borderColor,
    backgroundColor: "#ffffff",
    borderRadius: 30,
    height: 30,
    width: 80,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignContent: "center",
    paddingHorizontal: 2
  },
  iconBg: {
    borderRadius: 20,
    padding: 5
  }
});
