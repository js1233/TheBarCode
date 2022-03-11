import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ESupportedOrderType from "models/enums/ESupportedOrderType";

export type MenuTabParamsList = {
  dine_in_collection: {
    menuType: ESupportedOrderType;
  };
  take_away_delivery: {
    menuType: ESupportedOrderType;
  };
};

export const MenuTabBar = createBottomTabNavigator<MenuTabParamsList>();
