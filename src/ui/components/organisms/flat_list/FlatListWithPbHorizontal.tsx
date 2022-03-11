import { COLORS, FONT_SIZE, SPACE, STRINGS } from "config";
import { usePreferredTheme } from "hooks";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  FlatListProps,
  Image,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle
} from "react-native";
import ErrorWithRetryView from "ui/components/molecules/ErrorWithRetryView";
import { shadowStyleProps } from "utils/Util";
import { AppLabel } from "ui/components/atoms/app_label/AppLabel";

interface OwnProps<ItemT> extends FlatListProps<ItemT> {
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
  noRecordFoundImage?: React.ReactElement;
  noRecordFoundStyle?: StyleProp<ViewStyle>;
}

type Props<ItemT> = OwnProps<ItemT>;

export function FlatListWithPbHorizontal<ItemT extends any>(
  props: Props<ItemT>
) {
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

  const { themedColors } = usePreferredTheme();
  const [refreshing, setRefreshing] = useState(false);
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
            <ActivityIndicator
              size={30}
              color={themedColors.primaryColor}
            />
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
          horizontal={true}
        />
      );

      if (!dataHasRecords()) {
        //No record found text visibility issue
        return (
          <>
            <View style={[styles.noRecordParent, noRecordFoundStyle]}>
              {noRecordFoundImage ? noRecordFoundImage : null}
              <AppLabel text={noRecordFoundText} />
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
        <View style={styles.loaderContainer}>
          <Image
            testID="initial-loader"
            source={require("assets/images/sample.gif")}
            style={{ width: 20, height: 20 }}
          />
        </View>
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
    alignItems: "center"
  },
  noRecordParent: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: SPACE.lg
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
    height: SPACE._3xl,
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center"
  },
  loaderContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
    width: 30,
    height: 30,
    borderRadius: 20,
    ...shadowStyleProps
  }
});
