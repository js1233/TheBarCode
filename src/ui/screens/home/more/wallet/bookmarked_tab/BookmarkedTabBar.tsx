import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

export type BookMarkedTabParamsList = {
  BookMarkedOffers: undefined;
  BookMarkedEvents: undefined;
};

export const BookMarkedTabBar =
  createBottomTabNavigator<BookMarkedTabParamsList>();
