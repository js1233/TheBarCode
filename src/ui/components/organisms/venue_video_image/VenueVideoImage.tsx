import { COLORS, SPACE } from "config";
import { StoredFile } from "models/Venue";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle
} from "react-native";
import Video from "react-native-video";
import { AppLog, TAG } from "utils/Util";
import { ViewPager } from "../view_pager/ViewPager";
import SimpleToast from "react-native-simple-toast";
import { Dimensions } from "react-native";
import _ from "lodash";

export enum Preference {
  IMAGE,
  VIDEO
}

type Props = {
  containerStyle?: StyleProp<ViewStyle>;
  video?: StoredFile;
  images?: StoredFile[];
  preference?: Preference;
  addVerticalSpace?: boolean;
};

const VenueVideoImage = React.memo<Props>(
  ({
    containerStyle,
    video,
    images,
    preference = Preference.VIDEO,
    addVerticalSpace = true
  }) => {
    const [_preference, setPreference] = useState<Preference>(preference);
    const [isBuffering, setBuffering] = useState<boolean>(true);

    const window = Dimensions.get("window");

    const imageView = ({ item }: { item: StoredFile }) => (
      <Image
        source={
          item.url
            ? {
                uri: item.url.replace(
                  "http://127.0.0.1:8000/storage/establishment/orignal/",
                  "http://192.168.86.64:8000/storage/establishment/orignal/"
                )
              }
            : require("assets/images/tbc_logo_placeholder_large.webp")
        }
        style={{
          width:
            window.width - (addVerticalSpace ? SPACE.xl - SPACE.xl : 0),
          height: undefined,
          aspectRatio: 560 / 360
        }}
        onError={() =>
          require("assets/images/tbc_logo_placeholder_large.webp")
        }
      />
    );

    return (
      <View
        style={[
          styles.container,
          _preference === Preference.VIDEO && video
            ? containerStyle
            : _.omit(containerStyle, "height")
        ]}>
        {_preference === Preference.VIDEO && video && (
          <>
            <Video
              source={{ uri: video.url }}
              style={styles.video}
              repeat={true}
              resizeMode="cover"
              onBuffer={(onBuffer) => {
                setBuffering(onBuffer.isBuffering);
                AppLog.log(
                  () => `onBuffer(), isBuffering: ${onBuffer.isBuffering}`,
                  TAG.COMPONENT
                );
              }}
              onError={(error) => {
                AppLog.log(
                  () =>
                    `onError(), error: ${JSON.stringify(
                      error.error?.errorString
                    )}`,
                  TAG.COMPONENT
                );
                error.error?.errorString &&
                  SimpleToast.show(
                    error?.error?.errorString,
                    SimpleToast.SHORT
                  );
                setPreference(Preference.IMAGE);
              }}
            />
            {isBuffering && (
              <ActivityIndicator
                style={styles.bufferingIndicator}
                size={"large"}
                color={COLORS.theme?.primaryColor}
              />
            )}
          </>
        )}
        {(_preference === Preference.IMAGE || !video) && images && (
          <ViewPager<StoredFile>
            autoPlayDelay={3000}
            snapView={imageView}
            data={images}
            itemWidthRatio={1}
            containerStyle={styles.viewPagerContainer}
            paginationContainerStyle={styles.imagesIndicatorContainer}
          />
        )}
      </View>
    );
  }
);

export default VenueVideoImage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
    justifyContent: "center"
  },
  video: { flex: 1 },
  bufferingIndicator: { position: "absolute", alignSelf: "center" },
  viewPagerContainer: { flex: 1, paddingVertical: 0 },
  image: { width: "100%", height: undefined },
  imagesIndicatorContainer: {
    position: "absolute",
    alignSelf: "center",
    justifyContent: "center",
    bottom: SPACE.sm
  }
});
