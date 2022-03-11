import { Venue } from "models/Venue";
import React, {
  FC,
  MutableRefObject,
  useEffect,
  useRef,
  useState
} from "react";
import { useVenuePaginatedApis } from "repo/venues/Venues";
import { ExploreView } from "./ExploreView";
import { HomeStackParamList } from "routes/HomeStack";
import {
  RouteProp,
  useNavigation,
  useRoute
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import EScreen from "models/enums/EScreen";
import { AppLog, TAG } from "utils/Util";
import { useAppSelector } from "hooks/redux";
import { RootState } from "stores/store";
import _ from "lodash";
import { ExploreBottomBarParamsList } from "routes/ExploreBottomBar";
import { usePreventDoubleTap } from "hooks";
import { VenueSearchApiRequestModel } from "models/api_requests/VenueSearchApiRequestModel";
import { redeemTypes } from "../filter/FilterController";

type HomeNavigationProp = StackNavigationProp<HomeStackParamList, "Home">;
type HomeNavigationRouteProp = RouteProp<
  ExploreBottomBarParamsList,
  "ExploreList"
>;

type Props = {};

const ExploreController: FC<Props> = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  const route = useRoute<HomeNavigationRouteProp>();

  const [venue, setVenueList] = useState<Venue[] | undefined>(undefined);
  const { refreshingEvent } = useAppSelector(
    (state: RootState) => state.general
  );
  const { standardOfferIds, redeemType, preferenceIds } = useAppSelector(
    (state: RootState) => state.general
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

  useEffect(() => {
    fetchVenuesRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    request.current.tier_ids = standardOfferIds;
    request.current.is_unlimited_redemption = undefined;
    if (redeemType === redeemTypes[1].id) {
      request.current.is_unlimited_redemption = "true";
    } else if (redeemType === redeemTypes[2].id) {
      request.current.is_unlimited_redemption === "false";
    }
    request.current.interest_ids = preferenceIds;
    refetchDataFromStart();
  }, [standardOfferIds, refetchDataFromStart, redeemType, preferenceIds]);

  const onItemClicked = usePreventDoubleTap((_venue: Venue) => {
    AppLog.log(
      () => "Open venue detail screen # " + JSON.stringify(_venue),
      TAG.REDEEM
    );
    navigation.push("VenueDetails", {
      venue: _venue,
      isFrom: EScreen.HOME
    });
  });

  //Handle event from refreshing api event
  useEffect(() => {
    if (refreshingEvent?.SUCCESSFULL_REDEMPTION) {
      AppLog.log(
        () => "\n\n listening for unlimited redemtion ",
        TAG.IN_APP_PURCHASE
      );
      setVenueList((prevList) => {
        if (prevList && prevList.length > 0) {
          let findItem = prevList?.find(
            (item) =>
              item.id === refreshingEvent?.SUCCESSFULL_REDEMPTION?.venueId
          );
          if (findItem) {
            findItem!.can_redeem_offer = false;
            prevList.splice(
              prevList?.findIndex(
                (item) =>
                  item.id ===
                  refreshingEvent?.SUCCESSFULL_REDEMPTION?.venueId
              ),
              1,
              findItem!
            );

            return _.cloneDeep(prevList);
          }
          return prevList;
        } else {
          return undefined;
        }
      });
    }
    AppLog.log(
      () =>
        "\n\n SUCCESSFULL_PURCHASE?.bar_id! " +
        refreshingEvent?.SUCCESSFULL_PURCHASE?.bar_id!,
      TAG.IN_APP_PURCHASE
    );
    if (
      refreshingEvent?.SUCCESSFULL_PURCHASE &&
      refreshingEvent?.SUCCESSFULL_PURCHASE?.bar_id !== "" &&
      refreshingEvent?.SUCCESSFULL_PURCHASE?.bar_id !== undefined
    ) {
      AppLog.log(
        () =>
          "\n modifying list " +
          refreshingEvent?.SUCCESSFULL_PURCHASE?.bar_id!,
        TAG.IN_APP_PURCHASE
      );
      setVenueList((prevList) => {
        if (prevList && prevList.length > 0) {
          let findItem = prevList?.find(
            (item) =>
              item.id ===
              Number(refreshingEvent?.SUCCESSFULL_PURCHASE?.bar_id)
          );
          AppLog.log(
            () => "\n before modified list " + JSON.stringify(findItem),
            TAG.IN_APP_PURCHASE
          );
          if (findItem) {
            findItem!.can_unlimited_redeem = true;
            prevList.splice(
              prevList?.findIndex(
                (item) =>
                  item.id ===
                  Number(refreshingEvent?.SUCCESSFULL_PURCHASE?.bar_id)
              ),
              1,
              findItem!
            );
            AppLog.log(
              () => "\n after modified list " + JSON.stringify(findItem),
              TAG.IN_APP_PURCHASE
            );
            return _.cloneDeep(prevList);
          }
          return prevList;
        } else {
          return undefined;
        }
      });
    }

    if (refreshingEvent?.SUCCESSFULL_PURCHASE) {
      fetchVenuesRequest();
    }

    if (
      refreshingEvent?.REFRESH_APIS_EXPLORE_SCREEN &&
      refreshingEvent.REFRESH_APIS_EXPLORE_SCREEN.includes(
        EScreen.VENUES_LIST
      )
    ) {
      onPullToRefresh((data: any) => {
        setVenueList(undefined);
        setVenueList(data);
        route?.params?.callbackAfterApiHit();
      }, true);
    }

    if (refreshingEvent?.MOVE_TO_SCREEN === EScreen.MY_ORDERS) {
      navigation.getParent()?.navigate("Cart");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshingEvent]);

  return (
    <ExploreView
      data={venue}
      shouldShowProgressBar={isLoading}
      isAllDataLoaded={isAllDataLoaded}
      onEndReached={onEndReached}
      pullToRefreshCallback={onPullToRefresh}
      onItemClicked={onItemClicked}
    />
  );
};

export default ExploreController;
