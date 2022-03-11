import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import EScreen from "models/enums/EScreen";

export type VenueDetailsTopTabsParamList = {
  About: undefined;
  Menu: {
    initialSegmentIndex?: number;
  };
  WhatsOn: {
    isFrom?: EScreen;
    notificationType?: string;
    initialSegmentIndex?: number;
  };
};

const VenueDetailsTopTabs =
  createMaterialTopTabNavigator<VenueDetailsTopTabsParamList>();

export default VenueDetailsTopTabs;
