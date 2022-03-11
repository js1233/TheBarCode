import { Offer } from "models/Offer";
import React, { FC, useCallback, useState } from "react";
import Screen from "ui/components/atoms/Screen";
import { ActivityIndicator, StyleSheet } from "react-native";
import { AppLog, TAG } from "utils/Util";
import ItemOffer from "ui/components/organisms/view_pager/snap_items/ItemOffer";
import { ViewPager } from "ui/components/organisms/view_pager/ViewPager";
import Colors from "config/Colors";
import FiveADayOfferDialog from "ui/components/organisms/app_dialogs/FiveADayOfferDialog";
import { SPACE } from "config";

type Props = {
  offer: Offer[];
  shouldShowProgressBar: boolean;
  sharedOfferMarkedPb: boolean;
  setSharedOfferMark: (
    offerId: number,
    isFavourite: boolean,
    callBack: () => void
  ) => void;
};

export const SharedOffersView: FC<Props> = ({
  offer,
  shouldShowProgressBar,
  sharedOfferMarkedPb,
  setSharedOfferMark
}) => {
  const [shouldShowPopUp, setShouldShowPopup] = useState<boolean>(false);
  const [offerShowInPopup, setShouldShowOfferShowInPopup] =
    useState<Offer>();
  const hideSelf = useCallback(() => {
    setShouldShowPopup(false);
  }, []);
  const renderItem = useCallback(
    ({ item }: { item: Offer }) => {
      return (
        <ItemOffer
          offer={item}
          shouldShowBookmarkedPb={sharedOfferMarkedPb}
          onClickedOnBookmark={setSharedOfferMark}
          openFiveADayDialog={(offe) => {
            setShouldShowOfferShowInPopup(offe);
            setShouldShowPopup(true);
          }}
          imageStyle={{ height: 150 }}
        />
      );
    },
    [sharedOfferMarkedPb, setSharedOfferMark]
  );

  AppLog.log(() => "SharedOffers: " + JSON.stringify(offer), TAG.VENUE);

  return (
    <Screen style={styles.container} shouldAddBottomInset={false}>
      <>
        {!shouldShowProgressBar && (
          <>
            <ViewPager
              snapView={renderItem}
              data={offer}
              autoPlayDelay={1500}
              //callBack={onOfferSnapChanged}
              itemWidthRatio={0.7}
              containerStyle={[
                styles.viewPagerContainer,
                offer?.length! > 0 ? { marginTop: SPACE.lg } : null
              ]}
              paginationContainerStyle={styles.pagination}
              shouldEnableScroll={!shouldShowPopUp}
              customStyle={{ paddingVertical: 0 }}
            />
          </>
        )}
        {shouldShowProgressBar && (
          <ActivityIndicator
            size={"large"}
            color={Colors.colors.theme?.primaryColor}
            style={styles.container}
          />
        )}
        <FiveADayOfferDialog
          isVisible={shouldShowPopUp}
          hideSelf={hideSelf}
          offer={offerShowInPopup!}
        />
      </>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  pagination: {
    alignItems: "center"
  },
  viewPagerContainer: {}
});
