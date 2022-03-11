import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import EScreen from "models/enums/EScreen";

export type HomeBottomBarParamsList = {
  Trending: undefined;
  Invite: undefined;
  Explore: undefined;
  Cart: { isFrom?: EScreen };
  More: undefined;
};

export const HomeBottomBar =
  createBottomTabNavigator<HomeBottomBarParamsList>();
