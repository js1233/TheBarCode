/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  RouteProp,
  useNavigation,
  useRoute
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { VenueSearchApiRequestModel } from "models/api_requests/VenueSearchApiRequestModel";
import EScreen from "models/enums/EScreen";
import ESearchType from "models/enums/ESearchType";
import SearchParams from "models/SearchParams";
import { Venue } from "models/Venue";
import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import { useVenuePaginatedApis } from "repo/venues/Venues";
import { HomeStackParamList } from "routes/HomeStack";
import { SearchStackParamList } from "routes/SearchStack";
import { redeemTypes } from "../../explore/filter/FilterController";
import MenuSearchView from "./MenuSearchView";

type MenuSearchScreenProps = RouteProp<SearchStackParamList, "MenuSearch">;
type MenuSearchNavigationProp = StackNavigationProp<
  HomeStackParamList,
  "Search"
>;

type Props = {};

const MenuSearchController: React.FC = ({}: Props) => {
  const navigation = useNavigation<MenuSearchNavigationProp>();
  const route = useRoute<MenuSearchScreenProps>();
  const [menus, setMenus] = useState<Venue[] | undefined>(undefined);
  const searchParams = route.params.searchParams;
  const searchType = route.params.type;

  const request: MutableRefObject<VenueSearchApiRequestModel> = useRef({});

  const {
    isLoading,
    request: fetchEventsRequest,
    isAllDataLoaded,
    onEndReached,
    onPullToRefresh,
    refetchDataFromStart
  } = useVenuePaginatedApis(setMenus, request.current).menu;

  // const getIndex = useCallback(() => {
  //   if (searchType === ESearchType.T) {
  //     return 0;
  //   } else {
  //     return 1;
  //   }
  // }, [searchType]);

  const onItemClicked = useCallback(
    (_venue: Venue) => {
      navigation.push("VenueDetails", {
        venue: _venue,
        isFrom: EScreen.HOME,
        initialRoute: "Menu",
        initialSegmentForMenuIndex: 1
      });
    },
    [navigation]
  );

  useEffect(() => {
    request.current.is_for_map = "false";
    if (searchParams !== undefined && searchParams !== null) {
      request.current.keyword = searchParams.keyword;
      request.current.interest_ids = searchParams.preferenceIds;
      request.current.tier_ids = searchParams.standardOfferIds;
      if (searchParams.redemptionFilter === redeemTypes[1].id) {
        request.current.is_unlimited_redemption = "true";
      } else if (searchParams.redemptionFilter === redeemTypes[2].id) {
        request.current.is_unlimited_redemption === "false";
      }
      if (searchParams.isDelivery) {
        request.current.is_delivering = "true";
      }
      if (searchType === ESearchType.DINE_IN_COLLECTION) {
        request.current.supported_order_type = "dine_in_collection";
      }
      if (searchType === ESearchType.TAKE_AWAY_DELIVERY) {
        request.current.supported_order_type = "takeaway_delivery";
      }
    }
    refetchDataFromStart();
  }, [searchParams, searchType, refetchDataFromStart]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      refetchDataFromStart();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  });

  return (
    <MenuSearchView
      shouldShowProgressBar={isLoading}
      isAllDataLoaded={isAllDataLoaded}
      pullToRefreshCallback={onPullToRefresh}
      onEndReached={onEndReached}
      data={menus}
      onItemClicked={onItemClicked}
    />
  );
};

export default MenuSearchController;
