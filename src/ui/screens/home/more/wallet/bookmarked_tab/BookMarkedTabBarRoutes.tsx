import React, { FC } from "react";
import { BookMarkedTabBar } from "ui/screens/home/more/wallet/bookmarked_tab/BookmarkedTabBar";
import BookMarkedOfferController from "ui/screens/home/more/wallet/bookmarked_tab/bookmarked_offer/BookMarkedOfferController";
import BookMarkedEventController from "ui/screens/home/more/wallet/bookmarked_tab/bookmarked_event/BookMarkedEventController";

type Props = {};

export const BookMarkedTabRoutes: FC<Props> = ({}) => {
  return (
    <BookMarkedTabBar.Navigator
      tabBar={() => null}
      screenOptions={{
        headerShown: false
      }}
      initialRouteName="BookMarkedOffers">
      <BookMarkedTabBar.Screen
        name="BookMarkedOffers"
        component={BookMarkedOfferController}
      />

      <BookMarkedTabBar.Screen
        name="BookMarkedEvents"
        component={BookMarkedEventController}
      />
    </BookMarkedTabBar.Navigator>
  );
};
