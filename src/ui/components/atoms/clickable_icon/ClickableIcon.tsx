import React from "react";
import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { SvgProp } from "utils/Util";

type Props = {
  containerStyle?: StyleProp<ViewStyle>;
  icon: SvgProp;
  onPress?: () => void;
};

const ClickableIcon: React.FC<Props> = ({
  containerStyle,
  icon,
  onPress
}: Props) => {
  return (
    <Pressable
      style={[styles.container, containerStyle]}
      onPress={onPress}>
      {icon()}
    </Pressable>
  );
};

export default ClickableIcon;

const styles = StyleSheet.create({
  container: {}
});
