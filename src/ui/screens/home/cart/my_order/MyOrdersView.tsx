import React, { FC, useCallback, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { FlatListWithPb } from "ui/components/organisms/flat_list/FlatListWithPb";
import ItemOrder from "ui/components/organisms/item_order/ItemOrder";
import { listContentContainerStyle } from "utils/Util";
import { COLORS, SPACE } from "config";
import { OrderHeader } from "ui/screens/home/cart/my_order/OrderHeader";
import { Order } from "models/Order";

type Props = {
  data: Order[] | undefined;
  isLoading: boolean;
  isAllDataLoaded: boolean;
  onEndReached: () => void;
  onPullToRefresh: (onComplete: () => void) => void;
  onItemPress?: (order: Order) => void;
  onReOrder: (force: boolean, item?: Order, index?: number) => void;
  shouldShowProgressBar?: boolean;
  reOrderItemIndex: number;
  onCancelOrderClick: (order: Order, index: number) => void;
  cancelOrderLoader: boolean;
};

export const MyOrdersView: FC<Props> = ({
  data,
  isLoading,
  isAllDataLoaded,
  onEndReached,
  onPullToRefresh,
  onItemPress,
  onReOrder,
  shouldShowProgressBar,
  reOrderItemIndex,
  onCancelOrderClick,
  cancelOrderLoader
}) => {
  let sharedDataRef = useRef("");

  const listItem = useCallback(
    ({ item, index }: { item: Order; index: number }) => {
      return (
        <>
          <OrderHeader item={item} setSharedDataRef={sharedDataRef} />
          <ItemOrder
            order={item}
            key={index}
            onPress={onItemPress}
            onCancelOrderClick={(order: Order) =>
              onCancelOrderClick(order, index)
            }
            onReOrder={(order: Order) => onReOrder(false, order, index)}
            shouldShowProgressBar={
              shouldShowProgressBar && index === reOrderItemIndex
            }
            cancelOrderLoader={
              cancelOrderLoader && index === reOrderItemIndex
            }
          />
        </>
      );
    },
    [
      onItemPress,
      onCancelOrderClick,
      shouldShowProgressBar,
      reOrderItemIndex,
      onReOrder,
      cancelOrderLoader
    ]
  );

  return (
    <View
      style={[
        styles.list,
        {
          backgroundColor: COLORS.theme?.primaryBackground
        }
      ]}>
      <FlatListWithPb
        data={data}
        style={styles.list}
        keyExtractor={(item) => item.id.toString()}
        renderItem={listItem}
        isAllDataLoaded={isAllDataLoaded}
        shouldShowProgressBar={isLoading}
        onEndReached={onEndReached}
        pullToRefreshCallback={(onComplete) => {
          sharedDataRef.current = "";
          onPullToRefresh(onComplete);
        }}
        contentContainerStyle={[
          listContentContainerStyle,
          { paddingHorizontal: SPACE.lg }
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1
  }
});
