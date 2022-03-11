import { COLORS, FONT_SIZE, STRINGS } from "config";
import Fonts from "config/Fonts";
import React from "react";
import { StyleSheet } from "react-native";
import AboutController from "ui/screens/home/venue_details/about/AboutController";
import MenuController from "ui/screens/home/venue_details/menu/MenuController";
import WhatsOnController from "ui/screens/home/venue_details/what's_on/WhatsOnController";
import VenueDetailsTopTabs, {
  VenueDetailsTopTabsParamList
} from "./VenueDetailsTopTabs";
import EScreen from "models/enums/EScreen";

type Props = {
  initialRoute?: keyof VenueDetailsTopTabsParamList;
  isFrom: EScreen;
  notificationType?: string;
  initialSegmentForWhatsOnIndex?: number;
  initialSegmentForMenuIndex?: number;
};

function VenueDetailsTopTabsNavigator({
  initialRoute,
  isFrom,
  notificationType,
  initialSegmentForWhatsOnIndex = 0,
  initialSegmentForMenuIndex = 0
}: Props) {
  return (
    <VenueDetailsTopTabs.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        tabBarLabelStyle: styles.tabBarLabel,
        swipeEnabled: false,
        tabBarIndicatorStyle: {
          backgroundColor: COLORS.theme?.primaryColor
        }
      }}>
      <VenueDetailsTopTabs.Screen
        name={"About"}
        component={AboutController}
      />
      <VenueDetailsTopTabs.Screen
        name={"Menu"}
        component={MenuController}
        initialParams={{
          initialSegmentIndex: initialSegmentForMenuIndex
        }}
        options={{
          tabBarStyle: {
            backgroundColor: COLORS.white,
            // opacity: opacity,
            elevation: 0, // for Android
            shadowOffset: {
              width: 0,
              height: 0 // for iOS
            }
          }
        }}
      />
      <VenueDetailsTopTabs.Screen
        name={"WhatsOn"}
        component={WhatsOnController}
        initialParams={{
          isFrom: isFrom,
          notificationType: notificationType,
          initialSegmentIndex: initialSegmentForWhatsOnIndex
        }}
        options={{
          tabBarLabel: STRINGS.venue_details.whatson.title,
          tabBarStyle: {
            backgroundColor: COLORS.white,
            elevation: 0, // for Android
            shadowOffset: {
              width: 0,
              height: 0 // for iOS
            }
          }
        }}
      />
    </VenueDetailsTopTabs.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarLabel: {
    fontSize: FONT_SIZE.sm,
    textTransform: "capitalize",
    fontFamily: Fonts.semi_bold
  }
});

export default VenueDetailsTopTabsNavigator;
