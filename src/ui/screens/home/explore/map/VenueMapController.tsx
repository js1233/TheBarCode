import {
  RouteProp,
  useNavigation,
  useRoute
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAppSelector } from "hooks/redux";
import {
  VenueContentType,
  VenuesRequestModel
} from "models/api_requests/VenuesRequestModel";
import EScreen from "models/enums/EScreen";
import { Venue } from "models/Venue";
import React, { FC, useEffect, useRef, useState } from "react";
import { useVenuePaginatedApis } from "repo/venues/Venues";
import { ExploreBottomBarParamsList } from "routes/ExploreBottomBar";
import { HomeStackParamList } from "routes/HomeStack";
import { RootState } from "stores/store";
import { VenueMapView } from "./VenueMapView";

type MapRouteProp = RouteProp<ExploreBottomBarParamsList, "ExploreMap">;
type HomeNavigationProp = StackNavigationProp<HomeStackParamList, "Home">;

type Props = {};

const VenueMapController: FC<Props> = () => {
  const [venue, setVenueList] = useState<Venue[] | undefined>(undefined);
  const navigation = useNavigation<HomeNavigationProp>();
  const route = useRoute<MapRouteProp>();
  const { refreshingEvent } = useAppSelector(
    (state: RootState) => state.general
  );
  const venuesRequestModel = useRef<VenuesRequestModel>({
    is_for_map: "1",
    type: VenueContentType.BARS
  });

  const { isLoading, request: fetchVenuesRequest } = useVenuePaginatedApis(
    setVenueList,
    venuesRequestModel.current,
    false
  ).venue;

  useEffect(() => {
    fetchVenuesRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = async () => {
    await fetchVenuesRequest();
  };

  //Handle event from refreshing api event
  useEffect(() => {
    if (refreshingEvent?.REFRESH_APIS_EXPLORE_SCREEN) {
      if (
        refreshingEvent.REFRESH_APIS_EXPLORE_SCREEN.includes(EScreen.MAP)
      ) {
        fetchVenuesRequest().then(() =>
          route.params?.callbackAfterApiHit?.()
        );
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshingEvent]);

  const openVenueDetail = (establishmentId: number) => {
    navigation.navigate("VenueDetails", { id: establishmentId });
  };

  return (
    <VenueMapView
      venues={venue}
      isLoading={isLoading}
      onRefresh={onRefresh}
      openVenueDetail={openVenueDetail}
    />
  );
};

export default VenueMapController;
