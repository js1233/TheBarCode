import ChevronDownIcon from "assets/images/chevron-down.svg";
import ChevronUpIcon from "assets/images/chevron-up.svg";
import { FONT_SIZE, SPACE } from "config";
import Colors from "config/Colors";
import { usePreferredTheme } from "hooks";
import { KeyValue } from "models/KeyValue";
import React, { useCallback, useState } from "react";
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View
} from "react-native";
import { Color, NumberProp } from "react-native-svg";
import { AppLabel } from "ui/components/atoms/app_label/AppLabel";
import { FlatListWithPb } from "ui/components/organisms/flat_list/FlatListWithPb";
import { SvgProp } from "utils/Util";
import { ItemTiming } from "ui/components/organisms/timing_list/ItemTiming";

export interface TimingsProps<T> {
  label: string;
  data: T[];
  selectedIndex?: number;
  isExpanded?: boolean;
  labelStyle?: StyleProp<TextStyle>;
}

const Timings = <T extends any>({
  data,
  label,
  selectedIndex,
  isExpanded,
  labelStyle
}: TimingsProps<T>) => {
  const theme = usePreferredTheme();
  const [expanded, setExpanded] = useState(isExpanded);
  const chevronUpIcon: SvgProp = (
    color?: Color,
    width?: NumberProp,
    height?: NumberProp
  ) => {
    return <ChevronUpIcon width={width} height={height} fill={color} />;
  };
  const chevronDownIcon: SvgProp = (
    color?: Color,
    width?: NumberProp,
    height?: NumberProp
  ) => {
    return <ChevronDownIcon width={width} height={height} fill={color} />;
  };

  const listItem = useCallback(
    ({ item, index }: { item: T; index: number }) => {
      return (
        <ItemTiming
          data={item as KeyValue}
          isSelected={index === selectedIndex}
        />
      );
    },
    [selectedIndex]
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          setExpanded((prevState) => !prevState);
        }}
        style={styles.labelContainer}>
        <AppLabel text={label} style={[styles.title, labelStyle]} />
        <View style={styles.toggleIconContainer}>
          {expanded
            ? chevronUpIcon(theme.themedColors.primaryColor, 20, 20)
            : chevronDownIcon(theme.themedColors.primaryColor, 20, 20)}
        </View>
      </TouchableOpacity>
      {expanded && <FlatListWithPb<T> data={data} renderItem={listItem} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.colors.white,
    flex: 1,
    paddingTop: SPACE._4xl
  },
  title: {
    alignSelf: "center",
    fontSize: FONT_SIZE.sm,
    paddingTop: SPACE.xl
  },
  toggleIconContainer: {
    marginTop: SPACE.lg
  },
  labelContainer: {
    flexDirection: "row",
    marginLeft: SPACE.lg
  }
});

export default Timings;
