import React, { FC } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import Pin from "assets/images/pin.svg";
import { COLORS, FONT_SIZE, SPACE } from "config";
import { Offer } from "models/Offer";
import BookMark from "assets/images/bookmark.svg";
import {
  convertMilisecondsToSeconds,
  parameterizedString
} from "utils/Util";
import { getStartInMillis } from "models/DateTime";
import Timer from "ui/components/organisms/reload_banner/Timer";
import { ImageWithShareBookmarked } from "../image_share_bookmark/ImageWithShareBookmarked";
import { useAppSelector } from "hooks/redux";
import { RootState } from "stores/store";
import Strings from "config/Strings";

type Props = {
  offer: Offer;
  onPress: () => void;
  isBookmakOffer?: boolean;
};

const ItemShareOffer: FC<Props> = ({ offer, isBookmakOffer, onPress }) => {
  const { user } = useAppSelector((state: RootState) => state.auth);
  const linkToBeDynamic =
    "?shared_by=" +
    user?.id +
    "&offer_id=" +
    offer?.id +
    "&referral=" +
    user!.own_referral_code +
    "&shared_by_name=" +
    user?.full_name.split(" ").join("_");
  const customMessageForSharedOffer = parameterizedString(
    Strings.edits.share_message,
    user!.full_name
  );
  return (
    <TouchableOpacity style={[styles.container]} onPress={onPress}>
      <ImageWithShareBookmarked
        item={offer}
        linkToBeDynamic={linkToBeDynamic}
        linkDomainUriPrefix={`https://barcodeoffer.page.link`}
        shouldShowBookmarkFeature={false}
        customShareLinkMessage={customMessageForSharedOffer}
      />
      <View style={[styles.venueDetailsContainer]}>
        <View style={[styles.titleContainer]}>
          <AppLabel
            style={[styles.venueTitle]}
            text={offer.title}
            textType={TEXT_TYPE.BOLD}
          />
        </View>
      </View>
      <View style={[styles.distanceContainer]}>
        {!isBookmakOffer ? (
          <View style={{ flexDirection: "row" }}>
            <Pin style={styles.pinIcon} />
            <AppLabel
              style={[styles.offerTitle]}
              text={offer.establishments!.title}
              textType={TEXT_TYPE.BOLD}
            />
          </View>
        ) : (
          <View style={{ flexDirection: "row" }}>
            <AppLabel
              text={"Starts in: "}
              style={{ fontSize: FONT_SIZE.xs }}
            />
            <Timer
              textStyle={styles.timerText}
              diffInSeconds={convertMilisecondsToSeconds(
                getStartInMillis(offer)
              )}
              isTicking={true}
            />
          </View>
        )}

        {!isBookmakOffer ? (
          <AppLabel
            style={[styles.distanceText]}
            text={`${
              offer!.establishments!.distance === 0
                ? "0"
                : offer!.establishments!.distance.toFixed(2)
            } ${
              offer!.establishments!.distance === 1 ? "mile" : "miles"
            } away`}
          />
        ) : (
          <BookMark fill={COLORS.theme?.primaryShade[700]} />
        )}
      </View>
      {!isBookmakOffer && (
        <View style={{ paddingHorizontal: SPACE.sm }}>
          <View style={{ flexDirection: "row" }}>
            <AppLabel text={"Offer type: "} />
            <AppLabel
              textType={TEXT_TYPE.SEMI_BOLD}
              text={offer.offer_type?.title}
              style={{ color: COLORS.theme?.primaryShade[700] }}
            />
          </View>
          <View style={{ flexDirection: "row" }}>
            <AppLabel text={"Shared by: "} />
            <AppLabel
              text={offer.offer_type?.title}
              textType={TEXT_TYPE.SEMI_BOLD}
              style={{ color: COLORS.theme?.primaryShade[700] }}
            />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ItemShareOffer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10
  },
  venueImage: {
    flex: 1
  },
  venueTitle: {
    fontSize: FONT_SIZE.sm
  },
  offerTitle: {
    fontSize: FONT_SIZE._2xs,
    color: COLORS.theme?.primaryShade[700]
  },
  image: {
    height: 180,
    width: "95%",
    borderRadius: 10,
    alignSelf: "center"
  },
  venueDetailsContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10
  },
  titleContainer: {
    marginHorizontal: 10
  },
  favContainer: {
    height: 70,
    alignItems: "center",
    marginHorizontal: 10
  },
  distanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACE.sm
  },
  pinIcon: {
    marginTop: 2,
    marginRight: SPACE._2xs
  },
  distanceText: {
    color: COLORS.theme?.primaryShade[700]
  },
  shareIcon: {
    position: "absolute",
    right: 0,
    padding: 6,
    marginRight: 20,
    borderRadius: 30,
    backgroundColor: COLORS.white,
    marginTop: 10
  },
  venueStatus: {
    height: 25,
    width: 70,
    position: "absolute",
    borderRadius: 20,
    backgroundColor: COLORS.white,
    bottom: 0,
    marginLeft: 20,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  veneuStatusFont: {
    fontSize: FONT_SIZE._3xs
  },
  timerText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.theme?.primaryShade[700]
  }
});
