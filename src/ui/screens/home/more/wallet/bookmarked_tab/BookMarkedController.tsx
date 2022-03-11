import React, { FC, useCallback } from "react";
import {
  Choice,
  SegmentedControl
} from "ui/components/molecules/segmented_control/SegmentedControl";
import { StyleSheet, View } from "react-native";
import { sourceTabs } from "ui/screens/home/more/wallet/shared/SharedController";
import { StackNavigationProp } from "@react-navigation/stack";
import { BookMarkedTabParamsList } from "ui/screens/home/more/wallet/bookmarked_tab/BookmarkedTabBar";
import { useNavigation } from "@react-navigation/native";
import { BookMarkedTabRoutes } from "ui/screens/home/more/wallet/bookmarked_tab/BookMarkedTabBarRoutes";

type Props = {};

type HomeNavigationProps = StackNavigationProp<
  BookMarkedTabParamsList,
  "BookMarkedOffers"
>;

const BookMarkedController: FC<Props> = () => {
  const navigation = useNavigation<HomeNavigationProps>();
  const onTabChanged = useCallback(
    (tab: Choice) => {
      navigation.navigate(
        tab.value === "offers" ? "BookMarkedOffers" : "BookMarkedEvents"
      );
    },
    [navigation]
  );

  return (
    <View style={styles.container}>
      <View>
        <SegmentedControl onChange={onTabChanged} values={sourceTabs} />
      </View>
      <BookMarkedTabRoutes />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default BookMarkedController;
