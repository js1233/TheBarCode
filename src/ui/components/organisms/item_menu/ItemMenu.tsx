import { COLORS, FONT_SIZE, SPACE } from "config";
import { BarMenu, isBasicBogo, isBundleBogo } from "models/BarMenu";
import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle
} from "react-native";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import {
  setRefreshingEvent,
  consumeRefreshCount
} from "stores/generalSlice";
import { useAppDispatch } from "hooks/redux";
import { AppLog, Price, TAG } from "utils/Util";
import Cart from "assets/images/ic_cart.svg";
import InfoCircle from "assets/images/ic_info_circle.svg";
import { useAppSelector } from "hooks/redux";
import { RootState } from "stores/store";
import Separator from "ui/components/atoms/separator/Separator";
import { HomeStackParamList } from "routes/HomeStack";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import HTMLView from "react-native-htmlview";
import ESupportedOrderType from "models/enums/ESupportedOrderType";
import TrashIcon from "assets/images/trash_red.svg";
import { useAddCartApi } from "repo/myCart/MyCarts";
import { AddToCartRequestModel } from "models/api_requests/AddToCartRequestModel";
import SimpleToast from "react-native-simple-toast";
import Strings from "config/Strings";
import ItemRelatedProduct from "../item_related_products/ItemRelatedProduct";
import { FlatListWithPbHorizontal } from "../flat_list/FlatListWithPbHorizontal";
import _ from "lodash";
import { isBarOperatesToday, Venue } from "models/Venue";
import EProductGroupType from "models/enums/EProductGroupType";
import AllergensInfoDialog from "ui/components/organisms/app_dialogs/AllergensInfoDialog";
import { AddToCartResponseModel } from "models/api_responses/AddToCartResponseModel";
import useBasicBogoApiHandler from "hooks/useBasicBogoApiHandler";

interface Props {
  menu: BarMenu;
  isExpanded?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  menuType?: ESupportedOrderType;
  _venue: Venue;

  onBasicBogoClick: (
    bogo: BarMenu,
    dataBody: AddToCartResponseModel
  ) => void;
}

type HomeNavigationProps = StackNavigationProp<
  HomeStackParamList,
  "VenueDetails"
>;

const ItemMenu = ({
  menu,
  containerStyle,
  menuType,
  _venue,
  onBasicBogoClick
}: Props) => {
  const homeNavigation = useNavigation<HomeNavigationProps>();
  const [allergensInfoDialogVisible, setAllergensInfoDialogVisible] =
    useState(false);

  const { regionData } = useAppSelector(
    (state: RootState) => state.general
  );
  const dispatch = useAppDispatch();

  const { loading, request: addToCartProduct } = useAddCartApi().addToCart;

  const addToCartRequestModel = useRef<AddToCartRequestModel>({
    id: `${menu.id}`,
    establishment_id: menu.establishment_id,
    quantity: 0,
    cart_type: menuType === ESupportedOrderType.ALL ? undefined : menuType,
    comment: menu.comment!
  });

  const onSuccessItemAdded = (
    cart_item_id?: number | null,
    _quantity?: number
  ) => {
    dispatch(
      setRefreshingEvent({
        SUCCESSFULL_ITEM_ADDED: {
          barId: `${menu.establishment_id}`,
          cartType: menuType!,
          product: _.omit(menu, "key"),
          cart_item_id: cart_item_id,
          quantity: _quantity
        }
      })
    );

    setTimeout(() => {
      dispatch(consumeRefreshCount());
    }, 500);
  };

  const updateCart = useCallback(
    async () => {
      addToCartRequestModel.current.cart_item_id = undefined;

      if (menu.group_type === EProductGroupType.BUNDLE) {
        let menuIds: number[] = [];
        menu.sub_menus?.map((item) => {
          menuIds.push(Number(item.id));
        });
        addToCartRequestModel.current.sub_menu_ids = menuIds;
        addToCartRequestModel.current.group_type =
          EProductGroupType.BUNDLE;
        addToCartRequestModel.current.deal_price = menu.deal_price;
      } else {
        addToCartRequestModel.current.sub_menu_ids = menu.sub_menu_ids!;
      }

      const { hasError, dataBody, errorBody } = await addToCartProduct(
        addToCartRequestModel.current
      );
      if (!hasError && dataBody) {
        SimpleToast.show("Item deleted successfully");
        onSuccessItemAdded(null, 0);
      } else {
        SimpleToast.show(errorBody ?? "Unable to delete this product");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [addToCartProduct]
  );

  const { updateBasicBogo, loading: basicBogoLoading } =
    useBasicBogoApiHandler();

  const openMenuScreen = useCallback(
    (barMenu: BarMenu, isRelatedMenu: boolean = false) => {
      AppLog.log(
        () => "openMenuScreen: " + JSON.stringify(barMenu),
        TAG.MENU
      );

      if (isBundleBogo(menu)) {
        if (isBasicBogo(menu)) {
          updateBasicBogo(menu, menuType, undefined, (response) => {
            onBasicBogoClick(menu, response);
          });
          return;
        }
        homeNavigation.navigate("BundleBogo", {
          menu: !isRelatedMenu
            ? _.omit(barMenu, "key", "cart_item_id")
            : undefined,
          menu_id: barMenu.id,
          menuType: menuType!,
          productType: menu.group_type,
          quantity: menu.quantity > 0 ? menu.quantity : undefined,
          establishment_id: barMenu.establishment_id,
          supportedType: barMenu.menu_type
        });
      } else {
        homeNavigation.navigate("MenuDetail", {
          menu: !isRelatedMenu ? _.omit(barMenu, "key") : undefined,
          menu_id: barMenu.id,
          menuType: menuType!,
          productType: menu.group_type,
          isUpdating:
            !menu.have_modifiers && barMenu.quantity > 0 ? true : false,
          quantity:
            !menu.have_modifiers && barMenu.quantity > 0
              ? barMenu.quantity
              : 1,
          establishment_id: barMenu.establishment_id,
          supportedType: barMenu.menu_type
        });
      }
    },
    [homeNavigation, menu, menuType, onBasicBogoClick, updateBasicBogo]
  );

  const renderRelatedProductsItem = useCallback(
    ({ item }: { item: BarMenu }) => {
      item.establishment_id = menu.establishment_id;
      item.price = menu.price;

      return (
        <ItemRelatedProduct
          key={item.id}
          image={item.image!}
          onPress={() => openMenuScreen(item, true)}
        />
      );
    },
    [openMenuScreen, menu]
  );

  return (
    <>
      <Pressable
        onPress={
          _venue?.is_payment_app && isBarOperatesToday(_venue)
            ? () => openMenuScreen(menu)
            : () => {}
        }>
        <View
          style={[
            {
              backgroundColor: COLORS.theme?.interface["100"]
            },
            containerStyle
          ]}>
          <View style={[styles.container]}>
            <Image
              source={
                menu.image
                  ? { uri: menu.image }
                  : require("assets/images/cart_placeholder.png")
              }
              style={[
                styles.imageStyle,
                !menu?.image && {
                  borderColor: COLORS.theme?.interface["300"],
                  borderWidth: 1
                }
              ]}
            />

            <View style={[styles.rightContainer]}>
              <AppLabel
                text={menu?.name}
                style={styles.heading}
                textType={TEXT_TYPE.SEMI_BOLD}
              />

              <HTMLView value={menu?.description ?? ""} />
              <View style={[styles.bottomContainer]}>
                {isBarOperatesToday(_venue) === false ||
                _venue?.is_payment_app === false ? (
                  menu.price !== null &&
                  menu.price !== 0 &&
                  !isBundleBogo(menu) ? (
                    <View style={styles.cartContainer}>
                      <AppLabel
                        text={Price.toString(
                          regionData?.currency_symbol,
                          menu?.price
                        )}
                        style={[
                          styles.heading,
                          { paddingStart: SPACE.xs }
                        ]}
                        textType={TEXT_TYPE.SEMI_BOLD}
                      />
                    </View>
                  ) : (
                    <></>
                  )
                ) : (
                  <Pressable
                    style={({ pressed }) => [
                      {
                        opacity:
                          _venue?.is_payment_app && pressed ? 0.5 : 1.0
                      }
                    ]}
                    onPress={
                      _venue?.is_payment_app && isBarOperatesToday(_venue)
                        ? () => openMenuScreen(menu)
                        : () => {}
                    }>
                    <View
                      style={[
                        !basicBogoLoading && styles.cartContainer,
                        {}
                      ]}>
                      {_venue?.is_payment_app &&
                        isBarOperatesToday(_venue) && (
                          <>
                            {!basicBogoLoading ? (
                              <Cart
                                stroke={COLORS.theme?.primaryColor}
                                width={16}
                                height={16}
                                style={styles.cartIcon}
                              />
                            ) : (
                              <ActivityIndicator
                                animating={true}
                                style={[styles.mb5]}
                              />
                            )}
                          </>
                        )}

                      {!isBundleBogo(menu) &&
                        menu.price !== 0 &&
                        menu.price !== null && (
                          <AppLabel
                            text={Price.toString(
                              regionData?.currency_symbol,
                              menu?.price
                            )}
                            style={[
                              styles.heading,
                              { paddingStart: SPACE.xs }
                            ]}
                            textType={TEXT_TYPE.SEMI_BOLD}
                          />
                        )}
                    </View>
                  </Pressable>
                )}
                <View style={{ justifyContent: "flex-end" }}>
                  <ActivityIndicator
                    animating={loading}
                    style={[styles.mb5]}
                  />
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  {menu.quantity >= 1 && (
                    <>
                      <Pressable
                        style={[styles.itemCountLabel]}
                        onPress={() => updateCart()}>
                        <AppLabel
                          text={`${menu.quantity} ${
                            menu.quantity > 1 ? "Items" : "Item"
                          } added`}
                          style={[styles.itemCountColor]}
                        />
                        <TrashIcon
                          height={18}
                          width={18}
                          style={{ marginLeft: 5 }}
                        />
                      </Pressable>
                    </>
                  )}
                  {menu?.is_allergen && (
                    <Pressable
                      onPress={() => setAllergensInfoDialogVisible(true)}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "center"
                        }}>
                        <AppLabel
                          style={{
                            marginRight: SPACE._2xs,
                            fontSize: FONT_SIZE._3xs,
                            color: COLORS.theme?.primaryShade["700"]
                          }}
                          text={"Allergens Info"}
                        />
                        <InfoCircle
                          width={18}
                          height={18}
                          fill={COLORS.theme?.primaryShade["700"]}
                        />
                      </View>
                    </Pressable>
                  )}
                </View>
              </View>

              {menu.related_menus?.length !== undefined &&
                menu.related_menus?.length > 0 && (
                  <>
                    <AppLabel
                      text={Strings.venue_details.menu.related_products}
                      style={styles.relatedProducts}
                      textType={TEXT_TYPE.SEMI_BOLD}
                    />

                    <FlatListWithPbHorizontal<BarMenu>
                      data={menu?.related_menus}
                      renderItem={renderRelatedProductsItem}
                      style={[styles.list]}
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ paddingTop: SPACE.sm }}
                      keyExtractor={(item) => item.id.toString()}
                    />
                  </>
                )}
            </View>
          </View>

          {!containerStyle && (
            <>
              <Separator
                color={COLORS.theme?.primaryBackground}
                thickness={0.9}
              />
              <View style={{ paddingBottom: SPACE.lg }} />
            </>
          )}
        </View>
      </Pressable>

      <AllergensInfoDialog
        isVisible={allergensInfoDialogVisible}
        hideSelf={() => setAllergensInfoDialogVisible(false)}
        allergensIcons={menu?.allergen_icons}
        message={menu?.allergen_description}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: SPACE.md,
    paddingBottom: SPACE.lg
  },
  imageStyle: {
    width: 55,
    height: 55,
    borderRadius: 8,
    resizeMode: "cover"
  },
  rightContainer: {
    flex: 1,
    paddingHorizontal: SPACE._2md
  },
  heading: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.theme?.interface["900"]
  },
  cartContainer: {
    flexDirection: "row",

    alignItems: "center",
    alignContent: "center",
    alignSelf: "flex-start",
    paddingHorizontal: SPACE.md,
    paddingVertical: SPACE._2xs,
    backgroundColor: COLORS.theme?.primaryBackground,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: COLORS.theme?.borderColor
  },
  itemCountLabel: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5
  },
  bottomContainer: {
    flexDirection: "row",
    marginTop: SPACE.sm,
    justifyContent: "space-between",
    alignItems: "center"
  },
  itemCountColor: {
    color: COLORS.theme?.primaryColor,
    fontSize: FONT_SIZE._2xs
  },
  mb5: { marginBottom: 5 },
  relatedProducts: {
    paddingTop: SPACE.lg
  },
  list: {
    flex: 1
  },
  cartIcon: {
    padding: SPACE._2xs
  }
});

export default ItemMenu;
