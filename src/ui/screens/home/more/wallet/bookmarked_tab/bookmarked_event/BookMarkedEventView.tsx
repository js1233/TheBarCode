import { Links, Offer } from "models/Offer";
import React, { FC, useCallback, useRef, useState } from "react";
import { AppLog, listContentContainerStyle, TAG } from "utils/Util";
import Screen from "ui/components/atoms/Screen";
import { FlatListWithPb } from "ui/components/organisms/flat_list/FlatListWithPb";
import { SPACE } from "config";
import { Linking, StyleSheet } from "react-native";
import { ItemEvent } from "ui/components/organisms/item_event/ItemEvent";
import { useAppSelector } from "hooks/redux";
import { RootState } from "stores/store";
import EventLinksDialog from "ui/components/organisms/app_dialogs/EventLinksDialog";

type Props = {
  offer: Offer[];
  shouldShowProgressBar: boolean;
  onEndReached: () => void;
  pullToRefreshCallback: (onComplete: () => void) => void;
  isAllDataLoaded: boolean;
};

export const BookMarkedEventsView: FC<Props> = ({
  offer,
  shouldShowProgressBar,
  onEndReached,
  pullToRefreshCallback,
  isAllDataLoaded
}) => {
  const { user } = useAppSelector((state: RootState) => state.auth);
  const [shouldShowPopUp, setShouldShowPopup] = useState<boolean>(false);
  let _offer = useRef<Links[]>();
  const hideSelf = useCallback(() => {
    setShouldShowPopup(false);
  }, []);
  const renderItem = useCallback(
    ({ item }: { item: Offer }) => {
      return (
        <ItemEvent
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
    },
    [user]
  );

  AppLog.log(() => "SharedEvents: " + JSON.stringify(offer), TAG.VENUE);

  return (
    <Screen
      style={styles.container}
      // requiresSafeArea={false}
      shouldAddBottomInset={false}>
      <FlatListWithPb
        data={offer}
        renderItem={renderItem}
        shouldShowProgressBar={shouldShowProgressBar}
        style={[styles.container]}
        isAllDataLoaded={isAllDataLoaded}
        onEndReached={onEndReached}
        pullToRefreshCallback={pullToRefreshCallback}
        // ItemSeparatorComponent={() => (
        //   <View style={styles.itemSeparator} />
        // )}
        contentContainerStyle={[
          listContentContainerStyle,
          { paddingHorizontal: SPACE._2md }
        ]}
        keyExtractor={(item) => item.id.toString()}
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
    flex: 1
  }
});
