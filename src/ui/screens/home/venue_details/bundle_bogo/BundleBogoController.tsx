/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  RouteProp,
  useNavigation,
  useRoute
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AddToCartRequestModel } from "models/api_requests/AddToCartRequestModel";
import { GetModifierDetailsRequestModel } from "models/api_requests/GetModifierDetailsRequestModel";
import React, {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import { useAppDispatch, useAppSelector } from "hooks/redux";
import Cross from "assets/images/ic_cross.svg";
import SimpleToast from "react-native-simple-toast";
import { useAddCartApi } from "repo/myCart/MyCarts";
import { useVenueApis } from "repo/venues/Venues";
import { HomeStackParamList } from "routes/HomeStack";
import HeaderLeftTextWithIcon from "ui/components/headers/header_left_text_with_icon/HeaderLeftTextWithIcon";
import HeaderTitle from "ui/components/headers/header_title/HeaderTitle";
import { COLORS, SPACE } from "config";
import {
  setRefreshingEvent,
  consumeRefreshCount
} from "stores/generalSlice";
import _ from "lodash";
import { BarMenu, isBasicBogo } from "models/BarMenu";
import Strings from "config/Strings";
import ESupportedOrderType from "models/enums/ESupportedOrderType";
import { BundleBogoView } from "./BundleBogoView";
import { MenuSegment } from "models/api_responses/GetSegmentResponseModel";
import EProductGroupType from "models/enums/EProductGroupType";
import { RootState } from "stores/store";
import { Modifier, modifierTotalPrice } from "models/Modifier";
import EFunnelType from "models/enums/EFunnelType";
import { usePreventDoubleTap } from "hooks";
import { FetchSingleProductRequestModel } from "models/api_requests/FetchSingleProductRequestModel";
import EScreen from "models/enums/EScreen";

type Props = {};
type HomeRouteProp = RouteProp<HomeStackParamList, "BundleBogo">;
type HomeNavigationProp = StackNavigationProp<
  HomeStackParamList,
  "BundleBogo"
>;

interface SelectedFunnel {
  id: number;
  menuId: number;
}
const BundleBogoController: FC<Props> = () => {
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
  const quantity = route.params.quantity;
  const [comments, setComments] = useState<string>();
  const [bundleBogoData, setBundleBogoData] = useState<
    MenuSegment[] | undefined
  >(undefined);
  const [grandTotal, setGrandTotal] = useState<number>(0);

  const [stepperValue, setStepperValue] = useState<number>(
    menu?.cart_item_id !== undefined ? menu && menu.quantity : 1
  );

  const [bundleBogoExtraData, setBundleBogoExtraData] =
    useState<number>(0);
  const { refreshingEvent } = useAppSelector(
    (state: RootState) => state.general
  );
  const selectedFunnel = useRef<SelectedFunnel | undefined>();
  const requestModel = useRef<GetModifierDetailsRequestModel>({
    establishment_id: Number(establishment_id),
    menu_id: menu?.ref_id,
    cart_item_id: menu?.cart_item_id ?? undefined
    //  product_id: menu_id ?? 0,
    //type: supportedType
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

      setTimeout(() => dispatch(consumeRefreshCount()), 200);
    },
    [dispatch, menu, menuType]
  );

  const { loading, request: fetchBogoBundle } =
    useVenueApis().getBogoBundleData;

  const getBogoBundleData = useCallback(async () => {
    requestModel.current.establishment_id = Number(establishment_id);

    const { hasError, dataBody } = await fetchBogoBundle(
      requestModel.current
    );

    if (!hasError && dataBody !== undefined) {
      dataBody.data.forEach((funnel) => {
        let alreadyAddedQuantity = 0;
        funnel.items.map((item) => {
          if (item?.quantity) {
            alreadyAddedQuantity += item?.quantity ?? 0;
          }
        });
        funnel.already_selected_quantity = alreadyAddedQuantity;
      }, dataBody.data);
      setBundleBogoData(dataBody.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchBogoBundle]);

  const { loading: singleProductLoader, request: fetchSingleProduct } =
    useVenueApis().getSingleProduct;

  const singleProductRequestModel = useRef<FetchSingleProductRequestModel>(
    {
      supported_order_type: menuType,
      product_id: menu?.id ?? menu_id
    }
  );

  const getProductDetails = useCallback(async () => {
    const { hasError, dataBody, errorBody } = await fetchSingleProduct(
      singleProductRequestModel.current
    );
    if (!hasError && dataBody !== undefined) {
      setMenu(dataBody.data);
    } else {
      SimpleToast.show(errorBody ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getBogoBundleData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isDataValid = useCallback((): boolean => {
    bundleBogoData?.forEach((funnel: MenuSegment) => {
      let requiredQuan = funnel.quantity ?? 0;
      let selectedQuan = 0;

      funnel.items.forEach((item: BarMenu) => {
        selectedQuan += item?.quantity ?? 0;
      });

      if (selectedQuan < requiredQuan) {
        SimpleToast.show(
          "Please select " +
            (requiredQuan - selectedQuan) +
            " more item from " +
            funnel.name
        );

        throw new Error();
      }
    });

    return true;
  }, [bundleBogoData]);

  const addToCart = usePreventDoubleTap(async (total: number) => {
    try {
      if (isDataValid() && total > 0) {
        if (comments !== "") {
          addToCartRequestModel.current.comment = comments;
        }

        addToCartRequestModel.current.id = menu?.id.toString() ?? "";
        addToCartRequestModel.current.establishment_id =
          menu?.establishment_id ?? 0;

        addToCartRequestModel.current.group_type = menu?.group_type;

        addToCartRequestModel.current.quantity = stepperValue;

        //this will handle both chalkboard and exclusive
        //redeemType is undefined in case of chalkboard
        if (exclusiveOfferId || route.params.isChalkboardOffer) {
          addToCartRequestModel.current.exclusive_offer_id = redeemType
            ? exclusiveOfferId
            : undefined;
          addToCartRequestModel.current.redeem_type = redeemType
            ? redeemType
            : undefined;
          addToCartRequestModel.current.offer_type = !route?.params
            ?.isChalkboardOffer
            ? "exclusive"
            : "chalkboard";
        }

        addToCartRequestModel.current.cart_item_id =
          menu?.cart_item_id ?? undefined;

        addToCartRequestModel.current.funnel_details = [];

        bundleBogoData?.forEach((_funnel: MenuSegment) => {
          let funnel: {
            id: string;
            menus?: [
              {
                id?: string | undefined;
                quantity?: string | undefined;
                modifier_details?: [
                  [
                    {
                      id?: string;
                      quantity?: number;
                      menu_id?: string;
                    }
                  ]
                ];
              }?
            ];
          } = {
            id: _funnel.id,
            menus: undefined
          };

          _funnel.items?.forEach((_item: BarMenu, index: number) => {
            try {
              if (_item.quantity > 0) {
                let _menu: {
                  id?: string;
                  quantity?: string;
                  modifier_details?: [
                    [
                      {
                        id?: string;
                        quantity?: string;
                        menu_id?: string;
                      }
                    ]?
                  ];
                } = {
                  id: _item.id,
                  quantity: _item.quantity,
                  modifier_details: undefined
                };

                if ((_item.modifiers_acc_quan?.length ?? 0) > 0) {
                  _item.modifiers_acc_quan?.forEach(
                    (modifier: Modifier[]) => {
                      let innerModifiers: [
                        {
                          id?: string;
                          quantity?: number;
                          menu_id?: string;
                        }
                      ] = [];
                      modifier.forEach((_modifier: Modifier) => {
                        if (
                          !_menu.modifier_details &&
                          _modifier?.quantity > 0
                        ) {
                          _menu.modifier_details = [];
                        }

                        innerModifiers.push({
                          id: _modifier?.id,
                          quantity: _modifier?.quantity,
                          menu_id: _item.id,
                          price: _item.price
                        });
                      });
                      if (innerModifiers?.length > 0) {
                        _menu!.modifier_details!.push(innerModifiers);
                      }
                    }
                  );
                }

                if (!funnel.menus) {
                  funnel.menus = [];
                }
                funnel!.menus!.push(_menu);
              }
            } catch (ex) {}
          });

          addToCartRequestModel.current.funnel_details?.push(funnel);
        });

        if (
          menu &&
          (route.params.isChalkboardOffer || exclusiveOfferId) &&
          isBasicBogo(menu)
        ) {
          addToCartRequestModel.current.basic_bogo = true;
          addToCartRequestModel.current.id = String(menu?.ref_id ?? 0);
          addToCartRequestModel.current.funnel_details = undefined;
        }
        addProductToCart(stepperValue);
      }
    } catch (ex) {}
  });

  const addToCartRequestModel = useRef<AddToCartRequestModel>({
    cart_type: menuType === ESupportedOrderType.ALL ? undefined : menuType
  });

  const { loading: addToCartLoading, request: addToCartProduct } =
    useAddCartApi().addToCart;

  const addProductToCart = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-shadow
    async (stepperValue: number) => {
      const { hasError, dataBody, errorBody } = await addToCartProduct(
        addToCartRequestModel.current
      );
      if (!hasError && dataBody !== undefined) {
        let cartItemId: number | undefined;
        let updatedQuantity: number = 0;
        Object.values(dataBody.data.menuItems).map((menuItem) => {
          if (menuItem.id === menu?.id ?? 0) {
            updatedQuantity += menuItem.quantity;
            cartItemId = menuItem.cart_item_id!;
          }
        });

        if (exclusiveOfferId || route.params.isChalkboardOffer) {
          SimpleToast.show(dataBody.message);

          dispatch(
            setRefreshingEvent({
              FETCH_CART_COUNT: true
            })
          );

          let findNavigation = navigation
            ?.getState()
            ?.routes?.find((item) => item?.name === "MyCart");

          if (findNavigation) {
            navigation.pop();
          }
          navigation.goBack();

          navigation.push("MyCart", {
            isFrom: EScreen.VENUE_DETAIL,
            establishment_id:
              addToCartRequestModel.current.establishment_id,
            exclusive_id: addToCartRequestModel.current.exclusive_offer_id
          });
        } else {
          if (!route?.params?.force_refresh_apis) {
            onSuccessItemAdded(
              Number(undefined),
              menu?.cart_item_id
                ? Number(updatedQuantity)
                : Number(stepperValue) + Number(quantity ?? 0),
              menu?.cart_item_id
                ? Number(stepperValue) - Number(quantity ?? 0)
                : stepperValue
            );
          } else {
            //this will used when comes from bundle popup from venue screen
            //since api is not providing the iniitial quantity if item is already added in cart
            dispatch(
              setRefreshingEvent({
                REFRESH_APIS_EXPLORE_SCREEN: [EScreen.VENUE_DETAIL_SEGMENT]
              })
            );

            setTimeout(() => {
              dispatch(consumeRefreshCount());
            }, 200);
          }

          SimpleToast.show(dataBody.message);
          navigation.goBack();
        }
      } else {
        SimpleToast.show(errorBody!);
      }
    },
    [
      addToCartProduct,
      dispatch,
      exclusiveOfferId,
      menu?.cart_item_id,
      menu?.id,
      navigation,
      onSuccessItemAdded,
      quantity,
      route.params?.force_refresh_apis,
      route.params.isChalkboardOffer
    ]
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
        <HeaderTitle
          text={
            menu?.group_type === EProductGroupType.BOGO
              ? "BOGO Offer"
              : menu?.name
          }
        />
      )
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, getBogoBundleData]);

  const getComments = (comment: string) => {
    setComments(comment);
  };

  const getFunnelById = useCallback(
    (id: number) =>
      bundleBogoData?.find(
        (itemFunnel: MenuSegment) => itemFunnel.id === id
      ),
    [bundleBogoData]
  );

  const getFunnelMenuById = useCallback(
    (funnel: MenuSegment, id: number) =>
      funnel.items.find((menuItem) => menuItem.id === id),
    []
  );

  useEffect(() => {
    if (
      refreshingEvent &&
      refreshingEvent?.BOGO_BUNDLE_MODIFIERS_SELECTED
    ) {
      //update menu in funnel

      // eslint-disable-next-line @typescript-eslint/no-shadow
      let data: AddToCartRequestModel =
        refreshingEvent.BOGO_BUNDLE_MODIFIERS_SELECTED.data;
      let selectedModifierIndex: number =
        refreshingEvent.BOGO_BUNDLE_MODIFIERS_SELECTED
          .selectedModifierIndex;

      if (!selectedFunnel.current) {
        return;
      }
      let funnel = getFunnelById(selectedFunnel!.current!.id);
      let barMenu: BarMenu | undefined = getFunnelMenuById(
        funnel!,
        selectedFunnel!.current!.menuId
      );

      let modifiers: [] | [Modifier] | undefined =
        barMenu?.modifiers_acc_quan?.[selectedModifierIndex];

      if (modifiers) {
        barMenu!.deal_price = data.grand_total;
        modifiers = data.modifier_details;
        //_.omit(data.modifier_details, "menu_id");
      }
      barMenu!.modifiers_acc_quan[selectedModifierIndex]! = modifiers;
      funnel!.items.splice(
        funnel!.items.findIndex((menuItem) => menuItem.id === barMenu!.id),
        1,
        barMenu!
      );
      bundleBogoData?.splice(
        bundleBogoData?.findIndex(
          (_item: MenuSegment) => _item.id === funnel!.id
        ),
        1,
        funnel!
      );
      setBundleBogoData(_.cloneDeep(bundleBogoData));
      dispatch(consumeRefreshCount());
    }
  }, [
    bundleBogoData,
    dispatch,
    getFunnelById,
    getFunnelMenuById,
    refreshingEvent
  ]);

  const menuItemStepperCallback = useCallback(
    (
      funnel: MenuSegment,
      item: BarMenu,
      _quantity: number,
      isInc: boolean
    ) => {
      selectedFunnel.current = { id: funnel.id, menuId: item.id };

      let findFunnel: MenuSegment | undefined = getFunnelById(funnel.id);

      if (!findFunnel) {
        return bundleBogoData;
      }

      let alreadyAddedQuantity = 0;
      findFunnel.items.forEach((funnelMenu: BarMenu) => {
        alreadyAddedQuantity += funnelMenu?.quantity ?? 0;
      });

      if (isInc && alreadyAddedQuantity >= (findFunnel?.quantity ?? 0)) {
        SimpleToast.show("Please unselect items from " + findFunnel.name);
        return bundleBogoData;
      }

      if (isInc && _quantity > (findFunnel?.quantity ?? 0)) {
        SimpleToast.show("Please unselect items from " + findFunnel.name);
        return bundleBogoData;
      }

      let barMenu = getFunnelMenuById(findFunnel, item.id);

      if (!barMenu) {
        return bundleBogoData;
      }

      if (isInc) {
        barMenu!.quantity = (barMenu.quantity ?? 0) + 1;
        barMenu!.modifiers_acc_quan = [
          ...(barMenu?.modifiers_acc_quan ?? []),
          []
        ];

        alreadyAddedQuantity += 1;
      } else {
        barMenu.quantity = barMenu.quantity > 1 ? barMenu.quantity - 1 : 0;

        if ((barMenu.modifiers_acc_quan?.length ?? 0) > 0) {
          barMenu.modifiers_acc_quan?.splice(
            barMenu.modifiers_acc_quan.length - 1,
            1
          );
        }
        alreadyAddedQuantity -= 1;
      }

      findFunnel.items.splice(
        findFunnel.items.findIndex((menuItem) => menuItem.id === item.id),
        1,
        barMenu
      );

      findFunnel.already_selected_quantity = alreadyAddedQuantity;

      bundleBogoData?.splice(
        bundleBogoData?.findIndex(
          (_item: MenuSegment) => _item.id === funnel.id
        ),
        1,
        findFunnel
      );

      setBundleBogoData(_.cloneDeep(bundleBogoData));
    },
    [bundleBogoData, getFunnelById, getFunnelMenuById]
  );

  const calculateTotalPrice = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-shadow
    (quantity: number = 1) => {
      if (menu?.group_type === EProductGroupType.BUNDLE) {
        if (menu?.bundle_offer_type === EFunnelType.DISCOUNT) {
          let barMenus = bundleBogoData?.map(
            (funnel: MenuSegment) => funnel.items
          );

          let allMenus: BarMenu[] = [];
          barMenus?.forEach((arr) => allMenus.push(...arr));
          let total = 0;
          allMenus.forEach((item: BarMenu) => {
            if (item?.quantity > 0) {
              total += item.quantity * item.price;
            }
            if ((item?.modifiers_acc_quan?.length ?? 0) > 0) {
              item.modifiers_acc_quan!.forEach(
                (totalModifiers: Modifier[]) => {
                  totalModifiers?.forEach((modifier: Modifier) => {
                    total +=
                      Number(modifier.quantity!) * Number(modifier.price!);
                  });
                }
              );
            }
          });
          total = total * quantity;
          let savedAmount = (total * (menu.bundle_discount ?? 0.0)) / 100;
          total = total - savedAmount;
          setGrandTotal(Number(total.toFixed(2)));
        } else if (menu?.bundle_offer_type === EFunnelType.FIXED_PRICE) {
          setGrandTotal(quantity * Number(menu?.price.toFixed(2)));
        } else if (menu?.bundle_offer_type === EFunnelType.FREE_FUNNEL) {
          let barMenus = bundleBogoData?.map((funnel: MenuSegment) => {
            if (menu?.free_funnel_id !== funnel.id) {
              return funnel.items;
            }
          });
          barMenus = barMenus?.filter(function (e) {
            return e;
          });
          let allMenus: BarMenu[] = [];
          barMenus?.forEach((arr) => allMenus.push(...arr));
          let total = 0;
          allMenus.forEach((item: BarMenu) => {
            if (item?.quantity > 0) {
              total += item.quantity * item.price;
            }
            if ((item?.modifiers_acc_quan?.length ?? 0) > 0) {
              item.modifiers_acc_quan!.forEach(
                (totalModifiers: Modifier[]) => {
                  totalModifiers.forEach((modifier: Modifier) => {
                    if (modifier?.quantity > 0) {
                      total +=
                        Number(modifier.quantity!) *
                        Number(modifier.price!);
                    }
                  });
                }
              );
            }
          });
          setGrandTotal(quantity * Number(total.toFixed(2)));
        }
      } else if (menu?.group_type === EProductGroupType.BOGO) {
        let barMenus = bundleBogoData?.map(
          (funnel: MenuSegment) => funnel.items
        );

        barMenus = barMenus?.filter(function (e) {
          return e;
        });

        let allMenus: BarMenu[] = [];
        barMenus?.forEach((arr) => allMenus.push(...arr));
        let total = 0;
        interface BogoPriceHelper {
          menuId: number;
          quantity: number;
          itemPrice: number;
          price: number[] | undefined;
        }
        let bogoPriceHelper: BogoPriceHelper[] = [];
        allMenus.forEach((item: BarMenu) => {
          if (item?.quantity > 0) {
            total += item.quantity * item.price;
          }
          let modifiersPrice: number[] = [];
          if ((item?.modifiers_acc_quan?.length ?? 0) > 0) {
            item.modifiers_acc_quan!.forEach(
              (totalModifiers: Modifier[]) => {
                // eslint-disable-next-line @typescript-eslint/no-shadow
                let modifierTotalPrice = 0;
                totalModifiers?.forEach((modifier: Modifier) => {
                  total +=
                    Number(modifier.quantity!) * Number(modifier.price!);
                  modifierTotalPrice +=
                    Number(modifier.quantity!) * Number(modifier.price!);
                });
                modifiersPrice.push(modifierTotalPrice);
              }
            );
          }
          //bogo price helper
          // if (modifierTotalPrice?.length > 0) {
          //   price = modifiersPrice;
          // }
          if (item?.quantity > 0) {
            bogoPriceHelper.push({
              menuId: item.id,
              quantity: item.quantity,
              itemPrice: item.price,
              price:
                modifierTotalPrice?.length > 0 ? modifiersPrice : undefined
            });
          }
        });
        let freeItemQuantity = bundleBogoData?.[0].free_item_quantity ?? 0;
        if (freeItemQuantity >= 1) {
          let minimumAmount = bogoPriceHelper.map(
            (item: BogoPriceHelper) => {
              let result = [];
              if ((item?.price?.length ?? 0) > 0) {
                let arr: any[] = [];
                item!.price!.forEach((price) => {
                  arr.push(item.itemPrice + price);
                });
                return arr;
              } else {
                for (let i = 0; i < item.quantity; i++) {
                  result.push(item.itemPrice);
                }
                return result;
              }
            }
          );
          minimumAmount = [].concat(...minimumAmount);
          minimumAmount.sort((a, b) => a - b);
          for (let i = 0; i < freeItemQuantity; i++) {
            total -= Number(minimumAmount?.[i] ?? 0);
          }
        }
        total = total * quantity;
        // let savedAmount = (total * (menu.bundle_discount ?? 0.0)) / 100;
        // total = total - savedAmount;
        setGrandTotal(Number(total.toFixed(2)));
      }
    },
    [bundleBogoData, menu]
  );

  useEffect(() => {
    calculateTotalPrice(stepperValue);
  }, [bundleBogoData, calculateTotalPrice, stepperValue]);

  return (
    <BundleBogoView
      data={bundleBogoData}
      menu={menu!}
      showProgressbar={loading}
      productType={productType}
      addToCartLoading={addToCartLoading}
      prevQuantity={
        menu?.cart_item_id && quantity !== undefined ? quantity! : 1
      }
      isUpdating={menu?.cart_item_id !== undefined}
      totalBill={grandTotal}
      getComment={getComments}
      buttonText={
        menu?.cart_item_id
          ? Strings.venue_details.menu.updateToCart
          : Strings.venue_details.menu.addToCart
      }
      shouldDisbableStepper={exclusiveOfferId ? true : false}
      menuItemStepperCallback={menuItemStepperCallback}
      addToCart={addToCart}
      calculateTotalPrice={calculateTotalPrice}
      selectedFunnel={selectedFunnel}
      stepperValue={stepperValue}
      setStepperValue={setStepperValue}
    />
  );
};

export default BundleBogoController;
