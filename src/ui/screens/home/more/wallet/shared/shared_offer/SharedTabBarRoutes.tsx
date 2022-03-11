import React, { FC } from "react";
import { SharedTabBar } from "ui/screens/home/more/wallet/shared/shared_offer/SharedTabBar";
import SharedOfferController from "ui/screens/home/more/wallet/shared/shared_offer/shared_offers/SharedOfferController";
import SharedEventController from "ui/screens/home/more/wallet/shared/shared_offer/shared_events/SharedEventsController";

type Props = {};

export const SharedTabRoutes: FC<Props> = ({}) => {
  return (
    <SharedTabBar.Navigator
      tabBar={() => null}
      screenOptions={{
        headerShown: false
      }}
      initialRouteName="SharedOffers">
      <SharedTabBar.Screen
        name="SharedOffers"
        component={SharedOfferController}
      />

      <SharedTabBar.Screen
        name="SharedEvents"
        component={SharedEventController}
      />
    </SharedTabBar.Navigator>
  );
};
