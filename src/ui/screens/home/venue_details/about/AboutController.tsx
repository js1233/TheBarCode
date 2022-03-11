/* eslint-disable @typescript-eslint/no-unused-vars */
import { MaterialTopTabNavigationProp } from "@react-navigation/material-top-tabs";
import {
  RouteProp,
  useNavigation,
  useRoute
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAppDispatch, useAppSelector } from "hooks/redux";
import { setBarDetails } from "stores/generalSlice";
import EScreen from "models/enums/EScreen";
import React, { FC, useEffect } from "react";
import { useVenueApis } from "repo/venues/Venues";
import { HomeStackParamList } from "routes/HomeStack";
import { VenueDetailsTopTabsParamList } from "routes/VenueDetailsTopTabs";
import { RootState } from "stores/store";
import { AppLog, TAG } from "utils/Util";
import AboutView from "./AboutView";

type AboutScreenProps = RouteProp<VenueDetailsTopTabsParamList, "About">;
type AboutNavigationProp = MaterialTopTabNavigationProp<
  VenueDetailsTopTabsParamList,
  "About"
>;

type HomeNavigationProps = StackNavigationProp<
  HomeStackParamList,
  "VenueDetails"
>;

type Props = {};

const AboutController: FC<Props> = () => {
  const navigation = useNavigation<AboutNavigationProp>();
  const homeNavigation = useNavigation<HomeNavigationProps>();
  const route = useRoute<AboutScreenProps>();

  // const _venue: MutableRefObject<Venue> = useRef(route.params.venue);
  // const [venue, setVenue] = useState<Venue | undefined>(
  //   route.params.venue
  // );

  const { refreshingEvent, barDetails } = useAppSelector(
    (state: RootState) => state.general
  );
  const dispatch = useAppDispatch();
  const { request: fetchVenuesById } = useVenueApis().getBarDetailsById;

  async function getBarDetails() {
    AppLog.log(() => "establishment_id: " + barDetails?.id, TAG.DETAIL);
    const { hasError, dataBody } = await fetchVenuesById({
      establishment_id: barDetails?.id
    });
    if (!hasError && dataBody !== undefined) {
      AppLog.log(
        () => "databody: " + JSON.stringify(dataBody.data),
        TAG.DETAIL
      );
      dispatch(setBarDetails(dataBody.data));
    }
  }

  //Handle event from refreshing api event
  useEffect(() => {
    if (
      refreshingEvent?.REFRESH_APIS_EXPLORE_SCREEN &&
      refreshingEvent.REFRESH_APIS_EXPLORE_SCREEN.includes(
        EScreen.VENUE_DETAIL_ABOUT
      )
    ) {
      getBarDetails();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshingEvent]);

  return <AboutView venue={barDetails} />;
};

export default AboutController;
