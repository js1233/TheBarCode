import { isOrderPossible, Order } from "models/Order";
import React, { FC, useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { FlatListWithPb } from "ui/components/organisms/flat_list/FlatListWithPb";
import ItemCart from "ui/components/organisms/item_cart/ItemCart";
import { AppLog, listContentContainerStyle, TAG } from "utils/Util";
import { COLORS, SPACE } from "config";
import CustomAppDialog from "ui/components/organisms/app_dialogs/CustomAppDialog";
import Strings from "config/Strings";
import { BarMenu } from "models/BarMenu";
import { useTraceUpdate } from "hooks";

type Props = {
  data: Order[] | undefined;
  shouldShowProgressBar: boolean;
  onEndReached: () => void;
  pullToRefreshCallback: (onComplete: () => void) => void;
  isAllDataLoaded: boolean;
  navigateToOrderType: (selectedCartIndex: number) => void;
  updateCartList: (
    cartItem: Order,
    deletedItem: BarMenu,
    shouldAdd: boolean,
    shouldDelete: boolean
  ) => void;
  shouldDisableStepper?: boolean;
  exclusiveId?: string | undefined;
};

const MyCartView: FC<Props> = ({
  data,
  shouldShowProgressBar,
  onEndReached,
  pullToRefreshCallback,
  isAllDataLoaded,
  navigateToOrderType,
  updateCartList,
  shouldDisableStepper,
  exclusiveId
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [shouldShowDialog, setShouldShowDialog] = useState(false);
  const [shouldShowDialogOnOpen, setShouldShowDialogOnOpen] =
    useState(false);
  const [selectItem, setSelectedItem] = useState<Order | undefined>(
    undefined
  );

  useTraceUpdate({
    data,
    shouldShowProgressBar,
    onEndReached,
    pullToRefreshCallback,
    isAllDataLoaded,
    navigateToOrderType,
    updateCartList,
    shouldDisableStepper,
    exclusiveId
  });

  const checkOutBtnCallback = useCallback((item: Order) => {
    AppLog.log(
      () => "item order: " + JSON.stringify(item),
      TAG.EXCLUSIVE_OFFER
    );
    if (!isOrderPossible(item)) {
      setShouldShowDialogOnOpen(true);
    } else {
      setShouldShowDialog(true);
      setSelectedItem(item);
    }
  }, []);

  const renderItem = useCallback(
    ({ item, index }: { item: Order; index: number }) => {
      return (
        <ItemCart
          cart={item}
          isSelected={selectedIndex === index}
          onPress={() => {
            setSelectedIndex(index);
          }}
          checkOutBtnCallback={checkOutBtnCallback}
          data={data!}
          updateCartList={updateCartList}
          shouldDisableStepper={shouldDisableStepper}
          exclusiveId={exclusiveId}
        />
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      checkOutBtnCallback,
      data,
      selectedIndex,
      updateCartList,
      shouldDisableStepper
    ]
  );

  const getFilteredCart = useCallback(() => {
    return data?.filter((value) => {
      return value.menuItems!.length > 0;
    });
  }, [data]);

  return (
    <View
      style={[
        styles.list,
        { backgroundColor: COLORS.theme?.primaryBackground }
      ]}>
      <FlatListWithPb
        data={getFilteredCart()}
        renderItem={renderItem}
        shouldShowProgressBar={shouldShowProgressBar}
        isAllDataLoaded={isAllDataLoaded}
        onEndReached={onEndReached}
        style={styles.list}
        pullToRefreshCallback={pullToRefreshCallback}
        contentContainerStyle={[
          listContentContainerStyle,
          { paddingHorizontal: SPACE.lg }
        ]}
        keyExtractor={(item) => item.id.toString()}
        extraData={[selectedIndex]}
      />
      <CustomAppDialog
        isVisible={shouldShowDialogOnOpen}
        buttonsText={["OK"]}
        textContainerStyle={{ maxHeight: 60 }}
        message={Strings.dialogs.cartDialog.dialog_msg}
        textOnImage={Strings.dialogs.cartDialog.dialog_title}
        hideSelf={() => setShouldShowDialogOnOpen(false)}
        appButtonsProps={[
          {
            onPress: () => {
              setShouldShowDialogOnOpen(false);
            }
          }
        ]}
      />
      <CustomAppDialog
        image={require("assets/images/reload_get_credits.webp")}
        isVisible={shouldShowDialog}
        message={Strings.dialogs.proceedToCheckOut.dialog_msg}
        textOnImage={"Have you got any allergies?"}
        textContainerStyle={{ maxHeight: 100 }}
        buttonsText={[Strings.dialogs.proceedToCheckOut.proceed_to_order]}
        hideSelf={() => setShouldShowDialog(false)}
        appButtonsProps={[
          {
            onPress: () => {
              setShouldShowDialog(false);
              navigateToOrderType(selectItem!.id);
            }
          }
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

export default MyCartView;
