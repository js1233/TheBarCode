import CartIcon from "assets/images/cart_white.svg";
import Pin from "assets/images/pin.svg";
import { COLORS, FONT_SIZE, SPACE } from "config";
import ESearchType from "models/enums/ESearchType";
import { isBarOperatesToday, Venue } from "models/Venue";
import React, { FC } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import Favorite from "ui/components/molecules/favorite/Favorite";
import { openGoogleMap } from "utils/Util";
import VenueVideoImage, {
  Preference
} from "../venue_video_image/VenueVideoImage";

type Props = {
  venue: Venue;
  onPress: (updatedItem: Venue) => void;
  selectedItem?: (id: number) => void;
  type?: ESearchType;
};

const ItemVenue: FC<Props> = ({
  venue,
  onPress,
  selectedItem,
  type = ESearchType.VENUE
}) => {
  return (
    <TouchableOpacity
      style={[styles.container]}
      onPress={() => onPress(venue)}
      key={venue.id}>
      <View style={[styles.venueImage]}>
        <VenueVideoImage
          video={venue.video}
          images={venue.images}
          preference={Preference.IMAGE}
          containerStyle={
            venue.is_oapa
              ? { ...styles.image, borderColor: "#fed11e", borderWidth: 4 }
              : styles.image
          }
        />

        <View style={styles.absoluteWrapper}>
          {venue.is_oapa && (
            <View
              style={[
                styles.oapa,
                {
                  marginRight:
                    venue.is_payment_app && isBarOperatesToday(venue)
                      ? 10
                      : 0
                }
              ]}>
              <Image
                source={require("assets/images/ic_oapa.png")}
                resizeMode="contain"
                style={{ width: 33, height: 35 }}
              />
            </View>
          )}

          {venue.is_payment_app && isBarOperatesToday(venue) && (
            <View>
              <CartIcon />
            </View>
          )}
        </View>

        <View style={[styles.venueStatus]}>
          <AppLabel
            text={isBarOperatesToday(venue) ? "OPEN" : "CLOSED"}
            style={[
              isBarOperatesToday(venue)
                ? { color: COLORS.theme?.primaryColor }
                : { color: COLORS.red },
              styles.veneuStatusFont
            ]}
          />
        </View>
      </View>
      <View style={[styles.venueDetailsContainer]}>
        <View style={[styles.titleContainer]}>
          <AppLabel
            style={[styles.venueTitle]}
            text={venue.title}
            textType={TEXT_TYPE.BOLD}
          />
          <Pressable
            onPress={() => {
              openGoogleMap(
                venue?.latitude!,
                venue?.longitude!,
                venue?.title!
              );
            }}>
            <View
              style={{
                justifyContent: "space-between"
              }}>
              <View style={[styles.distanceContainer]}>
                <Pin style={styles.pinIcon} />
                <AppLabel
                  style={[styles.distanceText]}
                  text={`${
                    venue.distance === 0 ? "0" : venue.distance.toFixed(2)
                  } ${venue.distance === 1 ? "mile" : "miles"} away`}
                />
              </View>
            </View>
          </Pressable>
        </View>
        {type === ESearchType.VENUE && (
          <View style={[styles.favContainer]}>
            <Favorite
              item={venue!}
              selectedItem={selectedItem}
              onFavourite={(isFav) => {
                venue.is_user_favourite = isFav;
                const updatedVenue = { ...venue };
                updatedVenue.is_user_favourite = isFav;
                venue = updatedVenue;
              }}
              size={25}
            />
          </View>
        )}

        {type === ESearchType.OFFER && (
          <AppLabel
            text={venue.deals + " deal available"}
            style={[styles.dealMilesTitle]}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ItemVenue;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACE.xl,
    marginBottom: SPACE.lg
  },
  venueImage: {},
  venueTitle: {
    fontSize: FONT_SIZE.sm
  },
  image: {
    height: 200,
    width: "100%",
    borderRadius: 10,
    alignSelf: "center"
  },
  venueDetailsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginTop: 10
  },
  titleContainer: {
    justifyContent: "flex-start"
  },
  favContainer: {
    alignItems: "center",
    marginTop: 2
  },
  distanceContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  pinIcon: {
    marginTop: 2,
    marginRight: SPACE._2xs
  },
  distanceText: {
    color: COLORS.theme?.primaryColor
  },
  absoluteWrapper: {
    flexDirection: "row",
    position: "absolute",
    right: 0,
    flex: 1,
    marginTop: 10,
    marginRight: SPACE._2md
  },
  oapa: {
    borderRadius: 37 / 2,
    width: 37,
    height: 37,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF"
  },
  venueStatus: {
    position: "absolute",
    borderRadius: 20,
    backgroundColor: COLORS.white,
    bottom: 0,
    marginLeft: SPACE._2md,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 2,
    paddingHorizontal: SPACE.xs
  },
  veneuStatusFont: {
    fontSize: FONT_SIZE._3xs
  },
  dealMilesTitle: {
    fontSize: FONT_SIZE._2xs
  }
});
