import Calendar from "assets/images/calendar.svg";
import Down from "assets/images/chevron-down.svg";
import Up from "assets/images/chevron-up.svg";
import Clock from "assets/images/clock.svg";
import Facebook from "assets/images/facebook.svg";
import Pin from "assets/images/pin.svg";
import Truck from "assets/images/truck.svg";
import Twitter from "assets/images/twitter.svg";
import Cart from "assets/images/cart_white.svg";

import { COLORS, FONT_SIZE, SPACE, STRINGS } from "config";
import {
  DeliveryTiming,
  EstablishmentTimings,
  getDeliveryTimingText,
  getDisplayTiming,
  isBarOpen,
  Venue
} from "models/Venue";
import React from "react";
import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import { HeadingWithText } from "ui/components/atoms/heading_with_text/HeadingWithText";
import {
  AppImageBackground,
  CONTAINER_TYPES
} from "ui/components/atoms/image_background/AppImageBackground";
import { LinkButton } from "ui/components/atoms/link_button/LinkButton";
import Screen from "ui/components/atoms/Screen";
import Separator from "ui/components/atoms/separator/Separator";
import Accordion from "ui/components/molecules/accordion/Accordion";
import DistanceText from "ui/components/molecules/distance_text/DistanceText";
import Favorite from "ui/components/molecules/favorite/Favorite";
import ItemVenueTiming from "ui/components/organisms/item_venue_timing/ItemVenueTiming";
import VenueVideoImage from "ui/components/organisms/venue_video_image/VenueVideoImage";
import { openGoogleMap, openLinks, shadowStyleProps } from "utils/Util";

type Props = {
  venue: Venue | undefined;
};

function AboutView({ venue }: Props) {
  const openingTimings = () => (
    <View style={styles.weekEstablishmentTiming}>
      {venue?.week_establishment_timings.map(
        (value: EstablishmentTimings) => (
          <ItemVenueTiming
            day={value.day}
            time={getDisplayTiming(value)}
            isCurrent={value.day === venue.establishment_timings.day}
          />
        )
      )}
    </View>
  );

  const deliveryTimings = () => {
    return venue?.is_full_day_delivery ? (
      <AppLabel
        text={STRINGS.venue_details.info.label_24_hours}
        style={styles.weekEstablishmentTiming}
      />
    ) : (
      <View style={styles.weekEstablishmentTiming}>
        {venue?.delivery_timings.map((value: DeliveryTiming) => (
          <ItemVenueTiming
            day={value.day}
            time={getDeliveryTimingText(value)}
            isCurrent={value.day === venue.establishment_timings.day}
          />
        ))}
      </View>
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const openGoogleMapDirections = (venue: Venue) => {
    openGoogleMap(venue?.latitude!, venue?.longitude!, venue?.title!);
  };

  return (
    <Screen style={styles.container} shouldAddBottomInset={false}>
      <ScrollView nestedScrollEnabled={true}>
        <VenueVideoImage
          containerStyle={styles.imageVideo}
          video={venue?.video}
          images={venue?.images}
          addVerticalSpace={false}
        />
        {venue?.is_payment_app && (
          <AppImageBackground
            containerStyle={styles.cartContainer}
            containerShape={CONTAINER_TYPES.CIRCLE}
            icon={() => <Cart height={30} width={30} />}
          />
        )}
        <View style={styles.textsContainer}>
          <View style={styles.titleFavoriteContainer}>
            <AppLabel
              style={styles.title}
              text={venue?.title}
              textType={TEXT_TYPE.SEMI_BOLD}
            />
            <Favorite item={venue} size={24} />
          </View>
          <Pressable onPress={() => openGoogleMapDirections(venue!)}>
            <DistanceText
              distance={venue?.distance}
              containerStyle={styles.distanceText}
            />
          </Pressable>
          <View style={styles.detailsContainer}>
            <View style={styles.sectionContainer}>
              <View style={styles.labelContainer}>
                <AppLabel
                  style={styles.label}
                  text={STRINGS.venue_details.info.label_venue_info}
                  textType={TEXT_TYPE.SEMI_BOLD}
                />
                {venue?.reservation_url && (
                  <LinkButton
                    text={STRINGS.venue_details.info.action_reserve_table}
                    textStyle={styles.linkButtonText}
                    textType={TEXT_TYPE.SEMI_BOLD}
                    rightIcon={() => (
                      <Calendar
                        width={16}
                        height={16}
                        stroke={COLORS.theme?.primaryShade["700"]}
                      />
                    )}
                    onPress={() => {
                      Linking.openURL(venue?.reservation_url!);
                    }}
                  />
                )}
              </View>
              <AppLabel
                style={styles.description}
                text={venue?.description}
                numberOfLines={0}
              />
            </View>
            <Separator thickness={1} color={COLORS.white} />
            <View style={styles.sectionContainer}>
              <View style={styles.labelContainer}>
                <AppLabel
                  style={styles.label}
                  text={
                    isBarOpen(venue?.establishment_timings)
                      ? STRINGS.venue_details.info.label_open
                      : STRINGS.venue_details.info.label_close
                  }
                  textType={TEXT_TYPE.SEMI_BOLD}
                />
                <LinkButton
                  text={getDisplayTiming(venue?.establishment_timings)}
                  textStyle={styles.linkButtonText}
                  textType={TEXT_TYPE.SEMI_BOLD}
                  rightIcon={() => (
                    <Clock
                      width={16}
                      height={16}
                      stroke={COLORS.theme?.primaryShade["700"]}
                    />
                  )}
                />
              </View>
              <Accordion
                header={(isExpanded) => (
                  <LinkButton
                    textStyle={styles.timingsTitle}
                    text={STRINGS.venue_details.info.label_opening_timings}
                    rightIcon={() => {
                      return isExpanded ? (
                        <Up
                          width={12}
                          height={12}
                          fill={COLORS.theme?.primaryShade["700"]}
                        />
                      ) : (
                        <Down
                          width={12}
                          height={12}
                          fill={COLORS.theme?.primaryShade["700"]}
                        />
                      );
                    }}
                  />
                )}
                expandableItem={openingTimings}
              />
            </View>
            {venue?.delivery && (
              <>
                <Separator thickness={1} color={COLORS.white} />
                <View style={styles.sectionContainer}>
                  <View style={styles.labelContainer}>
                    <AppLabel
                      style={styles.label}
                      text={STRINGS.venue_details.info.label_delivery}
                      textType={TEXT_TYPE.SEMI_BOLD}
                    />
                    <LinkButton
                      text={
                        venue.is_delivery_disable
                          ? STRINGS.venue_details.info
                              .label_temporary_closed
                          : STRINGS.venue_details.info.label_available
                      }
                      textStyle={styles.linkButtonText}
                      textType={TEXT_TYPE.SEMI_BOLD}
                      rightIcon={() => (
                        <Truck
                          width={16}
                          height={16}
                          stroke={COLORS.theme?.primaryShade["700"]}
                        />
                      )}
                    />
                  </View>
                  <Accordion
                    header={(isExpanded) => (
                      <LinkButton
                        textStyle={styles.timingsTitle}
                        text={
                          STRINGS.venue_details.info.label_delivery_timings
                        }
                        rightIcon={() => {
                          return isExpanded ? (
                            <Up
                              width={12}
                              height={12}
                              fill={COLORS.theme?.primaryShade["700"]}
                            />
                          ) : (
                            <Down
                              width={12}
                              height={12}
                              fill={COLORS.theme?.primaryShade["700"]}
                            />
                          );
                        }}
                      />
                    )}
                    expandableItem={deliveryTimings}
                  />
                </View>
                {venue.delivery_condition && (
                  <>
                    <Separator thickness={1} color={COLORS.white} />
                    <View style={styles.sectionContainer}>
                      <HeadingWithText
                        headingStyle={styles.label}
                        headingText={
                          STRINGS.venue_details.info
                            .label_delivery_conditions
                        }
                        textStyle={styles.bodyText}
                        text={venue.delivery_condition}
                      />
                    </View>
                  </>
                )}
              </>
            )}
            <Separator thickness={1} color={COLORS.white} />
            <View style={styles.sectionContainer}>
              <View style={styles.labelContainer}>
                <AppLabel
                  style={styles.label}
                  text={
                    STRINGS.venue_details.info.label_contact_information
                  }
                  textType={TEXT_TYPE.SEMI_BOLD}
                />
                <LinkButton
                  text={
                    STRINGS.venue_details.info
                      .action_get_driving_directions
                  }
                  textStyle={styles.linkButtonText}
                  textType={TEXT_TYPE.SEMI_BOLD}
                  rightIcon={() => (
                    <Pin
                      width={16}
                      height={16}
                      stroke={COLORS.theme?.primaryShade["700"]}
                    />
                  )}
                  onPress={() => openGoogleMapDirections(venue!)}
                />
              </View>
              {venue?.website !== "" && venue?.website !== null && (
                <Pressable
                  onPress={() => Linking.openURL(venue?.website!)}>
                  <HeadingWithText
                    containerStyle={styles.contactInfoContainer}
                    headingStyle={styles.contactInfoLabel}
                    headingTextType={TEXT_TYPE.NORMAL}
                    headingText={STRINGS.venue_details.info.label_website}
                    textStyle={styles.contactInfoText}
                    text={venue?.website}
                  />
                </Pressable>
              )}
              {venue?.contact_number !== "" && (
                <Pressable
                  onPress={() =>
                    Linking.openURL(`tel:${venue?.contact_number}`)
                  }>
                  <HeadingWithText
                    containerStyle={styles.contactInfoContainer}
                    headingStyle={styles.contactInfoLabel}
                    headingTextType={TEXT_TYPE.NORMAL}
                    headingText={STRINGS.venue_details.info.label_phone}
                    textStyle={styles.contactInfoText}
                    text={venue?.contact_number}
                  />
                </Pressable>
              )}
              {venue?.contact_email !== "" && (
                <Pressable
                  onPress={() =>
                    Linking.openURL(
                      `mailto:${venue?.contact_email}?subject=sendmail&body=details`
                    )
                  }>
                  <HeadingWithText
                    containerStyle={styles.contactInfoContainer}
                    headingStyle={styles.contactInfoLabel}
                    headingTextType={TEXT_TYPE.NORMAL}
                    headingText={STRINGS.venue_details.info.label_email}
                    textStyle={styles.contactInfoText}
                    text={venue?.contact_email}
                  />
                </Pressable>
              )}
              {venue?.address !== null && (
                <HeadingWithText
                  containerStyle={styles.contactInfoContainer}
                  headingStyle={styles.contactInfoLabel}
                  headingTextType={TEXT_TYPE.NORMAL}
                  headingText={STRINGS.venue_details.info.label_address}
                  textStyle={styles.addressText}
                  text={venue?.address}
                />
              )}
            </View>
          </View>
          <View style={styles.socialMediaContainer}>
            {venue?.facebook_page_url && (
              <AppImageBackground
                icon={() => <Facebook width={12} height={26} />}
                containerShape={CONTAINER_TYPES.CIRCLE}
                containerStyle={[
                  styles.socialMediaImageContainer,
                  { backgroundColor: COLORS.facebook }
                ]}
                onPress={() => openLinks(venue.facebook_page_url!)}
              />
            )}
            {venue?.twitter_profile_url && (
              <AppImageBackground
                icon={() => <Twitter width={18} height={15} />}
                containerShape={CONTAINER_TYPES.CIRCLE}
                containerStyle={[
                  styles.socialMediaImageContainer,
                  { backgroundColor: COLORS.twitter }
                ]}
                onPress={() => openLinks(venue.twitter_profile_url!)}
              />
            )}
            {venue?.instagram_profile_url && (
              <Pressable
                onPress={() => openLinks(venue.instagram_profile_url!)}>
                <Image
                  source={require("assets/images/ic_instagram.webp")}
                  style={styles.socialMediaImageContainer}
                />
              </Pressable>
            )}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  imageVideo: {
    alignSelf: "stretch",
    backgroundColor: COLORS.theme?.primaryShade["50"],
    height: 177
    // borderBottomEndRadius: 8,
    // borderBottomStartRadius: 8
  },
  cartContainer: {
    backgroundColor: COLORS.white,
    position: "absolute",
    top: SPACE.lg,
    end: SPACE.lg,
    width: 36,
    height: 36,
    ...shadowStyleProps
  },
  textsContainer: {
    margin: SPACE.lg
  },
  titleFavoriteContainer: {
    flexDirection: "row",
    alignContent: "center"
  },
  title: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.theme?.interface["900"],
    flex: 1
  },
  distanceText: { marginTop: SPACE._2xs },
  detailsContainer: {
    backgroundColor: COLORS.theme?.secondaryBackground,
    borderRadius: 8,
    marginVertical: SPACE.lg
  },
  sectionContainer: {
    padding: SPACE.md
  },
  labelContainer: { flexDirection: "row", alignItems: "center" },
  label: {
    fontSize: FONT_SIZE._3xs,
    color: COLORS.theme?.interface["700"],
    flexGrow: 1,
    textTransform: "uppercase"
  },
  linkButtonText: {
    fontSize: FONT_SIZE._3xs,
    color: COLORS.theme?.primaryShade["700"]
  },
  description: {
    fontSize: FONT_SIZE._3xs,
    color: COLORS.theme?.interface["900"],
    marginTop: SPACE.sm
  },
  timingsTitle: {
    fontSize: FONT_SIZE._2xs,
    color: COLORS.theme?.interface["900"]
  },
  weekEstablishmentTiming: {
    marginTop: SPACE.sm
  },
  bodyText: {
    fontSize: FONT_SIZE._3xs,
    color: COLORS.theme?.interface["900"],
    marginTop: SPACE.sm
  },
  contactInfoContainer: {
    flexDirection: "row",
    marginTop: SPACE.sm
  },
  contactInfoLabel: {
    width: "33%",
    color: COLORS.theme?.interface["500"],
    fontSize: FONT_SIZE._2xs
  },
  contactInfoText: {
    flexGrow: 1,
    color: COLORS.theme?.primaryShade["700"],
    fontSize: FONT_SIZE._2xs,
    flex: 1
  },
  addressText: {
    flexGrow: 1,
    color: COLORS.theme?.interface["900"],
    fontSize: FONT_SIZE._2xs,
    flex: 1
  },
  socialMediaContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: SPACE._2lg
  },
  socialMediaImageContainer: {
    width: 44,
    height: 44,
    marginHorizontal: 10
  }
});

export default AboutView;
