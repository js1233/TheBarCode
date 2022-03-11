import React from "react";
import { CartTabs } from "./CartMaterialTabs";
import { StyleSheet } from "react-native";
import { COLORS, FONT_SIZE } from "config";
import { shadowStyleProps } from "utils/Util";
import MyCartController from "./mycart/MyCartController";
import MyOrdersController from "ui/screens/home/cart/my_order/MyOrdersController";
import EScreen from "models/enums/EScreen";

export const CartTabsRoutes = () => {
  return (
    <CartTabs.Navigator
      initialRouteName="MyCart"
      screenOptions={{
        tabBarLabelStyle: styles.tabFont,
        tabBarIndicatorStyle: {
          backgroundColor: COLORS.theme?.primaryColor
        },
        tabBarStyle: [
          shadowStyleProps,
          { backgroundColor: COLORS.theme?.interface[50] }
        ]
      }}>
      <CartTabs.Screen
        name="MyCart"
        component={MyCartController}
        initialParams={{ isFrom: EScreen.HOME }}
        options={{ tabBarLabel: "My Cart" }}
      />
      <CartTabs.Screen
        name="MyOrders"
        component={MyOrdersController}
        options={{ tabBarLabel: "My Orders" }}
      />
    </CartTabs.Navigator>
  );
};

const styles = StyleSheet.create({
  tabFont: {
    fontSize: FONT_SIZE._2xs,
    fontWeight: "bold",
    textTransform: "capitalize"
  }
});
