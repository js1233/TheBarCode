import React, { FC } from "react";
import { StyleSheet } from "react-native";
import Screen from "ui/components/atoms/Screen";

type Props = {};

export const CartView: FC<Props> = ({}) => {
  return <Screen style={styles.container} shouldAddBottomInset={false} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
