import React, { FC } from "react";
import { StyleSheet } from "react-native";
import { COLORS, FONT_SIZE } from "config";
import { shadowStyleProps } from "utils/Util";
import { WalletTabs } from "ui/screens/home/more/wallet/WalletMaterialTabs";
import FavouriteController from "ui/screens/home/more/wallet/favourite/FavouriteController";
import SharedController from "ui/screens/home/more/wallet/shared/SharedController";
import BookMarkedController from "ui/screens/home/more/wallet/bookmarked_tab/BookMarkedController";
import { WalletRoutes } from "./WalletController";

type Props = {
  initialRouteName: WalletRoutes;
  selectedSegmentIndex: number;
};

export const WalletTabsRoutes: FC<Props> = ({
  initialRouteName,
  selectedSegmentIndex
}) => {
  return (
    <WalletTabs.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        tabBarLabelStyle: styles.tabFont,
        tabBarIndicatorStyle: {
          backgroundColor: COLORS.theme?.primaryColor
        },
        swipeEnabled: false,
        tabBarStyle: [
          shadowStyleProps,
          { backgroundColor: COLORS.theme?.interface[100] }
        ]
      }}>
      <WalletTabs.Screen
        name="Favourite"
        component={FavouriteController}
        options={{
          tabBarLabel: "Favourite",
          tabBarStyle: {
            backgroundColor: COLORS.white
          }
        }}
      />
      <WalletTabs.Screen
        name="Shared"
        component={SharedController}
        initialParams={{
          selectedSegmentIndex: selectedSegmentIndex
        }}
        options={{
          tabBarLabel: "Shared",
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
      <WalletTabs.Screen
        name="BookMarked"
        component={BookMarkedController}
        options={{
          tabBarLabel: "BookMarked",
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
    </WalletTabs.Navigator>
  );
};

const styles = StyleSheet.create({
  tabFont: {
    fontSize: FONT_SIZE._2xs,
    fontWeight: "bold",
    textTransform: "capitalize"
  }
});
