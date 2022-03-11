import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

export type WalletTabsParamsList = {
  Favourite: undefined;
  Shared: { selectedSegmentIndex: number };
  BookMarked: undefined;
};

export const WalletTabs =
  createMaterialTopTabNavigator<WalletTabsParamsList>();
