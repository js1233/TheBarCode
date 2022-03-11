import React, { FC, useCallback } from "react";
import {
  Choice,
  SegmentedControl
} from "ui/components/molecules/segmented_control/SegmentedControl";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  RouteProp,
  useNavigation,
  useRoute
} from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import Screen from "ui/components/atoms/Screen";
import { SharedTabRoutes } from "ui/screens/home/more/wallet/shared/shared_offer/SharedTabBarRoutes";
import { SharedTabParamsList } from "ui/screens/home/more/wallet/shared/shared_offer/SharedTabBar";
import { WalletTabsParamsList } from "../WalletMaterialTabs";

type Props = {};
type HomeNavigationProps = StackNavigationProp<
  SharedTabParamsList,
  "SharedOffers"
>;

type SharedScreenProps = RouteProp<WalletTabsParamsList, "Shared">;

export const sourceTabs: Choice[] = [
  { label: "Offers", value: "offers" },
  { label: "Events", value: "events" }
];

const SharedController: FC<Props> = () => {
  const navigation = useNavigation<HomeNavigationProps>();
  const route = useRoute<SharedScreenProps>();

  const onTabChanged = useCallback(
    (tab: Choice) => {
      navigation.navigate(
        tab.value === "offers" ? "SharedOffers" : "SharedEvents"
      );
    },
    [navigation]
  );

  return (
    <Screen style={styles.container} shouldAddBottomInset={false}>
      <View>
        <SegmentedControl
          onChange={onTabChanged}
          values={sourceTabs}
          selectedIndex={route?.params?.selectedSegmentIndex ?? 0}
        />
      </View>

      <SharedTabRoutes />
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default SharedController;
