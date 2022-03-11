import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle
} from "react-native";
import { AppLog, shadowStyleProps, TAG } from "utils/Util";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import { COLORS, FONT_SIZE, SPACE } from "config";

export type Choice = { label: string; value: string };

interface Props {
  containerStyle?: StyleProp<ViewStyle>;
  tabStyle?: StyleProp<ViewStyle>;
  values: Array<Choice>;
  selectedIndex?: number;
  onChange?: (value: Choice, index: number) => void;
}

export const SegmentedControl = React.memo<Props>(
  ({ onChange, selectedIndex = 0, containerStyle, tabStyle, values }) => {
    AppLog.log(() => "rendering SegmentedControl...", TAG.VENUE);

    if (values.length < 2) {
      throw new Error("At-least 2 values are required");
    }

    const [selectedPosition, setSelectedPosition] = useState<number>(
      values.length - 1 >= selectedIndex ? selectedIndex : 0
    );

    // setup animation
    const [segmentWidth, setSegmentWidth] = useState(0);
    const animation = useRef(new Animated.Value(0)).current;
    useEffect(() => {
      function computeToValue() {
        return segmentWidth * (selectedPosition || 0);
      }

      if (animation) {
        Animated.timing(animation, {
          toValue: computeToValue(),
          duration: 150,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true
        }).start();
      }
    }, [animation, segmentWidth, selectedPosition]);
    ///////////////////

    function getStyleAsPerSelectionStatus(position: number) {
      return selectedPosition === position
        ? [{ color: COLORS.white }]
        : [{ color: COLORS.theme?.interface["500"] }];
    }

    function buttonPressed(position: number) {
      const oldSelectedOption = selectedPosition;
      setSelectedPosition(position);
      if (position !== oldSelectedOption) {
        onChange?.(values[position], position);
      }
    }

    const selectPadding = 0;

    return (
      <View
        style={{
          paddingHorizontal: SPACE.xl,
          paddingVertical: 10,
          backgroundColor: COLORS.theme?.primaryBackground,
          ...shadowStyleProps
        }}>
        <View
          style={[
            styles.container,
            { backgroundColor: COLORS.grey1 },
            containerStyle
          ]}
          onLayout={({
            nativeEvent: {
              layout: { width }
            }
          }) => {
            const newSegmentWidth = values.length
              ? width / values.length
              : 0;
            if (newSegmentWidth !== segmentWidth) {
              animation.setValue(newSegmentWidth * (selectedIndex || 0));
              setSegmentWidth(newSegmentWidth);
            }
          }}>
          <Animated.View
            testID={"animatedView"}
            style={[
              styles.selectedOptionBg,
              { transform: [{ translateX: animation }] },
              {
                width: segmentWidth - selectPadding * 2,
                top: selectPadding,
                bottom: selectPadding,
                start: selectPadding,
                end: selectPadding,
                backgroundColor: COLORS.theme?.primaryShade["700"]
              }
            ]}
          />
          <View style={styles.segmentsContainer}>
            {values &&
              values.map((value, index) => {
                return (
                  <TouchableOpacity
                    style={[styles.tabContainer, tabStyle]}
                    key={value.value}
                    onPress={() => {
                      buttonPressed(index);
                    }}>
                    <AppLabel
                      style={[
                        styles.text,
                        getStyleAsPerSelectionStatus(index)
                      ]}
                      textType={TEXT_TYPE.BOLD}
                      text={value.label}
                    />
                  </TouchableOpacity>
                );
              })}
          </View>
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderStyle: "solid",
    alignItems: "center",
    borderRadius: 10,
    overflow: "hidden",
    height: 35
  },
  selectedOptionBg: {
    position: "absolute",
    borderRadius: 10
  },
  text: {
    fontSize: FONT_SIZE.xs
  },
  selectedOption: {},
  unselectedOption: {},
  segmentsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "transparent"
  },
  tabContainer: {
    flex: 1,
    alignContent: "center",
    alignItems: "center"
  }
});
