/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC } from "react";
import { MenuTabBar } from "./MenuTabBar";
import MenuListController from "ui/screens/home/venue_details/menu/list/MenuListController";
import { Venue } from "models/Venue";
import ESupportedOrderType from "models/enums/ESupportedOrderType";

type Props = {
  initialRouteName: ESupportedOrderType;
};

export const MenuTabRoutes: FC<Props> = ({
  initialRouteName = ESupportedOrderType.DINE_IN_COLLECTION
}) => {
  return (
    <MenuTabBar.Navigator
      tabBar={() => null}
      screenOptions={{
        headerShown: false
      }}
      initialRouteName={initialRouteName}>
      <MenuTabBar.Screen
        name="dine_in_collection"
        component={MenuListController}
        initialParams={{
          menuType: initialRouteName
        }}
      />

      <MenuTabBar.Screen
        name="take_away_delivery"
        component={MenuListController}
        initialParams={{
          menuType: initialRouteName
        }}
      />
    </MenuTabBar.Navigator>
  );
};
