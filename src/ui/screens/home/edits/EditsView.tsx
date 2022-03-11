import { useNavigation } from "@react-navigation/native";
import { SPACE } from "config";
import Colors from "config/Colors";
import { Offer } from "models/Offer";
import React, { FC, useCallback, useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { Button } from "react-native-elements/dist/buttons/Button";
import { AppLabel } from "ui/components/atoms/app_label/AppLabel";
import Screen from "ui/components/atoms/Screen";
import FiveADayOfferDialog from "ui/components/organisms/app_dialogs/FiveADayOfferDialog";
import ItemOffer from "ui/components/organisms/view_pager/snap_items/ItemOffer";
import { ViewPager } from "ui/components/organisms/view_pager/ViewPager";
import { AppLog, TAG } from "utils/Util";
import { EditsNavigation } from "./EditsController";

type Props = {
  data: Offer[] | undefined;
  shouldShowProgressBar: boolean;
  saveBookmark: (
    offerId: number,
    isFavourite: boolean,
    callBack: () => void
  ) => void;
  onOfferSnapChanged?: (index: number) => void;
  openGoogleMap?: (lat: number, lng: number, title: string) => void;
  shouldShowBookmarkedPb: boolean;
};

export const EditsView: FC<Props> = ({
  data,
  shouldShowProgressBar,
  saveBookmark,
  onOfferSnapChanged,
  openGoogleMap,
  shouldShowBookmarkedPb
}) => {
  const [shouldShowPopUp, setShouldShowPopup] = useState<boolean>(false);
  const [offerShowInPopup, setShouldShowOfferShowInPopup] =
    useState<Offer>();
  const hideSelf = useCallback(() => {
    setShouldShowPopup(false);
  }, []);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [autoPlay, setAutoPlay] = useState<boolean>(false);
  const navigation = useNavigation<EditsNavigation>();

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
            }}
            shouldShowBookmarkFeature={false}
            buttonPressedCallback={(pressed) => {
              AppLog.log(
                () => "buttonPressedCallback()=> " + pressed,
                TAG.REDEEM
              );
              setAutoPlay(pressed);
            }}
          />
        </>
      );
    },
    [saveBookmark, openGoogleMap, shouldShowBookmarkedPb]
  );

  return (
    <Screen style={styles.container} shouldAddBottomInset={false}>
      <>
        <AppLabel
          text="click me
        "
          onPress={() => navigation.navigate("Invite")}
        />
        {!shouldShowProgressBar && (
          <ViewPager
            snapView={snapItem}
            data={data}
            autoPlayDelay={1500}
            callBack={onOfferSnapChanged}
            itemWidthRatio={0.7}
            maxIndicators={3}
            containerStyle={styles.viewPagerContainer}
            shouldEnableScroll={shouldShowPopUp || autoPlay ? false : true}
          />
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
          openGoogleMap={(lat, lng, title) =>
            openGoogleMap?.(lat, lng, title)
          }
          buttonPressedCallback={(pressed) => {
            AppLog.log(
              () => "buttonPressedCallback()=> " + pressed,
              TAG.REDEEM
            );
            setAutoPlay(pressed);
          }}
        />
      </>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: SPACE.md
  },
  viewPagerContainer: {
    alignItems: "center",
    justifyContent: "center"
  }
});
