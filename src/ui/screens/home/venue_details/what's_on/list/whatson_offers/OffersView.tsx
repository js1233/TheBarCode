import { SPACE } from "config";
import Colors from "config/Colors";
import useSendAnalytics from "hooks/useSendAnalytics";
import { Offer } from "models/Offer";
import React, { FC, useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import Screen from "ui/components/atoms/Screen";
import FiveADayOfferDialog from "ui/components/organisms/app_dialogs/FiveADayOfferDialog";
import ItemOffer from "ui/components/organisms/view_pager/snap_items/ItemOffer";
import { ViewPager } from "ui/components/organisms/view_pager/ViewPager";
import { AppLog, TAG } from "utils/Util";

type Props = {
  data: Offer[] | undefined;
  saveBookmark: (
    offerId: number,
    isFavourite: boolean,
    callBack: () => void
  ) => void;
  onOfferSnapChanged?: (index: number) => void;
  openGoogleMap?: (lat: number, lng: number, title: string) => void;
  shouldShowBookmarkedPb: boolean;
  isLoading: boolean;
  redirectToBogoBundle: (offer: Offer) => void;
  // onEndReached: () => void;
  // pullToRefreshCallback: (onComplete: () => void) => void;
  // isAllDataLoaded: boolean;
};

export const OffersView: FC<Props> = ({
  data,
  saveBookmark,
  onOfferSnapChanged,
  openGoogleMap,
  shouldShowBookmarkedPb,
  isLoading,
  redirectToBogoBundle
  // onEndReached,
  // pullToRefreshCallback
}) => {
  const [shouldShowPopUp, setShouldShowPopup] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [firstItem, setFirstItem] = useState<number>(0);
  const [offerShowInPopup, setShouldShowOfferShowInPopup] =
    useState<Offer>();
  const hideSelf = useCallback(() => {
    setShouldShowPopup(false);
  }, []);
  const [autoPlay, setAutoPlay] = useState<boolean>(false);
  const { sendAnalytics } = useSendAnalytics();
  useEffect(() => {
    setFirstItem(data?.length! - 4);
  }, [data]);

  const snapItem = useCallback(
    ({ item }: { item: Offer }) => {
      return (
        <>
          <ItemOffer
            offer={item}
            onClickedOnBookmark={saveBookmark}
            openGoogleMap={(lat, lng, title) =>
              openGoogleMap?.(lat, lng, title)
            }
            shouldShowBookmarkedPb={shouldShowBookmarkedPb}
            openFiveADayDialog={(offer) => {
              setShouldShowOfferShowInPopup(offer);
              setShouldShowPopup(true);
              sendAnalytics("offer_view", offer.id.toString()!);
            }}
            shouldShowBookmarkFeature={true}
            isOpenFromTrendingScreen={false}
            imageStyle={{ height: 150 }}
            buttonPressedCallback={(pressed) => {
              AppLog.log(
                () => "buttonPressedCallback()=> " + pressed,
                TAG.REDEEM
              );

              setAutoPlay(pressed);
            }}
            isChalkboard={item.offer_type_id === 4}
            redirectToBogoBundle={redirectToBogoBundle}
          />
        </>
      );
    },
    [
      saveBookmark,
      shouldShowBookmarkedPb,
      redirectToBogoBundle,
      openGoogleMap,
      sendAnalytics
    ]
  );

  return (
    // <ScrollView horizontal={false}>
    <Screen style={styles.container} shouldAddBottomInset={false}>
      <>
        {!isLoading && (
          <ViewPager
            snapView={snapItem}
            data={data}
            autoPlayDelay={2000}
            callBack={onOfferSnapChanged}
            itemWidthRatio={0.7}
            containerStyle={[
              styles.viewPagerContainer,
              data?.length! > 0 ? { marginTop: SPACE.lg } : null
            ]}
            paginationContainerStyle={styles.pagination}
            shouldEnableScroll={shouldShowPopUp || autoPlay ? false : true}
            // onEndReached={onEndReached}
            shouldLoop={false}
            maxIndicators={3}
            customStyle={{ paddingVertical: 0 }}
            // onPullToRefresh={pullToRefreshCallback}
            // firstSelectedItem={firstItem}
          />
        )}
        {isLoading && (
          <ActivityIndicator
            size={"large"}
            color={Colors.colors.theme?.primaryColor}
            style={styles.container}
          />
        )}

        {shouldShowPopUp && (
          <FiveADayOfferDialog
            isVisible={shouldShowPopUp}
            hideSelf={hideSelf}
            offer={offerShowInPopup!}
            isChalkboard={offerShowInPopup?.offer_type_id === 4}
            redirectToBogoBundle={() => {
              hideSelf();
              redirectToBogoBundle?.(offerShowInPopup!);
            }}
            openGoogleMap={(lat, lng, title) =>
              openGoogleMap?.(lat, lng, title)
            }
          />
        )}
      </>
    </Screen>
    // </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  pagination: {},
  viewPagerContainer: {
    alignItems: "center",
    justifyContent: "center"
  }
});
