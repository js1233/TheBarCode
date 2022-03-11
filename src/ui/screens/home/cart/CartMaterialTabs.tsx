import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import EScreen from "models/enums/EScreen";

export type CartTabsParamsList = {
  MyCart?: { isFrom?: EScreen };
  MyOrders?: undefined;
};

export const CartTabs =
  createMaterialTopTabNavigator<CartTabsParamsList>();
