import { COLORS, SPACE } from "config";
import React, { FC, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import {
  AppImageBackground,
  CONTAINER_TYPES
} from "ui/components/atoms/image_background/AppImageBackground";
import ShareIcon from "assets/images/share.svg";
import Bookmark from "assets/images/bookmark.svg";
import { useCreateDynamicLink } from "ui/screens/home/invite/useCreateDynamicLink";
import { Offer } from "models/Offer";

export enum BOOKMARK_TYPE {
  VENUE_EVENT = "venue_event",
  VENUE_OFFER = "venue_offer"
}

type Props = {
  item: Offer;
  bookmarkType?: BOOKMARK_TYPE;
  onBookmarked?: (item: Offer, callback: () => void) => void;
  bookmarkedPb?: boolean;
  linkToBeDynamic: string;
  linkDomainUriPrefix: string;
  shouldShowBookmarkFeature?: boolean;
  customShareLinkMessage: string;
};

export const ImageWithShareBookmarked: FC<Props> = ({
  item,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  bookmarkType,
  onBookmarked,
  bookmarkedPb,
  linkToBeDynamic,
  linkDomainUriPrefix,
  shouldShowBookmarkFeature = true,
  customShareLinkMessage
}) => {
  const [favourite, setFavourite] = useState(item.is_user_favourite!);
  const { buildLink } = useCreateDynamicLink(
    linkDomainUriPrefix,
    customShareLinkMessage,
    true,
    false,
    linkToBeDynamic
  );

  return (
    <View style={{ width: "100%", height: 250 }}>
      <Image
        source={{ uri: item.image_url ?? item.image }}
        style={styles.image}
        resizeMode={"cover"}
      />
      <View style={styles.iconsContainer}>
        <TouchableOpacity onPress={buildLink}>
          <AppImageBackground
            containerShape={CONTAINER_TYPES.CIRCLE}
            icon={() => <ShareIcon />}
          />
        </TouchableOpacity>
        {!bookmarkedPb && shouldShowBookmarkFeature && (
          <TouchableOpacity
            onPress={() => {
              item.is_user_favourite = !favourite;
              onBookmarked?.(item, () => {
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
        {bookmarkedPb && shouldShowBookmarkFeature && (
          <View style={[styles.shareIcon, styles.bookmarkedPbContainer]}>
            <ActivityIndicator size={"small"} />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
    borderRadius: 15
  },
  iconsContainer: {
    position: "absolute",
    right: SPACE.lg,
    top: SPACE.lg
  },
  shareIcon: {
    marginTop: SPACE.lg
  },
  container: { flex: 1 },
  bookmarkedPbContainer: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.theme?.interface["50"],
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center"
  }
});
