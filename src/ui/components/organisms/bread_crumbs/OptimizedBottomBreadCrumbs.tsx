import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import usePreferredTheme from "hooks/theme/usePreferredTheme";
import { SPACE } from "config";
import OptimizedBottomBreadCrumbsItem from "./OptimizedBottomBreadCrumbsItem";
import { shadowStyleProps } from "utils/Util";
import { FlatListWithPbHorizontal } from "../flat_list/FlatListWithPbHorizontal";
import { TEXT_TYPE } from "ui/components/atoms/app_label/AppLabel";

export type OptimizedBBCItem<T> = {
  value: T;
};

type Props<T> = {
  data: OptimizedBBCItem<T>[];
  onPress?: (value?: T) => void;
  showProgressbar: boolean;
  onEndReached: () => void;
  isAllDataLoaded: boolean;
};

function OptimizedBottomBreadCrumbs<T>({
  data,
  onPress,
  showProgressbar,
  onEndReached,
  isAllDataLoaded
}: Props<T>) {
  const theme = usePreferredTheme();
  const [selectedPosition, setSelectedPosition] = useState(0);

  const renderItem = ({
    item,
    index
  }: {
    item: OptimizedBBCItem<T>;
    index: number;
  }) => {
    const backgroundColor = theme.themedColors.secondaryBackground;
    const textColor =
      index === selectedPosition
        ? theme.themedColors.primaryColor
        : theme.themedColors.secondaryBackground;
    const textType: TEXT_TYPE =
      index === selectedPosition ? TEXT_TYPE.BOLD : TEXT_TYPE.NORMAL;
    return (
      <OptimizedBottomBreadCrumbsItem
        title={item.name ?? item.userName}
        onPress={() => {
          setSelectedPosition(index);
          onPress?.(item);
        }}
        style={{ backgroundColor }}
        textStyle={{ color: textColor }}
        textType={textType}
      />
    );
  };

  useEffect(() => {
    if (data.length > 0 && selectedPosition === 0) {
      onPress?.(data[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: theme.themedColors.secondaryBackground
        }
      ]}>
      <FlatListWithPbHorizontal
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        shouldShowProgressBar={showProgressbar}
        style={styles.flatList}
        isAllDataLoaded={isAllDataLoaded}
        showsHorizontalScrollIndicator={false}
        onEndReached={onEndReached}
        ItemSeparatorComponent={() => (
          <View style={styles.itemSeparator} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    height: 50,
    justifyContent: "flex-start",
    borderWidth: StyleSheet.hairlineWidth
  },
  flatList: {
    flex: 1,
    paddingVertical: SPACE.sm,
    paddingStart: SPACE.md,
    ...shadowStyleProps,
    justifyContent: "center",
    alignItems: "flex-start",
    flexDirection: "column",
    backgroundColor: "#000"
  },
  itemSeparator: { width: 0 }
});

export default OptimizedBottomBreadCrumbs;
