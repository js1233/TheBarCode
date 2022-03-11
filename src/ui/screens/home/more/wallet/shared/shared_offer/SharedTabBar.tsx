import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

export type SharedTabParamsList = {
  SharedOffers: undefined;
  SharedEvents: undefined;
};

export const SharedTabBar =
  createBottomTabNavigator<SharedTabParamsList>();
