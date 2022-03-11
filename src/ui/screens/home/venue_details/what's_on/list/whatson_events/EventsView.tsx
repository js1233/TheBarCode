import { SPACE } from "config";
import { useAppSelector } from "hooks/redux";
import useSendAnalytics from "hooks/useSendAnalytics";
import { Offer } from "models/Offer";
import React, { FC, useCallback, useRef, useState } from "react";
import { Linking, ScrollView, StyleSheet, View } from "react-native";
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
};

export const EventsView: FC<Props> = ({
  isLoading,
  onEndReached,
  pullToRefreshCallback,
  isAllDataLoaded,
  data,
  onBookmarked,
  bookmarkedPb
}) => {
  const [shouldShowPopUp, setShouldShowPopup] = useState<boolean>(false);
  let _offer = useRef<Offer>();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { sendAnalytics } = useSendAnalytics();
  const hideSelf = useCallback(() => {
    setShouldShowPopup(false);
  }, []);

  const renderItem = ({ item }: { item: Offer }) => {
    _offer.current = item;
    return (
      <ItemEvent
        bookmarkedPb={bookmarkedPb}
        onBookmarked={onBookmarked}
        item={item}
        onButtonClicked={() => {
          if (item.links.length > 1) {
            setShouldShowPopup(true);
            sendAnalytics("event_view", item.id.toString()!);
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
      <ScrollView horizontal={true} contentContainerStyle={{ flex: 1 }}>
        <FlatListWithPb<Offer>
          nestedScrollEnabled={true}
          data={data}
          renderItem={renderItem}
          shouldShowProgressBar={isLoading}
          onEndReached={onEndReached}
          pullToRefreshCallback={pullToRefreshCallback}
          isAllDataLoaded={isAllDataLoaded}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={[
            listContentContainerStyle,
            { paddingHorizontal: SPACE.lg }
          ]}
          style={styles.container}
          ItemSeparatorComponent={() => (
            <View style={styles.itemSeparator} />
          )}
        />
        <EventLinksDialog
          isVisible={shouldShowPopUp}
          hideSelf={hideSelf}
          data={_offer.current?.links!}
        />
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1
  },
  itemSeparator: {
    padding: SPACE.lg
  }
});
