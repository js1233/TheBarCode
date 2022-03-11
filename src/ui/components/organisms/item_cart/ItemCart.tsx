import { COLORS, FONT_SIZE, SPACE } from "config";
import { menuItemPrice, menuItemsCount, Order } from "models/Order";
import React, { FC, useCallback, useEffect } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import RadioButtonActive from "assets/images/radio-btn-active.svg";
import RadioButtonInActive from "assets/images/radio-btn-inactive.svg";
import ItemCartMenu from "../item_cart_menu/ItemCartMenu";
import { FlatListWithPb } from "../flat_list/FlatListWithPb";
import NoRecordFound from "assets/images/tbc.svg";
import { AppButton } from "ui/components/molecules/app_button/AppButton";
import { Price } from "utils/Util";
import { BarMenu } from "models/BarMenu";
import { useAppDispatch } from "hooks/redux";
import { setCartCount } from "stores/generalSlice";

type Props = {
  cart: Order;
  isSelected: boolean;
  onPress: () => void;
  checkOutBtnCallback: (ItemCart: Order) => void;
  data: Order[];
  updateCartList: (
    cartItem: Order,
    deletedItem: BarMenu,
    shouldAdd: boolean,
    shouldDelete: boolean
  ) => void;
  shouldDisableStepper?: boolean;
  exclusiveId?: string | undefined;
};

const ItemCart: FC<Props> = ({
  cart,
  isSelected,
  onPress,
  checkOutBtnCallback,
  data,
  updateCartList,
  shouldDisableStepper,
  exclusiveId
}) => {
  const dispatch = useAppDispatch();

  const renderItem = useCallback(
    ({ item }: { item: BarMenu }) => {
      return (
        <ItemCartMenu
          shouldDisableStepper={shouldDisableStepper}
          data={item}
          currencySymbol={cart.establishment.region.currency_symbol}
          cartType={cart.cart_type!}
          updateCartList={(deletedItem, shouldAdd, shouldDelete) =>
            updateCartList(cart, deletedItem, shouldAdd, shouldDelete)
          }
          exclusiveId={exclusiveId}
        />
      );
    },
    [cart, shouldDisableStepper, updateCartList, exclusiveId]
  );

  useEffect(() => {
    if (isSelected) {
      dispatch(
        setCartCount({
          type: "count",
          value: menuItemsCount(cart?.menuItems ?? [])
        })
      );
    }
  }, [cart, dispatch, isSelected]);
  return (
    <View style={[styles.container]}>
      <Pressable onPress={onPress} style={[styles.cartHeaderContainer]}>
        <AppLabel
          style={[styles.cartHeaderTitle]}
          text={
            cart.epos_type === "barcode" &&
            cart.cart_type === "dine_in_collection"
              ? cart.establishment.title + " - " + "Dine-in"
              : cart.epos_type === "barcode" &&
                cart.cart_type === "takeaway_delivery"
              ? cart.establishment.title + " - " + "Take Away/Delivery"
              : cart.establishment.title
          }
          textType={TEXT_TYPE.SEMI_BOLD}
        />
        {isSelected ? (
          <RadioButtonActive stroke={COLORS.theme?.borderColor} />
        ) : (
          <RadioButtonInActive stroke={COLORS.theme?.borderColor} />
        )}
      </Pressable>
      <View style={[styles.spacer]} />
      {isSelected && cart.menuItems!.length > 0 && (
        <FlatListWithPb
          data={cart.menuItems}
          renderItem={renderItem}
          style={[styles.container]}
          noRecordFoundImage={
            <NoRecordFound width={"100%"} height={"44%"} />
          }
          ItemSeparatorComponent={() => <View />}
          contentContainerStyle={[{ paddingHorizontal: SPACE.lg }]}
          keyExtractor={(item) =>
            (item.id + (item?.cart_item_id ?? 0)).toString()
          }
          extraData={data}
        />
      )}
      {isSelected && cart.menuItems!.length > 0 && (
        <View style={[styles.checkoutBtnContainer]}>
          <View style={[styles.spacer]} />
          <AppButton
            text={
              `Checkout - ` +
              Price.toString(
                cart.establishment.region.currency_symbol,
                menuItemPrice(cart.menuItems!)
              )
            }
            textType={TEXT_TYPE.BOLD}
            textStyle={[styles.checkoutText]}
            onPress={() => checkOutBtnCallback(cart)}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.theme?.interface[100],
    borderRadius: 10,
    marginVertical: 10
  },
  cartHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 40,
    marginHorizontal: 10
  },
  cartHeaderTitle: {
    fontSize: FONT_SIZE._2xs
  },
  spacer: {
    height: 1,
    width: "95%",
    backgroundColor: COLORS.white,
    marginHorizontal: 5,
    alignSelf: "center"
  },
  checkoutBtnContainer: {
    marginHorizontal: 15,
    marginBottom: 10
  },
  checkoutText: { fontSize: FONT_SIZE.sm }
});

export default ItemCart;
