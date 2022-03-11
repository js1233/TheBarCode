/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  RouteProp,
  useNavigation,
  useRoute
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AddToCartRequestModel } from "models/api_requests/AddToCartRequestModel";
import { GetModifierDetailsRequestModel } from "models/api_requests/GetModifierDetailsRequestModel";
import {
  ModifierDetails,
  ModifierGroup
} from "models/api_responses/ModifierDetailsResponseModel";
import React, {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import { useAppDispatch } from "hooks/redux";
import Cross from "assets/images/ic_cross.svg";
import SimpleToast from "react-native-simple-toast";
import { useAddCartApi } from "repo/myCart/MyCarts";
import { useVenueApis } from "repo/venues/Venues";
import { HomeStackParamList } from "routes/HomeStack";
import HeaderLeftTextWithIcon from "ui/components/headers/header_left_text_with_icon/HeaderLeftTextWithIcon";
import HeaderTitle from "ui/components/headers/header_title/HeaderTitle";
import { MenuDetailView } from "./MenuDetailView";
import { COLORS, SPACE } from "config";
import {
  setRefreshingEvent,
  consumeRefreshCount
} from "stores/generalSlice";
import _ from "lodash";
import { BarMenu } from "models/BarMenu";
import { FetchSingleProductRequestModel } from "models/api_requests/FetchSingleProductRequestModel";
import { usePreventDoubleTap } from "hooks";
import { AppLog, TAG } from "utils/Util";
import EScreen from "models/enums/EScreen";
import Strings from "config/Strings";
import ESupportedOrderType from "models/enums/ESupportedOrderType";
import EProductGroupType from "models/enums/EProductGroupType";
import { data } from "../../more/redemption-rules/RedemptionData";
import { Modifier } from "models/Modifier";

type Props = {};
type HomeRouteProp = RouteProp<HomeStackParamList, "MenuDetail">;
type HomeNavigationProp = StackNavigationProp<
  HomeStackParamList,
  "MenuDetail"
>;

const MenuDetailController: FC<Props> = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  const route = useRoute<HomeRouteProp>();
  const [menu, setMenu] = useState<BarMenu | undefined>(route.params.menu);
  const menu_id = route.params.menu_id;
  const menuType = route.params.menuType;
  const redeemType = route.params.redeemType;
  const exclusiveOfferId = route.params.exclusive_offer_id;
  const establishment_id = route.params.establishment_id;
  const productType = route.params.productType;
  const supportedType = route.params.supportedType;
  const isUpdating = route.params.isUpdating;
  const quantity = route.params.quantity;
  const isOpenFrom: EScreen | undefined = route?.params?.isOpenFrom;

  const [comments, setComments] = useState<string>();
  const [modifiers, setModifiers] = useState<
    ModifierDetails[] | undefined
  >(undefined);
  const [grandTotal, setGrandTotal] = useState<number>(0);
  const requestModel = useRef<GetModifierDetailsRequestModel>({
    establishment_id: Number(establishment_id),
    product_id: menu?.id ?? menu_id ?? 0,
    type: supportedType
  });
  const dispatch = useAppDispatch();

  const onSuccessItemAdded = useCallback(
    (
      cart_item_id: number,
      _quantity: number,
      previousQuantity: number
    ) => {
      dispatch(
        setRefreshingEvent({
          SUCCESSFULL_ITEM_ADDED: {
            barId: `${menu?.establishment_id}`,
            cartType: menuType,
            product: _.omit(menu, "key"),
            cart_item_id: cart_item_id,
            quantity: _quantity,
            previousQuantity: previousQuantity
          }
        })
      );
      dispatch(consumeRefreshCount());
    },
    [dispatch, menu, menuType]
  );

  const { loading, request: fetchModifiers } =
    useVenueApis().getProductModifiers;

  const { loading: singleProductLoader, request: fetchSingleProduct } =
    useVenueApis().getSingleProduct;

  const singleProductRequestModel = useRef<FetchSingleProductRequestModel>(
    {
      supported_order_type: menuType,
      product_id: menu_id
    }
  );

  const getBarMenusData = useCallback(async () => {
    requestModel.current.establishment_id = Number(establishment_id);
    if (isUpdating) {
      requestModel.current.cart_item_id = menu?.cart_item_id!;
    }
    const { hasError, dataBody } = await fetchModifiers(
      requestModel.current
    );

    if (!hasError && dataBody !== undefined) {
      if (route.params?.selectedModifiers) {
        dataBody.data.forEach(
          (modifier: ModifierDetails, index: number) => {
            route.params?.selectedModifiers?.forEach((item) => {
              let groupId: number = 0;

              let selectedModifierArray: ModifierGroup[] | undefined =
                modifier.modifier_groups.map((modifierGroup) => {
                  if (
                    modifierGroup.modifiers?.find(
                      (_modifier: ModifierGroup) =>
                        Number(_modifier.id) === Number(item.id)
                    )
                  ) {
                    groupId = modifierGroup.id;
                    return modifierGroup.modifiers?.find(
                      (_modifier: ModifierGroup) =>
                        Number(_modifier.id) === Number(item.id)
                    );
                  }
                });

              selectedModifierArray = selectedModifierArray?.filter(
                function (e) {
                  return e;
                }
              );

              if ((selectedModifierArray?.length ?? 0) > 0) {
                let selectedModifier: ModifierGroup = {
                  quantity: item.quantity ?? 0,
                  isSelected: true,
                  ...selectedModifierArray![0]
                };

                let modifierGroup: ModifierGroup | undefined =
                  modifier.modifier_groups.find(
                    (group) => group.id === Number(groupId)
                  );

                modifierGroup?.modifiers?.splice(
                  modifierGroup?.modifiers.findIndex(
                    (_modifier: ModifierGroup) =>
                      Number(_modifier.id) === Number(selectedModifier!.id)
                  ),
                  1,
                  selectedModifier!
                );

                modifier.modifier_groups.splice(
                  modifier.modifier_groups.findIndex(
                    (group: ModifierGroup) => group!.id === Number(groupId)
                  ),
                  1,
                  modifierGroup
                );
              }
            });
          },
          dataBody.data
        );
      }

      setModifiers(_.cloneDeep(dataBody.data));
      calculatePrice(isUpdating ? menu!.quantity : 1);
    } else {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchModifiers]);

  const getProductDetails = useCallback(async () => {
    const { hasError, dataBody, errorBody } = await fetchSingleProduct(
      singleProductRequestModel.current
    );
    if (!hasError && dataBody !== undefined) {
      setMenu(dataBody.data);
      requestModel.current.type = dataBody.data.menu_type;
      getBarMenusData();
    } else {
      SimpleToast.show(errorBody ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchSingleProduct]);

  useEffect(() => {
    if (menu === undefined) {
      getProductDetails();
    } else {
      getBarMenusData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchModifierQuantity = (group: ModifierGroup) => {
    let total = 0;
    // eslint-disable-next-line @typescript-eslint/no-shadow
    group.modifiers?.map((data) => {
      total += data.isSelected ? data.quantity! : 0;
    });
    return total;
  };

  const isDataValid = () => {
    let BreakException = {};
    let isValid = true;
    try {
      modifiers?.forEach(function () {
        modifiers?.forEach((group) => {
          if (group.modifier_groups != null) {
            group.modifier_groups.forEach((modifier) => {
              if (
                modifier.min! >= 1 &&
                fetchModifierQuantity(modifier) < modifier.min!
              ) {
                SimpleToast.show(
                  `Please select at least ${modifier.min} from ${modifier.name}`,
                  5
                );
                isValid = false;
                throw BreakException;
              }
            });
          }
        });
      });
    } catch (e) {
      if (e !== BreakException) {
        throw e;
      }
    }
    return isValid;
  };

  let modifierDetailsContainer: [
    { id: string; quantity: number; menu_id: string; price: number }
  ] = [{ id: "", quantity: 0, menu_id: "", price: 0 }];

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const addToCart = usePreventDoubleTap(
    async (total: number, stepperValue: number) => {
      if (isDataValid() && total > 0) {
        AppLog.log(
          () => "menu: " + JSON.stringify(menu),
          TAG.EXCLUSIVE_OFFER
        );

        modifierDetailsContainer.pop();
        modifiers?.forEach((group) => {
          if (group.modifier_groups != null) {
            group.modifier_groups.forEach((modifierGroup) => {
              modifierGroup.modifiers?.forEach((modifier) => {
                if (modifier.isSelected) {
                  modifierDetailsContainer.push({
                    id: `${modifier.id}`,
                    quantity: modifier.quantity!,
                    menu_id: `${modifier.product_id}`,
                    price: modifier.price ?? 0
                  });
                }
              });
            });
          }
        });

        if (comments !== "") {
          addToCartRequestModel.current.comment = comments;
        }

        addToCartRequestModel.current.id = menu?.id.toString() ?? "";
        if (exclusiveOfferId) {
          addToCartRequestModel.current.exclusive_offer_id =
            exclusiveOfferId;
          addToCartRequestModel.current.redeem_type = redeemType;
          addToCartRequestModel.current.offer_type = "exclusive";
        }
        addToCartRequestModel.current.establishment_id =
          menu?.establishment_id ?? 0;

        if (
          menu?.cart_item_id !== undefined &&
          menu?.cart_item_id !== null
        ) {
          if (
            !menu.have_modifiers &&
            menu.group_type === EProductGroupType.SINGLE
          ) {
            addToCartRequestModel.current.cart_item_id =
              menu?.cart_item_id!;
          } else {
            if (isUpdating) {
              addToCartRequestModel.current.cart_item_id =
                menu?.cart_item_id!;
            }
          }
        }

        if (exclusiveOfferId) {
          addToCartRequestModel.current.quantity = 1;
        } else {
          if (
            !menu?.have_modifiers &&
            menu?.group_type === EProductGroupType.SINGLE
          ) {
            if (isUpdating) {
              addToCartRequestModel.current.quantity = stepperValue;
            } else {
              addToCartRequestModel.current.quantity = add(
                menu?.quantity ?? 0,
                stepperValue
              );
            }
          } else {
            addToCartRequestModel.current.quantity = stepperValue;
          }
        }

        if (menu?.have_modifiers && modifierDetailsContainer.length > 0) {
          addToCartRequestModel.current.modifier_details =
            modifierDetailsContainer;
        }

        if (isOpenFrom !== EScreen.BUNDLE_BOGO) {
          addProductToCart(stepperValue);
        } else {
          //fire event for BundleBogoController

          addToCartRequestModel.current.grand_total = grandTotal;

          if (addToCartRequestModel.current.modifier_details) {
            dispatch(
              setRefreshingEvent({
                BOGO_BUNDLE_MODIFIERS_SELECTED: {
                  data: addToCartRequestModel.current,
                  selectedModifierIndex:
                    route?.params?.selectedModifierIndex
                }
              })
            );
          }
          navigation.goBack();
        }
      }
    }
  );

  const calculatePrice = useCallback(
    (value: number) => {
      setModifiers((prev) => {
        let productPrice = menu?.price ?? 0;
        let newTotal = 0.0;
        let selectedArray = prev;
        selectedArray &&
          selectedArray!.map((group) => {
            group.modifier_groups != null &&
              group.modifier_groups.map((groupModifiers) => {
                groupModifiers.modifiers?.map((modifier) => {
                  if (modifier.isSelected || modifier.quantity! > 0) {
                    newTotal +=
                      modifier.price! *
                      (modifier.quantity! !== undefined
                        ? modifier.quantity!
                        : 0);
                  }
                });
              });
          });

        setGrandTotal(productPrice * value + newTotal * value);
        return prev;
      });
    },
    [menu?.price]
  );

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const add = (quantity: number, stepper: number) => {
    if (quantity === undefined) {
      return stepper;
    } else {
      return Number(quantity) + Number(stepper);
    }
  };

  const addToCartRequestModel = useRef<AddToCartRequestModel>({
    cart_type: menuType === ESupportedOrderType.ALL ? undefined : menuType
  });

  const { loading: addToCartLoading, request: addToCartProduct } =
    useAddCartApi().addToCart;

  const addProductToCart = useCallback(
    async (stepperCount: number) => {
      const { hasError, dataBody, errorBody } = await addToCartProduct(
        addToCartRequestModel.current
      );

      let updatedQuantity: number = 0;
      if (!hasError && dataBody !== undefined) {
        let cartItemId: number | undefined;
        Object.values(dataBody.data.menuItems).map((menuItem) => {
          if (menuItem.id === menu?.id ?? 0) {
            cartItemId = menuItem.cart_item_id!;
            if (isUpdating) {
              if (menu?.have_modifiers) {
                updatedQuantity += menuItem.quantity;
              } else {
                updatedQuantity = stepperCount;
              }
            } else {
              updatedQuantity =
                Number(menu?.quantity ?? 0) + Number(stepperCount);
            }
          }
        });

        if (cartItemId) {
          onSuccessItemAdded(
            cartItemId,
            updatedQuantity,
            menu?.have_modifiers
              ? isUpdating
                ? stepperCount - menu.quantity
                : stepperCount
              : updatedQuantity - (menu?.quantity ?? 0)
          );
        }

        SimpleToast.show(dataBody.message);
        navigation.goBack();
        if (exclusiveOfferId) {
          navigation.navigate("MyCart", {
            isFrom: EScreen.VENUE_DETAIL,
            establishment_id:
              addToCartRequestModel.current.establishment_id,
            exclusive_id: addToCartRequestModel.current.exclusive_offer_id
          });
        }
      } else {
        SimpleToast.show(errorBody!);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [menu, grandTotal, comments, modifiers]
  );
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: "center",
      headerLeft: () => (
        <HeaderLeftTextWithIcon
          icon={() => <Cross fill={COLORS.theme?.interface["500"]} />}
          onPress={() => navigation.goBack()}
          containerStyle={{ marginLeft: SPACE.lg }}
        />
      ),
      headerTitle: () => (
        <HeaderTitle text={menu?.name ?? modifiers?.[0].name ?? ""} />
      )
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, getBarMenusData]);

  const getComments = (comment: string) => {
    setComments(comment);
  };

  return (
    <MenuDetailView
      menu={menu!}
      modiferDetails={modifiers!}
      addToCart={addToCart}
      showProgressbar={loading || singleProductLoader}
      addToCartLoading={addToCartLoading}
      prevQuantity={quantity !== undefined ? quantity! : 1}
      isUpdating={isUpdating}
      calculatePrice={calculatePrice}
      totalBill={grandTotal}
      getComment={getComments}
      buttonText={
        exclusiveOfferId
          ? "Redeem Deal"
          : isOpenFrom !== EScreen.BUNDLE_BOGO
          ? `${
              isUpdating
                ? Strings.venue_details.menu.updateToCart
                : Strings.venue_details.menu.addToCart
            }`
          : `${
              isUpdating
                ? Strings.venue_details.menu.update_modifier
                : Strings.venue_details.menu.select_modifier
            }`
      }
      shouldDisbableStepper={exclusiveOfferId ? true : false}
      isOpenFrom={isOpenFrom}
      shouldShowPriceInButton={route.params.shouldShowPriceInButton}
    />
  );
};

export default MenuDetailController;
