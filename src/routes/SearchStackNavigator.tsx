import ESearchType from "models/enums/ESearchType";
import SearchParams from "models/SearchParams";
import React from "react";
import EventSearchController from "ui/screens/home/search/event_search/EventSearchController";
import SearchInMapController from "ui/screens/home/search/map/SearchInMapController";
import MenuSearchController from "ui/screens/home/search/menu_search/MenuSearchController";
import SearchVenueController from "ui/screens/home/search/venue_search/SearchVenueController";
import SearchStack from "./SearchStack";

type Props = {
  searchParams?: SearchParams;
};

function SearchStackNavigator({ searchParams }: Props) {
  return (
    <SearchStack.Navigator
      initialRouteName={"VenueSearch"}
      screenOptions={{
        headerShown: false
      }}>
      <SearchStack.Screen
        name={"VenueSearch"}
        component={SearchVenueController}
        initialParams={{
          type: ESearchType.VENUE,
          searchParams: searchParams
        }}
      />
      <SearchStack.Screen
        name={"MenuSearch"}
        component={MenuSearchController}
        initialParams={{
          type: ESearchType.TAKE_AWAY_DELIVERY,
          searchParams: searchParams
        }}
      />
      <SearchStack.Screen
        name={"Events"}
        component={EventSearchController}
        initialParams={{
          type: ESearchType.EVENTS,
          searchParams: searchParams
        }}
      />
      <SearchStack.Screen
        name="Map"
        component={SearchInMapController}
        initialParams={{
          type: ESearchType.VENUE,
          searchParams: searchParams
        }}
      />
    </SearchStack.Navigator>
  );
}

export default SearchStackNavigator;
