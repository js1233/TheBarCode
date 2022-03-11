import { COLORS, FONT_SIZE, SPACE } from "config";
import { Offer } from "models/Offer";
import React, { FC } from "react";
import {
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import { AppButton } from "ui/components/molecules/app_button/AppButton";
import { ImageWithShareBookmarked } from "../image_share_bookmark/ImageWithShareBookmarked";
import Calendar from "assets/images/calendar.svg";
import Pin from "assets/images/pin.svg";
import { toDate } from "models/DateTime";
import { ReadMoreLessText } from "ui/components/molecules/read_more_text/ReadMoreLessText";
import { parameterizedString } from "utils/Util";
import Strings from "config/Strings";
import { useAppSelector } from "hooks/redux";
import { RootState } from "stores/store";

type Props = {
  item: Offer;
  onButtonClicked?: () => void;
  onBookmarked?: (item: Offer, callback: () => void) => void;
  bookmarkedPb?: boolean;
  linkToBeDynamic: string;
  linkDomainUriPrefix: string;
  onItemClicked?: () => void;
};
export const ItemEvent: FC<Props> = ({
  item,
  onButtonClicked,
  onBookmarked,
  bookmarkedPb,
  linkToBeDynamic,
  linkDomainUriPrefix,
  onItemClicked
}) => {
  const { user } = useAppSelector((state: RootState) => state.auth);
  const getFromToDateAndTime = () => {
    return (
      toDate(item.start_date_time!, "YYYY-MM-DD HH:mm:ss", "MMM DD") +
      ", " +
      toDate(item.start_time!, "h a", "h a") +
      " - " +
      toDate(item.end_time!, "h a", "h a")
    );
  };

  function shouldShowLinkButton() {
    if (item.links.length !== 0) {
      if (item.links.length > 1) {
        return false;
      } else {
        return true;
      }
    }
  }

  const customMessageForVenueEvent = parameterizedString(
    Strings.venue_details.whatson.event_share_message,
    user!.full_name
  );

  const jsxElement = (
    <View style={styles.container}>
      <ImageWithShareBookmarked
        item={item}
        onBookmarked={onBookmarked}
        bookmarkedPb={bookmarkedPb}
        linkToBeDynamic={linkToBeDynamic}
        linkDomainUriPrefix={linkDomainUriPrefix}
        customShareLinkMessage={customMessageForVenueEvent}
      />
      {item.is_date_show && (
        <View style={styles.dateTimeContainer}>
          <Calendar stroke={COLORS.theme?.primaryShade[700]} />
          <AppLabel
            text={getFromToDateAndTime()}
            style={styles.date}
            textType={TEXT_TYPE.SEMI_BOLD}
          />
        </View>
      )}
      <AppLabel
        text={item.name}
        style={styles.title}
        textType={TEXT_TYPE.BOLD}
      />
      {/* <AppLabel
        text={item.description}
        style={styles.description}
        numberOfLines={0}
      /> */}
      <ReadMoreLessText text={item.description!} targetLines={2} />
      <View style={styles.locationContainer}>
        <Pin />
        <AppLabel
          text={item.location}
          style={styles.location}
          numberOfLines={0}
        />
      </View>
      {shouldShowLinkButton() === true && (
        <AppButton
          text={item?.links[0]?.link_text!}
          buttonStyle={styles.button}
          textType={TEXT_TYPE.BOLD}
          onPress={onButtonClicked}
        />
      )}
      {shouldShowLinkButton() === false && (
        <Pressable onPress={onButtonClicked}>
          <AppLabel
            text={"View More Links"}
            style={styles.viewMore}
            textType={TEXT_TYPE.BOLD}
          />
        </Pressable>
      )}
    </View>
  );

  if (onItemClicked) {
    return (
      <TouchableOpacity activeOpacity={0.3} onPress={onItemClicked}>
        {jsxElement}
      </TouchableOpacity>
    );
  } else {
    return jsxElement;
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingBottom: SPACE.xl },
  title: {
    fontSize: FONT_SIZE.sm,
    paddingTop: SPACE.lg,
    color: COLORS.theme?.interface[900]
  },
  description: { fontSize: FONT_SIZE._2xs, paddingTop: SPACE.sm },
  location: {
    paddingLeft: SPACE._2xs,
    paddingRight: SPACE._2xs,
    fontSize: FONT_SIZE._3xs,
    color: COLORS.theme?.interface[700]
  },
  date: {
    textTransform: "uppercase",
    paddingLeft: SPACE._2xs,
    color: COLORS.theme?.primaryShade[700],
    fontSize: FONT_SIZE._3xs
  },
  button: { marginTop: SPACE.lg },
  dateTimeContainer: { flexDirection: "row", marginTop: SPACE.lg },
  locationContainer: { flexDirection: "row", marginTop: SPACE.sm },
  viewMore: {
    alignSelf: "center",
    color: COLORS.theme?.primaryColor,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACE._2md
  }
});
