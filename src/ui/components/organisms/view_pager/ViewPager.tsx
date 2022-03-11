/* eslint-disable @typescript-eslint/no-unused-vars */
import { FONT_SIZE, SPACE, width } from "config/Dimens";
import { usePreferredTheme } from "hooks";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ListRenderItem,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle
} from "react-native";
import Carousel, {
  Pagination,
  startAutoPlay,
  endAutoPlay
} from "react-native-snap-carousel";
import AnimatedDotsCarousel from "react-native-animated-dots-carousel";
import { COLORS } from "config";
import { AppLog, TAG } from "utils/Util";
import NoRecordFound from "assets/images/tbc.svg";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import Strings from "config/Strings";

export interface SnapPaginationProps<T> {
  snapView: ListRenderItem<T>;
  data: T[] | undefined;
  autoPlayDelay?: number;
  callBack?: (index: number) => void;
  itemWidthRatio?: number;
  containerStyle?: StyleProp<ViewStyle>;
  paginationContainerStyle?: StyleProp<ViewStyle>;
  dotStyle?: StyleProp<ViewStyle>;
  sliderWidthDifference?: number;
  onEndReached?: () => void;
  shouldLoop?: boolean;
  onPullToRefresh?: (onComplete: () => void) => void;
  firstSelectedItem?: number;
  maxIndicators?: number;
  shouldEnableScroll?: boolean;
  customStyle?: StyleProp<ViewStyle>;
  shouldShowPagination?: boolean;
}

export function ViewPager<T extends any>({
  data = [],
  snapView,
  autoPlayDelay = 1500,
  callBack,
  itemWidthRatio = 0.7,
  containerStyle,
  paginationContainerStyle,
  dotStyle,
  sliderWidthDifference = 60,
  onEndReached,
  onPullToRefresh,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  firstSelectedItem = 0,
  maxIndicators = 5,
  shouldEnableScroll = true,
  customStyle,
  shouldShowPagination = true
}: SnapPaginationProps<T>) {
  const SLIDER_WIDTH = width + sliderWidthDifference;
  const ITEM_WIDTH = Math.round(SLIDER_WIDTH * itemWidthRatio);
  const [index, setIndex] = useState(0);
  const theme = usePreferredTheme();
  const [refreshing, setRefreshing] = useState(false);
  const carouselRef = useRef(null);

  useEffect(() => {
    if (shouldEnableScroll) {
      carouselRef?.current?.startAutoplay(true);
    } else {
      carouselRef?.current?.stopAutoplay();
    }
  }, [shouldEnableScroll]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    onPullToRefresh?.(() => {
      setRefreshing(false);
    });
  }, [onPullToRefresh]);
  useEffect(() => {
    AppLog.log(
      () => "shouldEnableScroll: " + shouldEnableScroll,
      TAG.EDITS
    );
  }, [shouldEnableScroll]);
  return (
    <View
      style={[
        styles.container,
        customStyle ? null : { paddingVertical: SPACE._2lg },
        containerStyle
      ]}>
      <View style={{ flex: 0.8, flexGrow: 1 }}>
        <Carousel
          ref={carouselRef}
          layout={"default"}
          data={data}
          renderItem={snapView}
          sliderWidth={SLIDER_WIDTH}
          itemWidth={ITEM_WIDTH}
          useScrollView={false}
          onSnapToItem={(itemIndex) => {
            setIndex(itemIndex);
            callBack?.(itemIndex);
          }}
          hasParallaxImages={true}
          scrollEnabled={shouldEnableScroll}
          autoplay={shouldEnableScroll}
          autoplayDelay={autoPlayDelay}
          lockScrollWhileSnapping={true}
          autoplayInterval={autoPlayDelay}
          loop={true}
          inactiveSlideOpacity={1}
          inactiveSlideScale={1}
          onEndReached={onEndReached}
          horizontal
          removeClippedSubviews={false}
          onRefresh={onPullToRefresh === undefined ? undefined : onRefresh}
          refreshing={refreshing}
          enableMomentum={false}
          // onStartShouldSetResponderCapture={() => {
          //   return shouldEnableScroll;
          // }}
          // onMoveShouldSetResponderCapture={() => {
          //   return shouldEnableScroll;
          // }}
          layoutCardOffset={20}
        />
      </View>
      {shouldShowPagination && data.length > 1 && (
        <View style={[styles.pagination, paginationContainerStyle]}>
          <AnimatedDotsCarousel
            length={data?.length}
            currentIndex={index}
            maxIndicators={maxIndicators}
            interpolateOpacityAndColor={true}
            activeIndicatorConfig={{
              color: COLORS.theme?.primaryColor!,
              margin: 5,
              opacity: 1,
              size: 10,
              enabledRadius: false
            }}
            inactiveIndicatorConfig={{
              color: COLORS.theme?.interface["400"],
              margin: 5,
              opacity: 1,
              size: 10,
              enabledRadius: false
            }}
            decreasingDots={[
              {
                config: {
                  color: COLORS.theme?.interface["400"],
                  margin: 5,
                  opacity: 1,
                  size: 8,
                  enabledRadius: false
                },
                quantity: 2
              },
              {
                config: {
                  color: COLORS.theme?.interface["400"],
                  margin: 5,
                  opacity: 1,
                  size: 6,
                  enabledRadius: false
                },
                quantity: 2
              }
            ]}
          />
        </View>
      )}
      {data.length === 0 && (
        <View style={styles.noRecordParent}>
          <NoRecordFound
            width={"70%"}
            height={"15%"}
            fill={theme.themedColors.primaryColor}
          />
          <AppLabel
            text={Strings.common.no_record_found}
            numberOfLines={0}
            textType={TEXT_TYPE.SEMI_BOLD}
            style={styles.noRecordFoundText}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
  dot: {
    width: 10,
    height: 10,
    marginHorizontal: -8
  },
  inActiveDot: {
    width: 15,
    height: 15
  },
  pagination: {
    paddingTop: SPACE._2lg,
    flex: 0.05,
    alignItems: "flex-end",
    flexDirection: "column",
    justifyContent: "flex-end"
  },
  noRecordParent: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    position: "absolute"
  },
  noRecordFoundText: {
    fontSize: FONT_SIZE.lg,
    padding: SPACE.md,
    textAlign: "center"
  }
});
