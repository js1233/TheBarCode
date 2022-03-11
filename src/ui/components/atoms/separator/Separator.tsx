import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import { usePreferredTheme } from "hooks";

export enum Type {
  HORIZONTAL,
  VERTICAL
}

type Props = {
  thickness?: number;
  type?: Type;
  color?: string;
};

const Separator: FC<Props> = ({
  type = Type.HORIZONTAL,
  thickness = 0.5,
  color
}) => {
  const { themedColors } = usePreferredTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: color ?? themedColors.borderColor },
        ...(type === Type.HORIZONTAL
          ? [styles.horizontal, { height: thickness }]
          : [styles.vertical, { width: thickness }])
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {},
  horizontal: {
    width: "100%"
  },
  vertical: {
    height: "100%"
  }
});

export default Separator;
