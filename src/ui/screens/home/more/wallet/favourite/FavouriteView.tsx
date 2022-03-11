import React, { FC, useCallback } from "react";
import Screen from "ui/components/atoms/Screen";
import { StyleSheet } from "react-native";
import { listContentContainerStyle } from "utils/Util";
import { SPACE } from "config";
import { FlatListWithPb } from "ui/components/organisms/flat_list/FlatListWithPb";
import { Venue } from "models/Venue";
import ItemVenue from "ui/components/organisms/item_venue/ItemVenue";

type Props = {
  data: Venue[] | undefined;
  shouldShowProgressBar: boolean;
  onEndReached: () => void;
  pullToRefreshCallback: (onComplete: () => void) => void;
  isAllDataLoaded: boolean;
  selectedItemCallBack: (id: number) => void;
  openVenueDetailsScreen: (venue: Venue) => void;
};

export const FavouriteView: FC<Props> = ({
  data,
  shouldShowProgressBar,
  onEndReached,
  pullToRefreshCallback,
  isAllDataLoaded,
  selectedItemCallBack,
  openVenueDetailsScreen
}) => {
  const renderItem = useCallback(
    ({ item }: { item: Venue }) => {
      return (
        <ItemVenue
          venue={item}
          selectedItem={selectedItemCallBack}
          onPress={() => openVenueDetailsScreen(item)}
        />
      );
    },
    [openVenueDetailsScreen, selectedItemCallBack]
  );

  return (
    <Screen style={styles.container} requiresSafeArea={false}>
      <FlatListWithPb
        data={data}
        renderItem={renderItem}
        shouldShowProgressBar={shouldShowProgressBar}
        style={[
          styles.container,
          data?.length === 0
            ? {
                paddingTop: SPACE._2lg,
                paddingBottom: SPACE._2lg
              }
            : null
        ]}
        isAllDataLoaded={isAllDataLoaded}
        onEndReached={onEndReached}
        pullToRefreshCallback={pullToRefreshCallback}
        contentContainerStyle={[
          listContentContainerStyle,
          { paddingHorizontal: SPACE._2md }
        ]}
        keyExtractor={(item) => item.id.toString()}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
