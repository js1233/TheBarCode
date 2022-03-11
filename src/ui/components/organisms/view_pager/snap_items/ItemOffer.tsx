/* eslint-disable @typescript-eslint/no-unused-vars */
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Bookmark from "assets/images/bookmark.svg";
import Pin from "assets/images/pin.svg";
import ShareIcon from "assets/images/share.svg";
import { COLORS, FONT_SIZE, SPACE } from "config";
import Colors from "config/Colors";
import Strings from "config/Strings";
import { usePreferredTheme } from "hooks";
import { useAppSelector } from "hooks/redux";
import EPosType from "models/enums/EPosType";
import { Offer } from "models/Offer";
import { isBarOperatesToday } from "models/Venue";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageStyle,
  Pressable,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import HTMLView from "react-native-htmlview";
import SimpleToast from "react-native-simple-toast";
import { HomeStackParamList } from "routes/HomeStack";
import { RootState } from "stores/store";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import {
  AppImageBackground,
  CONTAINER_TYPES
} from "ui/components/atoms/image_background/AppImageBackground";
import { AppButton } from "ui/components/molecules/app_button/AppButton";
import { useCreateDynamicLink } from "ui/screens/home/invite/useCreateDynamicLink";
import {
  AppLog,
  parameterizedString,
  Price,
  shadowStyleProps,
  TAG
} from "utils/Util";
import RedeemDealButton from "../../button_redeem_deal/RedeemDealButton";

export type homeNavigationProp = StackNavigationProp<
  HomeStackParamList,
  "Home"
>;

type Props = {
  offer: Offer;
  buttonTitle?: string;
  onClickedOnBookmark?: (
    offerId: number,
    isFavourite: boolean,
    callBack: () => void
  ) => void;
  openGoogleMap?: (lat: number, lng: number, title: string) => void;
  shouldShowBookmarkedPb: boolean;
  openFiveADayDialog: (offer: Offer) => void;
  shouldShowBookmarkFeature?: boolean;
  isOpenFromTrendingScreen?: boolean;
  imageStyle?: StyleProp<ImageStyle>;
  buttonPressedCallback?: (pressed: boolean) => void;
  isChalkboard: boolean;
  redirectToBogoBundle: (offer: Offer) => void;
};

export const getMilesAwayText = (offer: Offer) => {
  if (offer?.establishments?.distance === 1) {
    return Strings.edits.mile_away;
  } else {
    return Strings.edits.miles_away;
  }
};

const ItemOffer = React.memo<Props>(
  ({
    offer,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    buttonTitle = Strings.edits.avail_offer,
    onClickedOnBookmark,
    openGoogleMap,
    shouldShowBookmarkedPb,
    openFiveADayDialog,
    shouldShowBookmarkFeature = true,
    isOpenFromTrendingScreen = true,
    imageStyle,
    buttonPressedCallback,
    isChalkboard,
    redirectToBogoBundle
  }) => {
    const NUM_OF_LINES = isOpenFromTrendingScreen ? 3 : 2;
    const [shouldShowCounter, setShouldShowCounter] = useState(false);
    const theme = usePreferredTheme();
    const [favourite, setFavourite] = useState(offer.is_user_favourite!);
    const { user } = useAppSelector((state: RootState) => state.auth);
    const navigation = useNavigation<homeNavigationProp>();

    const customMessage = parameterizedString(
      Strings.edits.share_message,
      user!.full_name
    );
    // let userName = user?.full_name.split(" ").join("_");
    const { buildLink } = useCreateDynamicLink(
      `https://barcodeoffer.page.link`,
      customMessage,
      true,
      false,
      "?shared_by=" +
        user?.id +
        "&offer_id=" +
        offer.id +
        "&referral=" +
        user!.own_referral_code +
        "&shared_by_name=" +
        user?.full_name.split(" ").join("_")
    );

    const decsription = offer.description
      ?.replace(/<\/?[^>]+(>|$)/g, "")
      .replace(/&nbsp;/gi, " ");

    return (
      <View
        style={[
          styles.container,
          isOpenFromTrendingScreen
            ? null
            : {
                // height: "99.5%"
              }
        ]}
        key={offer.id}>
        <Image
          source={{ uri: offer.image_url }}
          style={[styles.image, imageStyle]}
          resizeMode={"cover"}
        />
        <View style={styles.iconsContainer}>
          <TouchableOpacity onPress={buildLink}>
            <AppImageBackground
              containerShape={CONTAINER_TYPES.CIRCLE}
              icon={() => <ShareIcon />}
            />
          </TouchableOpacity>
          {!shouldShowBookmarkedPb && shouldShowBookmarkFeature && (
            <TouchableOpacity
              onPress={() => {
                onClickedOnBookmark?.(offer.id, favourite, () => {
                  setFavourite(!favourite);
                });
              }}>
              <AppImageBackground
                containerShape={CONTAINER_TYPES.CIRCLE}
                icon={() => (
                  <Bookmark
                    stroke={
                      favourite
                        ? COLORS.theme?.primaryColor
                        : COLORS.theme?.interface["500"]
                    }
                  />
                )}
                containerStyle={[
                  styles.shareIcon,
                  favourite
                    ? {
                        backgroundColor: COLORS.theme?.primaryShade["100"]
                      }
                    : { backgroundColor: COLORS.theme?.interface["50"] }
                ]}
              />
            </TouchableOpacity>
          )}
          {shouldShowBookmarkedPb && (
            <View style={[styles.shareIcon, styles.bookmarkedPbContainer]}>
              <ActivityIndicator size={"small"} />
            </View>
          )}
        </View>
        <AppLabel
          text={offer.sub_title}
          style={[
            styles.title,
            { color: theme.themedColors.primaryColor }
          ]}
          textType={TEXT_TYPE.BOLD}
        />
        <AppLabel
          text={offer.title}
          style={styles.subTitle}
          textType={TEXT_TYPE.BOLD}
        />
        <Pressable
          onPress={() => openFiveADayDialog(offer)}
          style={styles.decsriptionViewMoreContainer}>
          {/* <AppLabel
            text={decsription}
            style={styles.longDesc}
            numberOfLines={2}
          /> */}
          <HTMLView
            value={`<p>${offer.description}</p>`}
            stylesheet={styleDesc}
          />
          <AppLabel
            text={decsription?.length! > 100 ? "View More" : ""}
            style={styles.viewMore}
          />
        </Pressable>

        <AppLabel
          text={offer.establishments?.title}
          style={[styles.shortDesc]}
          textType={TEXT_TYPE.BOLD}
          onPress={() =>
            openGoogleMap?.(
              offer.establishments!.latitude,
              offer.establishments!.longitude,
              offer.establishments!.title
            )
          }
        />
        <TouchableOpacity
          onPress={() =>
            openGoogleMap?.(
              offer.establishments!.latitude,
              offer.establishments!.longitude,
              offer.establishments!.title
            )
          }>
          <View style={styles.locationContainer}>
            <Pin style={styles.pinIcon} />
            <AppLabel
              text={
                offer.establishments!.distance.toFixed(2).toString() +
                getMilesAwayText(offer)
              }
              style={[
                styles.location,
                { color: theme.themedColors.primaryColor }
              ]}
            />
          </View>
        </TouchableOpacity>

        <View
          style={{
            paddingHorizontal: SPACE.lg,
            marginTop: SPACE.lg
          }}>
          {!isChalkboard ? (
            <RedeemDealButton
              offer={offer}
              venue={offer.establishments}
              navigation={navigation}
              buttonPressedCallback={buttonPressedCallback}
            />
          ) : (
            <>
              {offer?.is_menu_associated &&
                offer?.establishments?.epos_name === EPosType.BARCODE && (
                  <AppButton
                    shouldShowProgressBar={false}
                    text={Strings.venue_details.menu.addToCart}
                    onPress={() => {
                      if (
                        offer.establishments?.is_payment_app &&
                        isBarOperatesToday(offer?.establishments!)
                      ) {
                        if (offer?.menu) {
                          redirectToBogoBundle(offer);
                        } else {
                          SimpleToast.show(
                            Strings.venue_details.whatson
                              .exclusive_offer_error
                          );
                        }
                      } else {
                        SimpleToast.show(
                          "In app-payment service are unavailable, please contact administration"
                        );
                      }
                    }}
                    textType={TEXT_TYPE.SEMI_BOLD}
                  />
                )}
            </>
          )}
        </View>
      </View>
    );
  }
);

const styleDesc = StyleSheet.create({
  p: {
    fontSize: FONT_SIZE._2xs,
    textAlign: "center",
    paddingLeft: SPACE.sm,
    paddingRight: SPACE.sm
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 15,
    marginBottom: 3,
    paddingBottom: SPACE.xl,
    marginHorizontal: SPACE.md,
    ...shadowStyleProps,
    elevation: 2
  },
  title: {
    alignSelf: "center",
    fontSize: FONT_SIZE._3xs,
    paddingTop: SPACE.sm
  },
  subTitle: {
    alignSelf: "center",
    fontSize: FONT_SIZE.sm,
    color: Colors.colors.black,
    paddingBottom: SPACE.sm
  },
  longDesc: {
    alignSelf: "center",
    fontSize: FONT_SIZE._2xs,
    paddingRight: SPACE._2xl,
    paddingLeft: SPACE._2xl,
    justifyContent: "center",
    textAlign: "center",
    //paddingTop: SPACE.sm,
    flexWrap: "wrap"
  },
  shortDesc: {
    alignSelf: "center",
    fontSize: FONT_SIZE._2xs
    //paddingTop: SPACE.xl
  },
  location: {
    alignSelf: "center",
    fontSize: FONT_SIZE._3xs,
    paddingLeft: SPACE._2xs
    //paddingTop: SPACE.sm
  },
  image: {
    width: "100%",
    height: 200,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15
  },
  shareIcon: {
    marginTop: SPACE.lg
  },
  iconsContainer: {
    position: "absolute",
    right: SPACE.lg,
    top: SPACE.lg
  },
  startButton: {
    marginTop: SPACE.lg
  },
  counterButtonContainer: {
    //marginTop: SPACE.lg,
    backgroundColor: COLORS.theme?.primaryColor,
    height: 44,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    paddingRight: SPACE.lg,
    paddingLeft: SPACE.lg,
    flexDirection: "row"
  },
  buttonContainer: {
    marginRight: SPACE.lg,
    marginLeft: SPACE.lg
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
    // marginTop: SPACE.xs
  },
  pinIcon: {
    //marginTop: SPACE.xs
  },
  bookmarkedPbContainer: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.theme?.interface["50"],
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  viewMore: {
    alignSelf: "center",
    color: COLORS.theme?.primaryColor,
    fontSize: FONT_SIZE._3xs
  },
  decsriptionViewMoreContainer: {
    flex: 1,
    marginBottom: SPACE.md
  },
  timerText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.white
  }
});

export default ItemOffer;
