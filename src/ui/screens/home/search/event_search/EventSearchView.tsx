import { SPACE } from "config";
import { useAppSelector } from "hooks/redux";
import { Links, Offer } from "models/Offer";
import React, { useCallback, useRef, useState } from "react";
import { Linking, StyleSheet, View } from "react-native";
import { RootState } from "stores/store";
import Screen from "ui/components/atoms/Screen";
import EventLinksDialog from "ui/components/organisms/app_dialogs/EventLinksDialog";
import { FlatListWithPb } from "ui/components/organisms/flat_list/FlatListWithPb";
import { ItemEvent } from "ui/components/organisms/item_event/ItemEvent";
import { listContentContainerStyle } from "utils/Util";

type Props = {
  isLoading: boolean;
  onEndReached: () => void;
  pullToRefreshCallback: (onComplete: () => void) => void;
  isAllDataLoaded: boolean;
  data: Offer[];
  onBookmarked: (item: Offer, callback: () => void) => void;
  bookmarkedPb: boolean;
  onItemClicked: (offer: Offer) => void;
};

const EventSearchView: React.FC<Props> = ({
  isLoading,
  onEndReached,
  pullToRefreshCallback,
  isAllDataLoaded,
  data,
  onBookmarked,
  bookmarkedPb,
  onItemClicked
}: Props) => {
  const [shouldShowPopUp, setShouldShowPopup] = useState<boolean>(false);
  let _offer = useRef<Links[]>();
  const { user } = useAppSelector((state: RootState) => state.auth);

  const hideSelf = useCallback(() => {
    setShouldShowPopup(false);
  }, []);
  const renderItem = ({ item }: { item: Offer }) => {
    return (
      <ItemEvent
        onItemClicked={() => onItemClicked(item)}
        bookmarkedPb={bookmarkedPb}
        onBookmarked={onBookmarked}
        item={item}
        onButtonClicked={() => {
          if (item.links.length > 1) {
            _offer.current = item.links!;
            setShouldShowPopup(true);
          } else {
            Linking.openURL(item.links[0].link);
          }
        }}
        linkDomainUriPrefix={`https://thebarcode.page.link`}
        linkToBeDynamic={
          "?shared_by=" +
          user?.id +
          "&event_id=" +
          item.id +
          "&referral=" +
          user?.own_referral_code +
          "&shared_by_name=" +
          user?.full_name.split(" ").join("_")
        }
      />
    );
  };

  return (
    <Screen style={styles.container} shouldAddBottomInset={false}>
      <FlatListWithPb<Offer>
        data={data}
        renderItem={renderItem}
        shouldShowProgressBar={isLoading}
        onEndReached={onEndReached}
        pullToRefreshCallback={pullToRefreshCallback}
        isAllDataLoaded={isAllDataLoaded}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={[
          listContentContainerStyle,
          { paddingHorizontal: SPACE.lg },
          { paddingVertical: SPACE._2xl }
        ]}
        style={styles.container}
        ItemSeparatorComponent={() => (
          <View style={styles.itemSeparator} />
        )}
      />
      <EventLinksDialog
        isVisible={shouldShowPopUp}
        hideSelf={hideSelf}
        data={_offer.current!}
      />
    </Screen>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1
  },
  itemSeparator: {
    padding: SPACE.sm
  }
});

export default EventSearchView;
