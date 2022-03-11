import { createStackNavigator } from "@react-navigation/stack";
import ESearchType from "models/enums/ESearchType";
import SearchParams from "models/SearchParams";

export type SearchStackParamList = {
  VenueSearch: {
    type: ESearchType;
    searchParams: SearchParams;
  };
  MenuSearch: {
    type: ESearchType;
    searchParams?: SearchParams;
  };
  Events: {
    type: ESearchType;
    searchParams?: SearchParams;
  };
  Map: {
    type: ESearchType;
    searchParams?: SearchParams;
  };
};

const SearchStack = createStackNavigator<SearchStackParamList>();

export default SearchStack;
