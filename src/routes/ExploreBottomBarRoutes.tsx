import React, { FC } from "react";
import { ExploreBottomBar } from "./ExploreBottomBar";
import ExploreController from "ui/screens/home/explore/list/ExploreController";
import VenueMapController from "ui/screens/home/explore/map/VenueMapController";

type Props = {
  callbackAfterApiHit: () => void;
};
export const ExploreBottomBarRoutes: FC<Props> = ({
  callbackAfterApiHit
}) => {
  return (
    <ExploreBottomBar.Navigator
      tabBar={() => null}
      screenOptions={{
        headerShown: false
      }}
      initialRouteName="ExploreList">
      <ExploreBottomBar.Screen
        name="ExploreList"
        component={ExploreController}
        initialParams={{ callbackAfterApiHit: callbackAfterApiHit }}
      />

      <ExploreBottomBar.Screen
        name="ExploreMap"
        component={VenueMapController}
        initialParams={{ callbackAfterApiHit: callbackAfterApiHit }}
      />
    </ExploreBottomBar.Navigator>
  );
};
