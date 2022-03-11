import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { COLORS } from "config";
import React, { FC, useLayoutEffect } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { HomeStackParamList } from "routes/HomeStack";
import Screen from "ui/components/atoms/Screen";
import { CartTabsRoutes } from "./CartTabsRoutes";

type Props = {};
type HomeNavigationProp = StackNavigationProp<HomeStackParamList, "Home">;

const CartController: FC<Props> = () => {
  const homeNavigation = useNavigation<HomeNavigationProp>();

  useLayoutEffect(() => {
    homeNavigation.setOptions({
      header: () => {
        return (
          <View
            style={{
              backgroundColor: COLORS.theme?.interface["50"],
              height: Platform.OS === "ios" ? getStatusBarHeight() : 0
            }}
          />
        );
      }
    });
  }, [homeNavigation]);

  return (
    <Screen style={[styles.container]} shouldAddBottomInset={false}>
      <CartTabsRoutes />
    </Screen>
  );
};

export default CartController;

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
