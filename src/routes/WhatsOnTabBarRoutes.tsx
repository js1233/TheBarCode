import { EWhatsOnType } from "models/enums/EWhatsOnType";
import React, { FC } from "react";
import EventsController from "ui/screens/home/venue_details/what's_on/list/whatson_events/EventsController";
import OffersController from "ui/screens/home/venue_details/what's_on/list/whatson_offers/OffersController";
import { whatsOnTab } from "./WhatsOnTabBar";

type Props = {
  initialRouteName: EWhatsOnType;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const WhatsOnTabRoutes: FC<Props> = ({
  initialRouteName = EWhatsOnType.OFFERS
}) => {
  return (
    <whatsOnTab.Navigator
      tabBar={() => null}
      screenOptions={{
        headerShown: false
      }}
      initialRouteName={initialRouteName}>
      <whatsOnTab.Screen
        name="offers"
        component={OffersController}
        initialParams={{
          menuType: EWhatsOnType.OFFERS
        }}
      />
      <whatsOnTab.Screen
        name="events"
        component={EventsController}
        initialParams={{
          menuType: EWhatsOnType.EVENTS
        }}
      />
    </whatsOnTab.Navigator>
  );
};
