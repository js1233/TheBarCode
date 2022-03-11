import NoRecordFound from "assets/images/tbc.svg";
import { COLORS, FONT_SIZE, SPACE, STRINGS } from "config";
import { usePreferredTheme } from "hooks";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  FlatListProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle
} from "react-native";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import { LoadMore } from "ui/components/atoms/app_load_more/LoadMore";
import ErrorWithRetryView from "ui/components/molecules/ErrorWithRetryView";

export interface FlatListWithPbProps<ItemT> extends FlatListProps<ItemT> {
  shouldShowProgressBar?: boolean;
  error?: string;
  errorView?: (errorText: string) => React.ReactElement | null;
  retryCallback?: () => void;
  pullToRefreshCallback?: (onComplete: () => void) => void;
  style?: StyleProp<ViewStyle>;
  ItemSeparatorHeaderAndFooterComponent?: React.ComponentType<any> | null;
  isAllDataLoaded?: boolean;
  noRecordFoundText?: string;
  listRef?: React.RefObject<FlatList>;
  noRecordFoundImage?: React.ReactElement | null;
  noRecordFoundStyle?: StyleProp<ViewStyle>;
}

type Props<ItemT> = FlatListWithPbProps<ItemT>;

export function FlatListWithPb<ItemT extends any>(props: Props<ItemT>) {
  const {
    style,
    shouldShowProgressBar,
    error,
    errorView,
    retryCallback,
    pullToRefreshCallback,
    ItemSeparatorHeaderAndFooterComponent,
    isAllDataLoaded = true,
    noRecordFoundText = STRINGS.common.no_record_found,
    onEndReached,
    listRef,
    noRecordFoundImage,
    noRecordFoundStyle,
    ...rest
  } = props;

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

  const { data } = rest;

  function dataHasRecords() {
    return (data?.length ?? 0) > 0;
  }

  const footerWrapper = React.memo<Props<any>>(() => {
    return (
      <>
        {!isAllDataLoaded && dataHasRecords() && (
          <View style={styles.loadMore}>
            <LoadMore testID="loader" />
          </View>
        )}
        {ItemSeparatorHeaderAndFooterComponent}
      </>
    );
  });

  function getNormalView() {
    if (shouldShowError()) {
      return getErrorView();
    }

    if (!shouldShowError()) {
      let ui = (
        <FlatList
          // initialNumToRender={7}
          ref={listRef}
          onEndReachedThreshold={1}
          refreshing={refreshing}
          onRefresh={
            pullToRefreshCallback === undefined ? undefined : onRefresh
          }
          onEndReached={
            isAllDataLoaded || !dataHasRecords() ? undefined : onEndReached
          }
          ItemSeparatorComponent={ItemSeparatorHeaderAndFooterComponent}
          ListHeaderComponent={ItemSeparatorHeaderAndFooterComponent}
          ListFooterComponent={footerWrapper}
          {...rest}
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

  return (
    <View style={style}>
      {shouldShowProgressBar && data === undefined && (
        <ActivityIndicator
          testID="initial-loader"
          size="large"
          color={theme.themedColors.interface["900"]}
          style={[
            styles.initialPb,
            { backgroundColor: COLORS.theme?.interface[50] }
          ]}
        />
      )}

      {!(shouldShowProgressBar && data === undefined) && getNormalView()}
    </View>
  );
}

const styles = StyleSheet.create({
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
