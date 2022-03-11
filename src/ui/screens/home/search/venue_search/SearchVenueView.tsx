import { COLORS, FONT_SIZE, SPACE } from "config";
import { Venue } from "models/Venue";
import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import Screen from "ui/components/atoms/Screen";
import { FlatListWithPb } from "ui/components/organisms/flat_list/FlatListWithPb";
import ItemVenue from "ui/components/organisms/item_venue/ItemVenue";
import { listContentContainerStyle } from "utils/Util";
import ESearchType from "models/enums/ESearchType";

type Props = {
  data: Venue[] | undefined;
  shouldShowProgressBar: boolean;
  onEndReached: () => void;
  pullToRefreshCallback: (onComplete: () => void) => void;
  isAllDataLoaded: boolean;
  type: ESearchType;
  onItemClicked: (venue: Venue) => void;
};

const SearchVenueView: React.FC<Props> = ({
  data,
  shouldShowProgressBar,
  onEndReached,
  pullToRefreshCallback,
  isAllDataLoaded,
  type,
  onItemClicked
}: Props) => {
  const renderItem = useCallback(
    ({ item }: { item: Venue }) => {
      return (
        <ItemVenue
          venue={item}
          onPress={() => onItemClicked(item)}
          type={type}
        />
      );
    },
    [type, onItemClicked]
  );

  return (
    <Screen style={[styles.container]} shouldAddBottomInset={false}>
      {/* <View style={[styles.spacerHorizontal]} /> */}
      <FlatListWithPb
        data={data}
        renderItem={renderItem}
        shouldShowProgressBar={shouldShowProgressBar}
        style={[styles.container]}
        isAllDataLoaded={isAllDataLoaded}
        onEndReached={onEndReached}
        pullToRefreshCallback={pullToRefreshCallback}
        ItemSeparatorComponent={() => (
          <View style={styles.itemSeparator} />
        )}
        contentContainerStyle={[
          listContentContainerStyle,
          {
            paddingTop: SPACE.lg,
            paddingBottom: SPACE.lg
          }
        ]}
        keyExtractor={(item) => item.id.toString()}
      />
    </Screen>
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
  alignCenter: {
    alignSelf: "center"
  },
  formContainer: {
    marginHorizontal: SPACE.lg,
    marginBottom: SPACE.lg
  },
  keyboardAvoidingView: {
    flex: 1
  },
  textFieldStyle: {
    borderWidth: 1
  },
  signInButtonText: {
    fontSize: FONT_SIZE.lg
  },
  scrollViewContent: {
    flexGrow: 1,
    flexDirection: "column"
  },
  nextField: { marginTop: SPACE.lg },
  signInContainer: { marginTop: SPACE._3xl },
  logo: { alignSelf: "center", marginVertical: 60 },
  itemSeparator: {
    // height: SPACE.lg
  },
  headerViewContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.theme?.interface[100],
    width: "100%",
    height: 45,
    alignItems: "center",
    justifyContent: "space-between"
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
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "center",
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
    backgroundColor: COLORS.theme?.interface[300],
    marginHorizontal: 5
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

export default SearchVenueView;
