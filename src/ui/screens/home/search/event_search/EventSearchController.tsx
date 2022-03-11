/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  RouteProp,
  useNavigation,
  useRoute
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SetOfferBookMarkedApiRequestModel } from "models/api_requests/SetOfferBookMarkedApiRequestModel";
import { VenueSearchApiRequestModel } from "models/api_requests/VenueSearchApiRequestModel";
import { WhatsOnEventsApiRequestModel } from "models/api_requests/WhatsOnEventsApiRequestModel";
import EScreen from "models/enums/EScreen";
import ESearchType from "models/enums/ESearchType";
import { Offer } from "models/Offer";
import SearchParams from "models/SearchParams";
import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import SimpleToast from "react-native-simple-toast";
import { useEditsApis } from "repo/edits/EditsApis";
import { useVenuePaginatedApis } from "repo/venues/Venues";
import { HomeStackParamList } from "routes/HomeStack";
import { SearchStackParamList } from "routes/SearchStack";
import { AppLog } from "utils/Util";
import { redeemTypes } from "../../explore/filter/FilterController";
import EventSearchView from "./EventSearchView";

type EventSearchScreenProps = RouteProp<SearchStackParamList, "Events">;
type EventSearchNavigationProp = StackNavigationProp<
  HomeStackParamList,
  "Search"
>;

type Props = {};

const EventSearchController: React.FC = ({}: Props) => {
  const navigation = useNavigation<EventSearchNavigationProp>();
  const route = useRoute<EventSearchScreenProps>();
  const [events, setEvents] = useState<Offer[] | undefined>(undefined);
  const searchParams = route.params.searchParams;
  const searchType = route.params.type;

  const request: MutableRefObject<VenueSearchApiRequestModel> = useRef({});

  const getSearchParams = useCallback(() => {
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
    } else {
      request.current.establishment_id = "0";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { request: setEventBookmarkedRequest, loading: bookmarkedPb } =
    useEditsApis().setEventBookmarked;

  const onSaveBookmark = async (item: Offer, callback: () => void) => {
    const requestModel: SetOfferBookMarkedApiRequestModel = {
      event_id: item.id,
      is_favorite: item.is_user_favourite!
    };
    const { hasError, dataBody } = await setEventBookmarkedRequest(
      requestModel
    );
    if (!hasError && dataBody !== undefined) {
      callback();
      SimpleToast.show(dataBody.message);
    }
  };

  const onItemClicked = useCallback(
    (_offer: Offer) => {
      navigation.push("VenueDetails", {
        venue: _offer.establishment,
        isFrom: EScreen.HOME,
        initialRoute: ESearchType.EVENTS ? "WhatsOn" : "Menu",
        initialSegmentForWhatsOnIndex: 1
      });
    },
    [navigation]
  );

  const {
    isLoading,
    request: fetchEventsRequest,
    isAllDataLoaded,
    onEndReached,
    refetchDataFromStart,
    onPullToRefresh
  } = useVenuePaginatedApis(setEvents, request.current).events;

  useEffect(() => {
    getSearchParams();
    refetchDataFromStart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <EventSearchView
      isLoading={isLoading}
      isAllDataLoaded={isAllDataLoaded}
      pullToRefreshCallback={onPullToRefresh}
      onEndReached={onEndReached}
      data={events!}
      onBookmarked={onSaveBookmark}
      bookmarkedPb={bookmarkedPb}
      onItemClicked={onItemClicked}
    />
  );
};

export default EventSearchController;
