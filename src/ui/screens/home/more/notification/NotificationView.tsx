import React, { FC, useCallback } from "react";
import Screen from "ui/components/atoms/Screen";
import { FlatListWithPb } from "ui/components/organisms/flat_list/FlatListWithPb";
import { StyleSheet } from "react-native";
import Notification from "models/Notification";
import { ItemNotification } from "ui/components/organisms/item_notification/ItemNotification";
import { SPACE } from "config";

type Props = {
  data: Notification[];
  shouldShowProgressBar: boolean;
  isAllDataLoaded: boolean;
  onEndReached: () => void;
  onPullToRefresh: (onComplete: () => void) => void;
  navigateToScreen: (notification: Notification) => void;
};

export const NotificationView: FC<Props> = ({
  data,
  shouldShowProgressBar,
  isAllDataLoaded,
  onEndReached,
  onPullToRefresh,
  navigateToScreen
}) => {
  const listItem = useCallback(
    ({ item }: { item: Notification }) => {
      return (
        <ItemNotification
          notification={item}
          navigateToScreen={navigateToScreen}
        />
      );
    },
    [navigateToScreen]
  );

  return (
    <Screen style={styles.container} requiresSafeArea={false}>
      <FlatListWithPb
        data={data}
        isAllDataLoaded={isAllDataLoaded}
        shouldShowProgressBar={shouldShowProgressBar}
        onEndReached={onEndReached}
        pullToRefreshCallback={onPullToRefresh}
        renderItem={listItem}
        contentContainerStyle={{ paddingVertical: SPACE.md }}
        style={styles.container}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1
  },
  list: { flex: 1 }
});
