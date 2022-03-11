import React from "react";
import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Cross from "../../../../../assets/images/ic_cross.svg";
import { COLORS, SPACE } from "config";

interface Props {
  containerStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

const CloseButton: React.FC<Props> = ({ containerStyle }: Props) => {
  const navigation = useNavigation();
  return (
    <Pressable
      onPress={() => {
        navigation.goBack();
      }}
      style={[styles.container, containerStyle]}>
      <Cross
        width={24}
        height={24}
        fill={COLORS.theme?.interface["500"]}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: { padding: SPACE.md }
});

export default CloseButton;
