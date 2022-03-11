import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

export type ExploreBottomBarParamsList = {
  ExploreList: {
    callbackAfterApiHit: () => void;
  };
  ExploreMap: {
    callbackAfterApiHit: () => void;
  };
};

export const ExploreBottomBar =
  createBottomTabNavigator<ExploreBottomBarParamsList>();
