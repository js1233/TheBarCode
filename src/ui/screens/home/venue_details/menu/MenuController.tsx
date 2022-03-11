/* eslint-disable @typescript-eslint/no-unused-vars */
import { MaterialTopTabNavigationProp } from "@react-navigation/material-top-tabs";
import {
  RouteProp,
  useNavigation,
  useRoute
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { COLORS, SPACE } from "config";
import Strings from "config/Strings";
import ESupportedOrderType from "models/enums/ESupportedOrderType";
import { isBarCode, showbothTabs } from "models/Venue";
import React, { FC, useState } from "react";
import { StyleSheet, View } from "react-native";
import { HomeStackParamList } from "routes/HomeStack";
import { MenuTabParamsList } from "routes/MenuTabBar";
import { MenuTabRoutes } from "routes/MenuTabBarRoutes";
import { VenueDetailsTopTabsParamList } from "routes/VenueDetailsTopTabs";
import Screen from "ui/components/atoms/Screen";
import { SegmentedControl } from "ui/components/molecules/segmented_control/SegmentedControl";
import MenuListController from "./list/MenuListController";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import { useAppSelector } from "hooks/redux";
import { RootState } from "stores/store";
import EPosType from "models/enums/EPosType";

type MenuScreenProps = RouteProp<VenueDetailsTopTabsParamList, "Menu">;

type MenuNavigationProp = MaterialTopTabNavigationProp<
  VenueDetailsTopTabsParamList,
  "Menu"
>;

type HomeNavigationProps = StackNavigationProp<
  HomeStackParamList,
  "VenueDetails"
>;

type MenuTabNavigationProps = StackNavigationProp<
  MenuTabParamsList,
  "dine_in_collection"
>;

type Props = {};

const MenuController: FC<Props> = ({}) => {
  const navigation = useNavigation<MenuTabNavigationProps>();
  const homeNavigation = useNavigation<HomeNavigationProps>();
  const route = useRoute<MenuScreenProps>();
  const { barDetails } = useAppSelector(
    (state: RootState) => state.general
  );
  const [index, setIndex] = useState(route.params.initialSegmentIndex);

  if (barDetails) {
    return (
      <Screen style={styles.container} shouldAddBottomInset={false}>
        {isBarCode(barDetails?.epos_name ?? EPosType.BARCODE) ? (
          <>
            {showbothTabs(barDetails!) !== "both" ? (
              <>
                <View style={styles.customTabContainer}>
                  <View style={styles.customTab}>
                    <AppLabel
                      text={showbothTabs(barDetails!)}
                      textType={TEXT_TYPE.BOLD}
                      style={styles.customTabLabel}
                    />
                  </View>
                </View>
                <MenuListController
                  menuType={
                    showbothTabs(barDetails!) === "Dine-In"
                      ? ESupportedOrderType.DINE_IN_COLLECTION
                      : ESupportedOrderType.TAKEAWAY_DELIVERY
                  }
                />
              </>
            ) : (
              <>
                <View>
                  <SegmentedControl
                    values={[
                      {
                        label: "Dine-In",
                        value: Strings.venue_details.menu.dine_collection
                      },
                      {
                        label: "Takeaway/Delivery",
                        value: Strings.venue_details.menu.takeaway_delivery
                      }
                    ]}
                    selectedIndex={route.params.initialSegmentIndex}
                    onChange={(values, changedIndex) => {
                      setIndex(changedIndex);
                      navigation.navigate(
                        changedIndex === 0
                          ? "dine_in_collection"
                          : "take_away_delivery",
                        {
                          menuType:
                            changedIndex === 0
                              ? ESupportedOrderType.DINE_IN_COLLECTION
                              : ESupportedOrderType.TAKEAWAY_DELIVERY
                        }
                      );
                    }}
                  />
                </View>
                <MenuTabRoutes
                  initialRouteName={
                    index === 1
                      ? ESupportedOrderType.TAKEAWAY_DELIVERY
                      : ESupportedOrderType.DINE_IN_COLLECTION
                  }
                />
              </>
            )}
          </>
        ) : (
          <MenuListController
            initialParams={{
              menuType: ESupportedOrderType.ALL
            }}
          />
        )}
      </Screen>
    );
  } else {
    return null;
  }
};
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  container1: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: SPACE.md,
    paddingVertical: SPACE._2xl
  },
  customTabContainer: { backgroundColor: COLORS.white, elevation: 10 },
  customTab: {
    height: 35,
    marginHorizontal: SPACE.xl,
    marginVertical: 10,
    justifyContent: "center",
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: COLORS.theme?.primaryShade["700"]
  },
  customTabLabel: {
    color: COLORS.white
  }
});
export default MenuController;
