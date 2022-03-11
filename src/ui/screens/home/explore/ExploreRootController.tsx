import { FONT_SIZE, COLORS, SPACE } from "config";
import React, {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
  RefreshControl
} from "react-native";
import { ExploreBottomBarRoutes } from "routes/ExploreBottomBarRoutes";
import { AppLabel } from "ui/components/atoms/app_label/AppLabel";
import Screen from "ui/components/atoms/Screen";
import AllFilters from "assets/images/all_filters.svg";
import LeftFilters from "assets/images/left_filters.svg";
import LocationMarkerBlack from "assets/images/location_marker_black.svg";
import Menu from "assets/images/menu.svg";
import SearchIcon from "assets/images/search_gray.svg";
import { AppLog, shadowStyleProps, TAG } from "utils/Util";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ExploreBottomBarParamsList } from "routes/ExploreBottomBar";
import { HomeStackParamList } from "routes/HomeStack";
import EPreferencesScreenUseCase from "models/enums/EPreferencesScreenUseCase";
import ReloadBanner from "ui/components/organisms/reload_banner/ReloadBanner";
import SharedEventOfferDialog from "ui/components/organisms/app_dialogs/SharedEventOfferDialog";
import { useAppDispatch, useAppSelector } from "hooks/redux";
import { RootState } from "stores/store";
import { useInviteApis } from "repo/invite/InviteApis";
import { UpdateSharedOfferEventApiRequestModel } from "models/api_requests/UpdateSharedOfferEventApiRequestModel";
import SimpleToast from "react-native-simple-toast";
import Strings from "config/Strings";
import {
  consumeRefreshCount,
  setDynamicLink,
  setRefreshingEvent
} from "stores/generalSlice";
import { getStatusBarHeight } from "react-native-status-bar-height";
import EScreen from "models/enums/EScreen";
import SearchParams from "models/SearchParams";

type Props = {};

type HomeNavigationProp = StackNavigationProp<HomeStackParamList, "Home">;

type ExploreBottomNavProps = StackNavigationProp<
  ExploreBottomBarParamsList,
  "ExploreList"
>;

const ExploreRootController: FC<Props> = () => {
  const exploreBottomNav = useNavigation<ExploreBottomNavProps>();
  const homeNavigation = useNavigation<HomeNavigationProp>();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const [selectedType, setSelectedType] = useState<number>(0);
  const [shouldShowPopUp, setShouldShowPopup] = useState<boolean>(false);
  const [isOffer, setIsOffer] = useState<boolean>(false);
  const [inviteeName, setInviteeName] = useState<string | undefined>(
    undefined
  );
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { dynamicLink, standardOfferIds, redeemType, preferenceIds } =
    useAppSelector((state: RootState) => state.general);

  const hideSelf = useCallback(() => {
    setShouldShowPopup(false);
  }, []);

  const { request: postSharedOfferRequest } =
    useInviteApis().updateSharedOffersOnServer;

  const onPostSharedOffer = async (
    offerId: string,
    sharedById: string
  ) => {
    AppLog.log(
      () => "onPostSharedOffer: " + dynamicLink,
      TAG.DYNAMIC_LINK
    );
    const request: UpdateSharedOfferEventApiRequestModel = {
      offer_id: offerId,
      shared_by: sharedById
    };
    const { hasError, dataBody, errorBody } = await postSharedOfferRequest(
      request
    );
    if (!hasError && dataBody !== undefined) {
      setShouldShowPopup(true);
      setIsOffer(true);
    } else {
      SimpleToast.show(errorBody!);
    }
  };

  const { request: postSharedEventRequest } =
    useInviteApis().postSharedEvent;

  const onPostSharedEvent = async (
    eventId: string,
    sharedById: string
  ) => {
    const request: UpdateSharedOfferEventApiRequestModel = {
      event_id: eventId,
      shared_by: sharedById
    };
    const { hasError, dataBody, errorBody } = await postSharedEventRequest(
      request
    );
    if (!hasError && dataBody !== undefined) {
      setShouldShowPopup(true);
      setIsOffer(false);
    } else {
      SimpleToast.show(errorBody!);
    }
  };

  const postSharedOnServer = async () => {
    AppLog.log(
      () => "postSharedOnServer: " + dynamicLink,
      TAG.DYNAMIC_LINK
    );
    const sharedOfferId = dynamicLink
      ?.split("offer_id=")[1]
      ?.split("&")[0];
    const sharedEventId = dynamicLink
      ?.split("event_id=")[1]
      ?.split("&")[0];
    const inviteeId = dynamicLink?.split("shared_by=")[1].split("&")[0];
    const sharedByName = dynamicLink?.split("shared_by_name=")[1];
    setInviteeName(sharedByName);
    AppLog.log(() => "invitee name: " + sharedByName, TAG.DYNAMIC_LINK);
    AppLog.log(() => "sharedEventId: " + sharedEventId, TAG.DYNAMIC_LINK);
    AppLog.log(() => "sharedOfferId: " + sharedOfferId, TAG.DYNAMIC_LINK);
    dispatch(setDynamicLink(undefined));
    if (
      inviteeId !== null &&
      ((sharedOfferId !== null && sharedOfferId !== undefined) ||
        (sharedEventId !== null && sharedEventId !== undefined))
    ) {
      if (
        sharedOfferId !== null &&
        sharedOfferId !== undefined &&
        inviteeId !== null &&
        inviteeId !== undefined
      ) {
        if (inviteeId === user?.id.toString()) {
          SimpleToast.show(Strings.common.cannot_share_offer);
        } else {
          onPostSharedOffer(sharedOfferId, inviteeId);
        }
      } else {
        if (inviteeId === user?.id.toString()) {
          SimpleToast.show(Strings.common.cannot_share_event);
        } else {
          onPostSharedEvent(sharedEventId!, inviteeId!);
        }
      }
    }
  };

  useEffect(() => {
    postSharedOnServer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openWalletScreen = () => {
    homeNavigation.push("Wallet", {
      initialRouteName: "Shared",
      initialSegmentIndex: isOffer ? 0 : 1
    });
  };

  const startPreferencesFilterScreen = useCallback(() => {
    homeNavigation?.getParent()?.navigate("Preferences", {
      useCase: EPreferencesScreenUseCase.FILTER,
      selectedIds: _searchParams.current.preferenceIds
    });
  }, [homeNavigation]);

  const startFilterScreen = useCallback(() => {
    homeNavigation?.getParent()?.navigate("Filter", {
      offersId: undefined,
      redeemFilter: undefined,
      onFiltersSelected: (
        selectedOfferFilterIds: number[],
        selectedRedeemFilter: string[]
      ) => {
        AppLog.log(
          () =>
            "FiltersSelected: " +
            JSON.stringify(selectedOfferFilterIds) +
            " " +
            JSON.stringify(selectedRedeemFilter),
          TAG.SEARCH
        );
      }
    });
  }, [homeNavigation]);

  const _searchParams = useRef<SearchParams>({
    keyword: "",
    preferenceIds: preferenceIds,
    standardOfferIds: standardOfferIds,
    isDelivery: false,
    redemptionFilter: redeemType
  });

  const startSearchScreen = useCallback(() => {
    homeNavigation
      ?.getParent()
      ?.push("Search", { searchParams: _searchParams });
  }, [homeNavigation]);

  useEffect(() => {
    _searchParams.current.standardOfferIds = standardOfferIds;
    _searchParams.current.redemptionFilter = redeemType;
    _searchParams.current.preferenceIds = preferenceIds;
  }, [standardOfferIds, redeemType, preferenceIds]);

  const onListMapToggle = useCallback(
    (index: number) => {
      setSelectedType(index);

      exploreBottomNav.navigate(
        index === 0 ? "ExploreList" : "ExploreMap"
      );
    },
    [exploreBottomNav]
  );

  useLayoutEffect(() => {
    homeNavigation.setOptions({
      header: () => {
        return (
          <View style={[styles.headerViewContainer]}>
            <View style={[styles.leftHeaderView]}>
              <TouchableOpacity
                onPress={startFilterScreen}
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: 5
                }}>
                <AllFilters />
              </TouchableOpacity>
              <View style={[styles.spacer]} />
              <TouchableOpacity
                onPress={startPreferencesFilterScreen}
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 5
                }}>
                <LeftFilters />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.middleHeaderView]}
              onPress={startSearchScreen}>
              <SearchIcon style={{ marginRight: 5 }} />
              <AppLabel
                style={[styles.searchPlaceholderText]}
                text={"food, drink, events…"}
              />
            </TouchableOpacity>

            <View style={[styles.rightHeaderView]}>
              <TouchableOpacity
                onPress={() => onListMapToggle(0)}
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: 5
                }}>
                <Menu
                  stroke={selectedType === 0 ? "#171717" : "#737373"}
                />
              </TouchableOpacity>
              <View style={[styles.spacer]} />
              <TouchableOpacity
                onPress={() => onListMapToggle(1)}
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 5
                }}>
                <LocationMarkerBlack
                  stroke={selectedType === 1 ? "#171717" : "#737373"}
                />
              </TouchableOpacity>
            </View>
          </View>
        );
      }
    });
  }, [
    homeNavigation,
    onListMapToggle,
    selectedType,
    startFilterScreen,
    startPreferencesFilterScreen,
    startSearchScreen
  ]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(
      setRefreshingEvent({
        REFRESH_APIS_EXPLORE_SCREEN: [
          EScreen.VENUES_LIST,
          EScreen.MAP,
          EScreen.RELOAD_BANNER
        ]
      })
    );

    setTimeout(() => {
      dispatch(consumeRefreshCount());
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const callbackAfterApiHit = useCallback(() => {
    setRefreshing(false);
  }, []);

  return (
    <ScrollView
      horizontal={true}
      alwaysBounceHorizontal={false}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <Screen style={[styles.container]} shouldAddBottomInset={false}>
        <>
          <ReloadBanner
            containerStyle={{
              start: SPACE.lg,
              end: SPACE.lg,
              position: "absolute",
              top: 0,
              zIndex: 1
            }}
            navigation={homeNavigation}
          />

          <SharedEventOfferDialog
            isVisible={shouldShowPopUp}
            hideSelf={hideSelf}
            isOffer={isOffer}
            inviteeName={inviteeName?.split("_").join(" ")}
            onButtonClicked={() => {
              hideSelf();
              openWalletScreen();
            }}
          />
        </>

        <ExploreBottomBarRoutes
          callbackAfterApiHit={callbackAfterApiHit}
        />
      </Screen>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1
  },
  container: {
    flex: 1,
    height: "100%"
  },
  headerViewContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.theme?.interface[50],
    width: "100%",
    height: Platform.OS === "ios" ? 50 + getStatusBarHeight() : 50,
    alignItems: "center",
    justifyContent: "space-between",

    paddingTop: Platform.OS === "ios" ? getStatusBarHeight() : 0,
    paddingBottom: 10,
    ...shadowStyleProps
  },
  leftHeaderView: {
    backgroundColor: COLORS.theme?.interface[200],
    height: "90%",
    width: "20%",
    borderRadius: 30,
    marginLeft: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  middleHeaderView: {
    backgroundColor: COLORS.theme?.interface[200],
    height: "90%",
    width: "55%",
    paddingLeft: SPACE.md,
    borderRadius: 20,
    flexDirection: "row",
    // justifyContent: "center"
    alignItems: "center"
  },
  rightHeaderView: {
    backgroundColor: COLORS.theme?.interface[200],
    height: "90%",
    width: "20%",
    borderRadius: 30,
    marginRight: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  spacer: {
    height: "100%",
    width: 1,
    backgroundColor: COLORS.theme?.interface[300]
  },
  spacerHorizontal: {
    height: 0.5,
    width: "100%",
    backgroundColor: COLORS.theme?.interface[300]
  },
  searchPlaceholderText: {
    fontSize: FONT_SIZE._3xs,
    color: COLORS.theme?.interface[500]
  }
});

export default ExploreRootController;
