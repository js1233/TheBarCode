import { COLORS, FONT_SIZE, SPACE } from "config";
import React, { FC, useCallback, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  Pressable,
  ActivityIndicator
} from "react-native";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import TrashIcon from "assets/images/trash_red.svg";
import { Price } from "utils/Util";
import { Stepper } from "ui/components/atoms/stepper/Stepper";
import {
  BarMenu,
  barMenuTotalPrice,
  barMenuUnitPrice,
  isBasicBogo,
  isBundleBogo
} from "models/BarMenu";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { HomeStackParamList } from "routes/HomeStack";
import ESupportedOrderType from "models/enums/ESupportedOrderType";
import { useAddCartApi } from "repo/myCart/MyCarts";
import { AddToCartRequestModel } from "models/api_requests/AddToCartRequestModel";
import SimpleToast from "react-native-simple-toast";
import EProductGroupType from "models/enums/EProductGroupType";

type Props = {
  data: BarMenu;
  currencySymbol: string;
  cartType: ESupportedOrderType;
  shouldDisableStepper?: boolean;
  updateCartList: (
    deletedItem: BarMenu,
    shouldAdd: boolean,
    shouldDelete: boolean
  ) => void;
  exclusiveId?: string | undefined;
};

type HomeNavigationProps = StackNavigationProp<
  HomeStackParamList,
  "VenueDetails"
>;

const ItemCartMenu: FC<Props> = ({
  data,
  currencySymbol,
  cartType,
  updateCartList,
  shouldDisableStepper = false,
  exclusiveId
}) => {
  const homeNavigation = useNavigation<HomeNavigationProps>();
  const [addToCartLoader, setAddToCartLoader] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  let modifierDetailsContainer: [
    { id: string; quantity: number; menu_id: string }
  ] = [{ id: "", quantity: 0, menu_id: "" }];
  const { request: addToCartProduct, loading: updateCardApiProgress } =
    useAddCartApi().addToCart;

  const addToCartRequestModel = useRef<AddToCartRequestModel>({
    id: `${data.id}`,
    establishment_id: data.establishment_id,
    quantity: data.quantity,
    cart_type: cartType === ESupportedOrderType.ALL ? undefined : cartType
  });

  const updateCart = useCallback(
    async (stepperCount: number, shouldAdd: boolean) => {
      if (updateCardApiProgress) {
        return;
      }

      if (stepperCount === 0) {
        setLoading(true);
      } else {
        setAddToCartLoader(true);
      }
      modifierDetailsContainer.pop();
      if (data.group_type === EProductGroupType.SINGLE) {
        data.modifiers?.forEach((modifier) => {
          if (modifier.quantity > 0) {
            modifierDetailsContainer.push({
              id: `${modifier.id}`,
              quantity: modifier.quantity!,
              menu_id: `${modifier.product_id}`
            });
          }
        });

        if (data.have_modifiers && modifierDetailsContainer.length > 0) {
          addToCartRequestModel.current.modifier_details =
            modifierDetailsContainer!;
        }
      } else if (isBundleBogo(data)) {
        addToCartRequestModel.current.funnel_details =
          (data.funnel_details?.length ?? 0) > 0
            ? data.funnel_details
            : undefined;
      }

      if (shouldAdd) {
        addToCartRequestModel.current.quantity = data.quantity + 1;
      } else {
        if (stepperCount === 0) {
          addToCartRequestModel.current.quantity = 0;
        } else {
          addToCartRequestModel.current.quantity = data.quantity - 1;
        }
      }

      if (data.comment !== null || data.comment !== undefined) {
        addToCartRequestModel.current.comment = data.comment!;
      }

      if (data.cart_item_id !== undefined || data.cart_item_id !== null) {
        addToCartRequestModel.current.cart_item_id = data.cart_item_id!;
      }

      if (isBundleBogo(data)) {
        addToCartRequestModel.current.group_type = data.group_type;

        if (isBasicBogo(data)) {
          addToCartRequestModel.current.basic_bogo = true;
        } else {
          addToCartRequestModel.current.basic_bogo = undefined;
        }

        // addToCartRequestModel.current.sub_menu_ids = menuIds;
        // let menuIds: number[] = [];
        // data.sub_menus?.map((item) => {
        //   menuIds.push(Number(item.id));
        // });
        // addToCartRequestModel.current.deal_price = data.deal_price;
        // addToCartRequestModel.current.bundle_quan_update = true;
      }

      addToCartRequestModel.current.offer_type =
        data?.offer_type === "chalkboard" ? "chalkboard" : undefined;

      // if (addToCartRequestModel.current.quantity !== 0) {
      //   addToCartRequestModel.current.exclusive_offer_id =
      //     data?.exclusive_offer_id
      //       ? data?.exclusive_offer_id.toString()
      //       : undefined;
      // }

      const { hasError, dataBody, errorBody } = await addToCartProduct(
        addToCartRequestModel.current
      );

      if (!hasError && dataBody !== undefined) {
        if (stepperCount === 0) {
          setLoading(false);
        } else {
          setAddToCartLoader(false);
        }
        updateCartList(data, shouldAdd, stepperCount === 0);
        SimpleToast.show(
          stepperCount === 0
            ? "Item deleted successfully"
            : "Item updated successfully"
        );
      } else {
        if (stepperCount === 0) {
          setLoading(false);
        } else {
          setAddToCartLoader(false);
        }
        SimpleToast.show(errorBody!);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [addToCartProduct, data]
  );

  const handleRedirection = () => {
    if (isBundleBogo(data)) {
      if (isBasicBogo(data)) {
        //can't open screen for basic bogo
        return;
      }

      if (isExclusive(data)) {
        //can't modify exclusive offer
        return;
      }

      homeNavigation.navigate("BundleBogo", {
        menu: data,
        menuType: cartType,
        productType: data.group_type,
        quantity: data.quantity,
        establishment_id: data.establishment_id,
        menu_id: data.id,
        exclusive_offer_id:
          exclusiveId ?? data?.exclusive_offer_id?.toString() ?? undefined,
        isChalkboardOffer: data?.offer_type === "chalkboard",
        supportedType: data.menu_type
      });
    } else {
      homeNavigation.navigate("MenuDetail", {
        menu: data,
        menuType: cartType,
        productType: data.group_type,
        isUpdating: true,
        quantity: data.quantity,
        establishment_id: data.establishment_id,
        menu_id: data.id,
        exclusive_offer_id:
          exclusiveId ?? data?.exclusive_offer_id?.toString() ?? undefined,
        supportedType: data.menu_type
      });
    }
  };

  const isExclusive = useCallback(
    (menu: BarMenu) => menu?.exclusive_offer_id,
    []
  );

  return (
    <Pressable
      onPress={() => {
        if (loading) {
          SimpleToast.show("Please wait..");
        } else {
          handleRedirection();
        }
      }}>
      <View style={[styles.container]}>
        <View style={[styles.leftView]}>
          <Image
            source={
              data.image != null
                ? { uri: data.image! }
                : require("assets/images/cart_placeholder.png")
            }
            style={[
              styles.productImage,
              data.image == null && {
                borderWidth: 1,
                borderColor: COLORS.theme?.interface[300]
              }
            ]}
          />
        </View>
        <View style={[styles.middleView]}>
          <View>
            <AppLabel
              style={[styles.productName]}
              text={data.name}
              textType={TEXT_TYPE.SEMI_BOLD}
            />
          </View>
          <View style={[styles.productPriceContainer]}>
            <Stepper
              min={1}
              containerStyle={{ marginTop: 2 }}
              shouldStepperUpdateCount={false}
              initialValue={data.quantity}
              shouldDisableLeftButton={
                isExclusive(data) ? true : shouldDisableStepper
              }
              shouldDisableRightButton={
                isExclusive(data) ? true : shouldDisableStepper
              }
              onValueChange={(value, shouldAdd) => {
                updateCart(value, shouldAdd);
              }}
            />
            {data.group_type !== EProductGroupType.BUNDLE && (
              <View style={[styles.productUnitPrice]}>
                <AppLabel
                  style={[styles.counter]}
                  text={
                    "x " +
                    Price.toString(currencySymbol, barMenuUnitPrice(data))
                  }
                  textType={TEXT_TYPE.NORMAL}
                />
              </View>
            )}
            <ActivityIndicator
              animating={addToCartLoader}
              color={COLORS.theme?.primaryColor}
              style={[{ height: 16, width: 16, marginLeft: 10 }]}
            />
          </View>
        </View>
        <View style={[styles.rightView]}>
          <Pressable
            style={[styles.deleteIcon]}
            onPress={() => updateCart(0, false)}>
            {loading ? (
              <ActivityIndicator
                animating={loading}
                color={COLORS.theme?.primaryColor}
                style={[styles.deleteIcon, { height: 16, width: 16 }]}
              />
            ) : (
              <TrashIcon
                height={16}
                width={16}
                style={[styles.deleteIcon, { padding: SPACE.sm }]}
              />
            )}
            <AppLabel
              style={[styles.counter, styles.trashView]}
              text={Price.toString(
                currencySymbol,
                barMenuTotalPrice(data)
              )}
              textType={TEXT_TYPE.SEMI_BOLD}
            />
          </Pressable>
        </View>
      </View>
      <View style={[styles.spacer]} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    marginVertical: 15,
    justifyContent: "space-between"
  },
  leftView: {
    marginLeft: 20
  },
  productImage: {
    height: 50,
    width: 50,
    borderRadius: 8
  },
  middleView: {
    flex: 1,
    marginStart: SPACE._2md
  },
  productName: {
    fontSize: FONT_SIZE._2xs
  },
  stepperContainer: {
    flexDirection: "row",
    height: 30,
    width: 90,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8
  },
  plusContainer: {
    height: 28,
    width: 28,
    borderRadius: 14,
    backgroundColor: COLORS.theme?.primaryColor,
    marginHorizontal: 3,
    alignItems: "center",
    justifyContent: "center"
  },
  minusContainer: {
    height: 28,
    width: 28,
    borderRadius: 14,
    backgroundColor: COLORS.theme?.primaryColor,
    marginHorizontal: 3,
    alignItems: "center",
    justifyContent: "center"
  },
  counter: {
    fontSize: FONT_SIZE._2xs
  },
  rightView: {
    marginRight: 20,
    alignSelf: "flex-end",
    height: "100%",
    justifyContent: "center"
  },
  productPriceContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  productUnitPrice: {
    marginLeft: 3,
    marginTop: 5
  },
  deleteIcon: {
    alignSelf: "flex-end"
  },
  spacer: {
    height: 1,
    width: "90%",
    backgroundColor: COLORS.white,
    marginHorizontal: 5,
    alignSelf: "center"
  },
  trashView: { marginTop: 10 },
  loader: { marginTop: 5, marginLeft: 5 }
});

export default ItemCartMenu;
