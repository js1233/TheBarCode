import { COLORS, SPACE } from "config";
import { Address } from "models/Address";
import React, { FC, useCallback } from "react";
import { StyleSheet } from "react-native";
import Screen from "ui/components/atoms/Screen";
import { FlatListWithPb } from "ui/components/organisms/flat_list/FlatListWithPb";
import { ItemAddress } from "ui/components/organisms/my-addresses/ItemAddress";
import { listContentContainerStyle } from "utils/Util";

type Props = {
  data: Address[];
  shouldShowProgressBar: boolean;
  isAllDataLoaded: boolean;
  onEndReached: () => void;
  onPullToRefresh: (onComplete: () => void) => void;
  onDeleteAddress: (id: number, index: number) => void;
  openEditAddress: (address: Address) => void;
  selectAddress: (address: Address) => void;
  showSelectAddressBtn: boolean;
  shouldShowProgressBarOnDelete: boolean;
  addressItemIndex: number;
};

export const MyAddressesView: FC<Props> = ({
  data,
  shouldShowProgressBar,
  isAllDataLoaded,
  onEndReached,
  onDeleteAddress,
  onPullToRefresh,
  openEditAddress,
  selectAddress,
  showSelectAddressBtn,
  shouldShowProgressBarOnDelete,
  addressItemIndex
}) => {
  const listItem = useCallback(
    ({ item, index }: { item: Address; index: number }) => {
      return (
        <ItemAddress
          address={item}
          onDeleteAddress={() => onDeleteAddress(item.id, index)}
          openEditAddress={openEditAddress}
          selectAddress={selectAddress}
          showSelectAddressBtn={showSelectAddressBtn}
          shouldShowProgressBarOnDelete={
            shouldShowProgressBarOnDelete && index === addressItemIndex
          }
        />
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onDeleteAddress, openEditAddress, selectAddress, showSelectAddressBtn]
  );

  return (
    <Screen
      style={styles.container}
      bottomSafeAreaColor={COLORS.theme?.secondaryBackground}>
      <FlatListWithPb
        data={data}
        isAllDataLoaded={isAllDataLoaded}
        shouldShowProgressBar={shouldShowProgressBar}
        onEndReached={onEndReached}
        pullToRefreshCallback={onPullToRefresh}
        renderItem={listItem}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          listContentContainerStyle,
          { paddingTop: 0 }
        ]}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  list: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: SPACE.md
  }
});
