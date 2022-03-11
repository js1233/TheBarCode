/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  RouteProp,
  useNavigation,
  useRoute
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import App from "App";
import { usePreventDoubleTap } from "hooks";
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
import { AppLog, TAG } from "utils/Util";
import { redeemTypes } from "../../explore/filter/FilterController";
import SearchVenueView from "./SearchVenueView";

type VenueSearchScreenProps = RouteProp<
  SearchStackParamList,
  "VenueSearch"
>;
type VenueSearchNavigationProp = StackNavigationProp<
  HomeStackParamList,
  "Search"
>;

type Props = {};

const SearchVenueController: React.FC = ({}: Props) => {
  const navigation = useNavigation<VenueSearchNavigationProp>();
  const route = useRoute<VenueSearchScreenProps>();
  const [venue, setVenueList] = useState<Venue[] | undefined>(undefined);
  const searchParams = route.params.searchParams;
  const searchType = route.params.type;
  AppLog.log(
    () =>
      "SearchVenueController: " +
      JSON.stringify(route.params.searchParams),
    TAG.API
  );

  const request: MutableRefObject<VenueSearchApiRequestModel> = useRef({});

  const {
    isLoading,
    request: fetchVenuesRequest,
    isAllDataLoaded,
    onEndReached,
    onPullToRefresh,
    refetchDataFromStart
  } = useVenuePaginatedApis(setVenueList, request.current).venue;

  const getInitialRoute = useCallback(() => {
    if (searchType === ESearchType.OFFER) {
      return "WhatsOn";
    } else {
      return "Menu";
    }
  }, [searchType]);

  const onItemClicked = usePreventDoubleTap((_venue: Venue) => {
    AppLog.log(
      () => "Open venue detail screen # " + JSON.stringify(_venue),
      TAG.REDEEM
    );
    navigation.push("VenueDetails", {
      venue: _venue,
      isFrom: EScreen.HOME,
      initialRoute: getInitialRoute()
    });
  });

  useEffect(() => {
    AppLog.log(() => "request.current.type: " + searchType, TAG.SEARCH);
    if (searchType === ESearchType.VENUE) {
      request.current.type = "bars";
    } else if (searchType === ESearchType.OFFER) {
      request.current.type = "deals";
    } else if (searchType === ESearchType.OAPA) {
      request.current.type = "oapa";
    }
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
      request.current.is_for_map = "false";
    }
    refetchDataFromStart();
  }, [searchType, searchParams, refetchDataFromStart]);

  useEffect(() => {
    AppLog.log(
      () =>
        "SearchVenueController route.params.searchParams: " +
        JSON.stringify(route.params.searchParams),
      TAG.API
    );
  }, [route.params.searchParams]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      refetchDataFromStart();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  });

  return (
    <SearchVenueView
      data={venue}
      shouldShowProgressBar={isLoading}
      isAllDataLoaded={isAllDataLoaded}
      onEndReached={onEndReached}
      pullToRefreshCallback={onPullToRefresh}
      type={searchType}
      onItemClicked={onItemClicked}
    />
  );
};

export default SearchVenueController;
