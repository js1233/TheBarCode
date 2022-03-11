import {
  RouteProp,
  useNavigation,
  useRoute
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAppSelector } from "hooks/redux";
import { VenueSearchApiRequestModel } from "models/api_requests/VenueSearchApiRequestModel";
import ESearchType from "models/enums/ESearchType";
import { Offer } from "models/Offer";
import { SearchAll } from "models/SearchAll";
import { Venue } from "models/Venue";
import React, {
  FC,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import { useVenuePaginatedApis } from "repo/venues/Venues";
import { HomeStackParamList } from "routes/HomeStack";
import { SearchStackParamList } from "routes/SearchStack";
import { RootState } from "stores/store";
import { AppLog, TAG } from "utils/Util";
import { redeemTypes } from "../../explore/filter/FilterController";
import { SearchInMapView } from "./SearchInMapView";

type SearchInMapScreenProps = RouteProp<SearchStackParamList, "Map">;
type HomeNavigationProp = StackNavigationProp<HomeStackParamList, "Home">;

type Props = {};

const SearchInMapController: FC<Props> = () => {
  const route = useRoute<SearchInMapScreenProps>();
  const navigation = useNavigation<HomeNavigationProp>();
  const searchParams = route.params.searchParams;
  const { selectedSearchTab } = useAppSelector(
    (state: RootState) => state.general
  );
  // const searchType = selectedSearchTab;
  const [list, setList] = useState<Venue[] | undefined>(undefined);
  const [events, setEvents] = useState<Offer[] | undefined>(undefined);
  const [searchAll, setSearchAll] = useState<SearchAll[] | undefined>(
    undefined
  );
  const request: MutableRefObject<VenueSearchApiRequestModel> = useRef({});
  let listToBeConvertedIntoVenue: MutableRefObject<Venue[] | undefined> =
    useRef(undefined);

  //For Venues/Delivery/Offers
  const { isLoading: VenueSearchLoading, request: fetchVenuesRequest } =
    useVenuePaginatedApis(setList, request.current, false).venue;

  //For Menu Search- (Dine in & TakeAwaay/Delivery)
  const { isLoading: MenuSearchLoading, request: fetchMenusRequest } =
    useVenuePaginatedApis(setList, request.current, false).menu;

  //For Events Search
  const { isLoading: EventSearchLoading, request: fetchEventsRequest } =
    useVenuePaginatedApis(setEvents, request.current, false).events;

  //For Search All
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { request: fetchSearchAllRequest, isLoading: SearchAllLoading } =
    useVenuePaginatedApis(setSearchAll, request.current).searchAll;

  const fetchApis = useCallback(() => {
    setList(undefined);
    setEvents(undefined);
    setSearchAll(undefined);
    AppLog.log(
      () => "searchType in fetchApis():  " + selectedSearchTab,
      TAG.SEARCH
    );
    if (
      selectedSearchTab === ESearchType.VENUE ||
      selectedSearchTab === ESearchType.OFFER ||
      selectedSearchTab === ESearchType.OAPA
    ) {
      fetchVenuesRequest();
    } else if (selectedSearchTab === ESearchType.TAKE_AWAY_DELIVERY) {
      fetchMenusRequest();
    } else if (selectedSearchTab === ESearchType.EVENTS) {
      fetchEventsRequest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSearchTab]);

  useEffect(() => {
    AppLog.log(() => "searchType: " + selectedSearchTab, TAG.SEARCH);
    request.current.type = undefined;
    request.current.supported_order_type = undefined;
    request.current.is_delivering = undefined;
    if (selectedSearchTab === ESearchType.VENUE) {
      request.current.type = "bars";
    } else if (selectedSearchTab === ESearchType.OFFER) {
      request.current.type = "deals";
    } else if (selectedSearchTab === ESearchType.TAKE_AWAY_DELIVERY) {
      request.current.supported_order_type = "takeaway_delivery";
    }
    if (selectedSearchTab === ESearchType.OAPA) {
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
      request.current.is_for_map = "true";
    } else {
      if (selectedSearchTab === ESearchType.EVENTS) {
        request.current.establishment_id = "0";
      }
    }
    listToBeConvertedIntoVenue.current = [];
    setList(undefined);
    setEvents(undefined);
    setSearchAll(undefined);
    fetchApis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSearchTab, searchParams]);

  useEffect(() => {
    listToBeConvertedIntoVenue.current = [];
    events?.forEach((event) => {
      listToBeConvertedIntoVenue?.current?.push(event?.establishment!);
    });
    setList(listToBeConvertedIntoVenue.current);
  }, [events]);

  useEffect(() => {
    listToBeConvertedIntoVenue.current = [];
    searchAll?.forEach((search) => {
      search.results.forEach((result) => {
        if (search.type === ESearchType.EVENTS) {
          const event = result as Offer;
          listToBeConvertedIntoVenue.current?.push(
            event.establishment as Venue
          );
        } else {
          listToBeConvertedIntoVenue.current?.push(result as Venue);
        }
      });
    });

    // AppLog.log(
    //   () =>
    //     "listToBeConvertedIntoVenue: " +
    //     JSON.stringify(listToBeConvertedIntoVenue.current),
    //   TAG.API
    // );

    setList(listToBeConvertedIntoVenue.current);
  }, [searchAll]);

  function getProgressBarStatus() {
    if (
      selectedSearchTab === ESearchType.VENUE ||
      selectedSearchTab === ESearchType.OFFER ||
      selectedSearchTab === ESearchType.OAPA
    ) {
      return VenueSearchLoading;
    } else if (selectedSearchTab === ESearchType.TAKE_AWAY_DELIVERY) {
      return MenuSearchLoading;
    } else if (selectedSearchTab === ESearchType.EVENTS) {
      return EventSearchLoading;
    } else {
      return SearchAllLoading;
    }
  }

  const onRefresh = () => {
    fetchApis();
  };
  const openVenueDetail = (establishmentId: number) => {
    navigation.navigate("VenueDetails", { id: establishmentId });
  };

  // useEffect(() => {
  //   AppLog.log(() => "selected search tab: " + selectedSearchTab, TAG.API);
  //   fetchApis();
  // }, [selectedSearchTab, fetchApis]);

  return (
    <SearchInMapView
      venues={list}
      isLoading={getProgressBarStatus()}
      onRefresh={onRefresh}
      openVenueDetail={openVenueDetail}
    />
  );
};

export default SearchInMapController;
