import { FONT_SIZE, SPACE } from "config/Dimens";
import { usePreferredTheme } from "hooks";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import {
  ActivityIndicator,
  Pressable,
  SectionList,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle
} from "react-native";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import ErrorWithRetryView from "ui/components/molecules/ErrorWithRetryView";
import { AppLog, TAG } from "utils/Util";
import NoRecordFound from "assets/images/tbc.svg";
import { STRINGS } from "config";
import _ from "lodash";

export type BaseItem = {
  key: () => string;
};

export type Section<T extends BaseItem, U extends BaseItem> = {
  header: T;
  data: U[];
};

interface Props<ItemT extends BaseItem, ItemU extends BaseItem> {
  style?: StyleProp<ViewStyle>;
  list: Section<ItemT, ItemU>[] | undefined;
  selectedIndexProp?: { indexValue: number };
  headerView: (
    header: ItemT,
    isSelected: boolean,
    index: number,
    selectIndex?: number
  ) => React.ReactElement;
  bodyView: (
    bodyItem: ItemU,
    parentIndex: number,
    index: number
  ) => React.ReactElement;
  shouldShowProgressBar?: boolean;
  errorView?: (errorText: string) => React.ReactElement | null;
  retryCallback?: () => void;
  pullToRefreshCallback?: (onComplete: () => void) => void;
  noRecordFoundImage?: React.ReactElement;
  noRecordFoundStyle?: StyleProp<ViewStyle>;
  error?: string;
  noRecordFoundText?: string;
  shouldExpandOnlyOneSection?: boolean;
  stickyHeaderEnabled?: boolean;
  shouldEnableNestedScroll?: boolean;
}

const SectionedList = <ItemT extends BaseItem, ItemU extends BaseItem>({
  style,
  list,
  selectedIndexProp = { indexValue: 0 },
  headerView,
  bodyView,
  shouldShowProgressBar = false,
  noRecordFoundImage,
  noRecordFoundStyle,
  errorView,
  retryCallback,
  pullToRefreshCallback,
  error,
  noRecordFoundText = STRINGS.common.no_record_found,
  shouldExpandOnlyOneSection = true,
  stickyHeaderEnabled = true,
  shouldEnableNestedScroll = false
}: Props<ItemT, ItemU>) => {
  AppLog.log(() => "rendering SectionedList", TAG.VENUE);

  const [expandedSections, setExpandedSections] = useState<number[]>(
    shouldExpandOnlyOneSection ? [0] : []
  );
  const sectionList = useRef<SectionList<any, any> | null>(null);

  useEffect(() => {
    if (!shouldExpandOnlyOneSection) {
      AppLog.log(
        () =>
          `initialize expanded sections: ${JSON.stringify(
            expandedSections
          )}`,
        TAG.VENUE
      );

      setExpandedSections(() => {
        let newList: number[] = [];
        list?.forEach((element, index) => {
          newList.push(index);
        });
        return newList;
      });
    }
    //don't pass areSectionsExpanded in dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list]);

  useLayoutEffect(() => {
    AppLog.log(
      () => `scrolling to section ${selectedIndexProp} and item 0`,
      TAG.VENUE
    );
    sectionList.current?.scrollToLocation({
      sectionIndex: selectedIndexProp.indexValue,
      itemIndex: 0
    });
  }, [selectedIndexProp]);

  const bodyItemView = useCallback(
    ({
      index,
      item,
      section
    }: {
      index: number;
      item: ItemU;
      section: Section<ItemT, ItemU>;
    }) => {
      const parentPosition: number = list!.indexOf(section);

      AppLog.log(() => `rendering BodyView ${item.key()}`, TAG.VENUE);

      AppLog.log(
        () => `selectedIndex ${JSON.stringify(parentPosition)}`,
        TAG.VENUE
      );

      if (
        _.find(expandedSections, (e) => e === parentPosition) === undefined
      ) {
        return null;
      } else {
        return bodyView(item, parentPosition, index);
      }
    },
    [list, expandedSections, bodyView]
  );

  const sectionView = useCallback(
    ({ section }: { section: Section<ItemT, ItemU> }) => {
      const index = list!.indexOf(section);
      AppLog.log(
        () => `rendering HeaderView ${section.header.key()}`,
        TAG.VENUE
      );

      const onPress = () => {
        AppLog.log(
          () => `HeaderView ${section.header.key()} pressed`,
          TAG.VENUE
        );

        setExpandedSections(function (prev) {
          let findIndex = _.findIndex(prev, (e) => e === index);
          if (findIndex !== -1) {
            prev.splice(findIndex, 1);
          } else {
            if (!shouldExpandOnlyOneSection) {
              prev.push(index);
            } else {
              prev[0] = index;
            }
          }
          return _.cloneDeep(prev);
        });
      };

      return (
        <View style={styles.bodyItem}>
          <Pressable onPress={onPress}>
            {headerView(
              section.header,
              _.find(expandedSections, (e) => e === index) !== undefined,
              index
            )}
          </Pressable>
        </View>
      );
    },
    [list, headerView, expandedSections, shouldExpandOnlyOneSection]
  );

  //Add features like FlatListWithPb
  const [refreshing, setRefreshing] = useState(false);
  const theme = usePreferredTheme();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    pullToRefreshCallback?.(() => {
      setRefreshing(false);
    });
  }, [pullToRefreshCallback]);

  function shouldShowError() {
    return error !== undefined && !dataHasRecords();
  }

  function getErrorView() {
    if (error !== undefined && errorView !== undefined) {
      return errorView(error);
    } else {
      return (
        <ErrorWithRetryView
          text={error}
          retryCallback={retryCallback}
          style={styles.errorView}
        />
      );
    }
  }

  function dataHasRecords() {
    return (list?.length ?? 0) > 0;
  }

  function getNormalView() {
    if (shouldShowError()) {
      return getErrorView();
    }

    if (!shouldShowError()) {
      let ui = list && (
        <SectionList
          nestedScrollEnabled={shouldEnableNestedScroll}
          ref={sectionList}
          sections={list}
          renderItem={bodyItemView}
          renderSectionHeader={sectionView}
          renderSectionFooter={() => <View style={{ height: SPACE.lg }} />}
          keyExtractor={(item) => item.key()}
          contentContainerStyle={style}
          onScrollToIndexFailed={(info) => {
            AppLog.log(
              () => "Failed to scroll to " + info.index,
              TAG.VENUE
            );
          }}
          stickySectionHeadersEnabled={stickyHeaderEnabled}
          refreshing={refreshing}
          onRefresh={
            pullToRefreshCallback === undefined ? undefined : onRefresh
          }
        />
      );

      if (!dataHasRecords()) {
        //No record found text visibility issue
        return (
          <>
            <View style={[styles.noRecordParent, noRecordFoundStyle]}>
              {noRecordFoundImage ? (
                noRecordFoundImage
              ) : (
                <NoRecordFound
                  width={"70%"}
                  height={"15%"}
                  fill={theme.themedColors.primaryColor}
                />
              )}

              <AppLabel
                text={noRecordFoundText}
                numberOfLines={0}
                textType={TEXT_TYPE.SEMI_BOLD}
                style={styles.noRecordFoundText}
              />
            </View>
            {ui}
          </>
        );
      } else {
        return ui;
      }
    }
  }

  //Add features like flatListWithPb End

  // AppLog.log(
  //   () =>
  //     "Sectioned List #  shouldShowProgressBar = " + shouldShowProgressBar,
  //   TAG.API
  // );

  // AppLog.log(
  //   () => "Sectioned List #  list = " + JSON.stringify(list),
  //   TAG.API
  // );

  return (
    <View style={{ flex: 1 }}>
      {shouldShowProgressBar && list === undefined && (
        <ActivityIndicator
          testID="initial-loader"
          size="large"
          color={theme.themedColors.interface["900"]}
          style={[
            styles.initialPb,
            { backgroundColor: theme.themedColors.primaryBackground }
          ]}
        />
      )}

      {!(shouldShowProgressBar && list === undefined) && getNormalView()}
    </View>
  );
};

const styles = StyleSheet.create({
  bodyItem: {
    flexDirection: "column"
  },
  errorView: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: SPACE.lg
  },
  noRecordParent: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute"
  },
  noRecord: {
    textAlign: "center",
    fontSize: FONT_SIZE.lg
  },
  loadMorePb: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 16
  },
  initialPb: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  loadMore: {
    marginTop: SPACE.lg,
    height: SPACE._3xl,
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center"
  },
  noRecordFoundText: {
    fontSize: FONT_SIZE.lg,
    padding: SPACE.md,
    textAlign: "center"
  }
});

export default SectionedList;
