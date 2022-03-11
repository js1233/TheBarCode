import {
  RouteProp,
  useNavigation,
  useRoute
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Strings from "config/Strings";
import { EWhatsOnType } from "models/enums/EWhatsOnType";
import React, { FC } from "react";
import { StyleSheet } from "react-native";
import { VenueDetailsTopTabsParamList } from "routes/VenueDetailsTopTabs";
import { WhatsOnTabParamsList } from "routes/WhatsOnTabBar";
import { WhatsOnTabRoutes } from "routes/WhatsOnTabBarRoutes";
import Screen from "ui/components/atoms/Screen";
import { SegmentedControl } from "ui/components/molecules/segmented_control/SegmentedControl";
import { AppLog, TAG } from "utils/Util";
import { useAppSelector } from "hooks/redux";
import { RootState } from "stores/store";

type WhatsOnScreenProp = RouteProp<
  VenueDetailsTopTabsParamList,
  "WhatsOn"
>;

// type HomeNavigationProps = StackNavigationProp<
//   HomeStackParamList,
//   "VenueDetails"
// >;

type WhatsOnTabNavigationProps = StackNavigationProp<
  WhatsOnTabParamsList,
  "offers"
>;

// type WhatsOnNavigationProps = MaterialTopTabNavigationProp<
//   VenueDetailsTopTabsParamList,
//   "WhatsOn"
// >;

type Props = {};

const WhatsOnController: FC<Props> = () => {
  const navigation = useNavigation<WhatsOnTabNavigationProps>();
  const route = useRoute<WhatsOnScreenProp>();
  const { barDetails } = useAppSelector(
    (state: RootState) => state.general
  );
  AppLog.log(
    () => "EhatsOnNotificationType: " + route.params.notificationType,
    TAG.VENUE
  );

  function getSelectedIndex() {
    AppLog.log(
      () =>
        "getSelectedIndex() => route.params.initialSegmentIndex: " +
        route.params.initialSegmentIndex,
      TAG.SEARCH
    );
    AppLog.log(
      () =>
        "route.params.notificationType: " + route.params.notificationType,
      TAG.SEARCH
    );
    if (route.params.initialSegmentIndex) {
      return route.params.initialSegmentIndex;
    } else {
      return route.params.notificationType === "event" ? 1 : 0;
    }
  }
  return (
    <Screen style={styles.container} shouldAddBottomInset={false}>
      <SegmentedControl
        values={[
          {
            label: "Offers",
            value: Strings.venue_details.whatson.offers
          },
          {
            label: "Events",
            value: Strings.venue_details.whatson.events
          }
        ]}
        selectedIndex={getSelectedIndex()}
        onChange={(value, index) => {
          navigation.navigate(index === 0 ? "offers" : "events", {
            venue: barDetails,
            menuType:
              index === 0 ? EWhatsOnType.OFFERS : EWhatsOnType.EVENTS
          });
        }}
      />
      <WhatsOnTabRoutes
        venue={barDetails}
        initialRouteName={
          getSelectedIndex() === 0
            ? EWhatsOnType.OFFERS
            : EWhatsOnType.EVENTS
        }
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default WhatsOnController;
