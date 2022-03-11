import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAppDispatch, useAppSelector } from "hooks/redux";
import { menuItemsCount, Order } from "models/Order";
import LeftArrow from "assets/images/left.svg";
import React, {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import { useMyCartsApis } from "repo/myCart/MyCarts";
import { HomeStackParamList } from "routes/HomeStack";
import MyCartView from "./MyCartView";
import { setSelectedCart } from "stores/orderSlice";
import {
  consumeRefreshCount,
  setCartCount,
  setRefreshingEvent
} from "stores/generalSlice";
import { RootState } from "stores/store";
import { BarMenu, isBundleBogo } from "models/BarMenu";
import _ from "lodash";
import { AppLog, TAG } from "utils/Util";
import { CartTabsParamsList } from "ui/screens/home/cart/CartMaterialTabs";
import EScreen from "models/enums/EScreen";
import { MaterialTopTabNavigationProp } from "@react-navigation/material-top-tabs";
import HeaderTitle from "ui/components/headers/header_title/HeaderTitle";
import HeaderLeftTextWithIcon from "ui/components/headers/header_left_text_with_icon/HeaderLeftTextWithIcon";
import { SPACE } from "config";
import EProductGroupType from "models/enums/EProductGroupType";

type Props = {};
type CartTabsNavigationProp = MaterialTopTabNavigationProp<
  CartTabsParamsList,
  "MyCart"
>;

type VenueDetailsNavigationProp = StackNavigationProp<
  HomeStackParamList,
  "VenueDetails"
>;

type HomeNavigationProp = StackNavigationProp<HomeStackParamList, "Home">;

type VenueDetailsScreenProps = RouteProp<HomeStackParamList, "MyCart">;

const MyCartController: FC<Props> = () => {
  let homeNavigation = useNavigation<HomeNavigationProp | undefined>();
  homeNavigation = homeNavigation?.getParent()?.getParent();
  const route = useRoute<VenueDetailsScreenProps>();
  const navigation = useNavigation<VenueDetailsNavigationProp>();
  const cartNavigation = useNavigation<CartTabsNavigationProp>();

  const isFocused = useIsFocused();

  const dispatch = useAppDispatch();

  const [cart, setCart] = useState<Order[] | undefined>(undefined);

  const { refreshingEvent, refreshingEventArray } = useAppSelector(
    (state: RootState) => state.general
  );

  const {
    isLoading,
    request: fetchMyCartRequest,
    isAllDataLoaded,
    onEndReached,
    onPullToRefresh
  } = useMyCartsApis(
    setCart,
    route?.params?.isFrom === EScreen.VENUE_DETAIL
      ? { establishment_id: route?.params?.establishment_id }
      : undefined
  ).myCart;

  useEffect(() => {
    fetchMyCartRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(
      setCartCount({
        type: "count",
        value: menuItemsCount(cart?.[0]?.menuItems ?? []) ?? 0
      })
    );
    AppLog.log(
      () => "cartCountUseEffect: " + cart?.[0]?.menuItems?.length ?? 0,
      TAG.CART
    );
  }, [cart, dispatch]);

  let performActionOnCartEvent = useRef<boolean>(true);
  useEffect(() => {
    if (refreshingEvent?.SUCCESSFULL_ITEM_ADDED) {
      if (!isFocused) {
        onPullToRefresh(undefined, false);
      }
    }

    if (refreshingEvent?.SUCCESSFULL_REORDER) {
      onPullToRefresh(undefined, false);
    }
  }, [isFocused, onPullToRefresh, refreshingEvent]);

  const navigateToOrderType = useCallback(
    (itemId: number) => {
      let findItem = cart?.find((item) => item.id === itemId);

      if (findItem) {
        dispatch(setSelectedCart(findItem));
        if (route?.params?.isFrom === EScreen.VENUE_DETAIL) {
          navigation?.push("OrderType", { order: findItem });
        } else {
          homeNavigation?.push("OrderType", { order: findItem });
        }
      }
    },
    [cart, dispatch, homeNavigation, navigation, route]
  );

  let eventTimeOut: any = useRef();
  const onSuccessItemAdded = useCallback(
    (
      menu: BarMenu,
      _quantity: number,
      order: Order,
      previousQuantity: number
    ) => {
      if (eventTimeOut.current) {
        clearTimeout(eventTimeOut.current);
      }

      dispatch(
        setRefreshingEvent({
          SUCCESSFULL_ITEM_ADDED: {
            barId: `${menu?.establishment_id}`,
            cartType: order.cart_type,
            product: _.omit(menu, "key"),
            cart_item_id: _quantity === 0 ? null : menu.cart_item_id,
            quantity: _quantity,
            isUpdating: true,
            previousQuantity: previousQuantity
          }
        })
      );

      eventTimeOut.current = setTimeout(() => {
        dispatch(consumeRefreshCount());
      }, 200);
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const resetCart = useCallback(
    (
      cartItem: Order,
      deletedItem: BarMenu,
      shouldAdd: boolean,
      shouldDelete: boolean
    ) => {
      AppLog.log(
        () => "\nITEM MODIFIED => " + JSON.stringify(deletedItem),
        TAG.CART
      );

      let myPrev = cart;
      let findCartItem: Order | undefined = cart?.find(
        (_item) =>
          _item.id === cartItem.id &&
          _item.cart_type === cartItem.cart_type
      );
      if (findCartItem) {
        let currentMenu = findCartItem?.menuItems?.find(
          (menu) =>
            menu.id === deletedItem.id &&
            menu.cart_item_id === deletedItem.cart_item_id
        );

        if (currentMenu && shouldDelete) {
          let updatedQuantity: number = 0;
          let copiedCartItem = _.cloneDeep(findCartItem);

          copiedCartItem.menuItems = copiedCartItem.menuItems?.filter(
            (item) =>
              item.cart_item_id !==
              copiedCartItem.menuItems.find(
                (_item) =>
                  +_item.id === +deletedItem!.id &&
                  +(_item.cart_item_id ?? 0) ===
                    +(deletedItem?.cart_item_id ?? -1)
              )?.cart_item_id
          );
          AppLog.log(
            () =>
              "\n deleting item from cart => " +
              JSON.stringify(copiedCartItem),
            TAG.CART
          );
          myPrev?.splice(
            myPrev?.findIndex(
              (_item) =>
                _item.id === cartItem.id &&
                _item.cart_type === cartItem.cart_type
            ),
            1,
            copiedCartItem
          );
          performActionOnCartEvent.current = false;
          findCartItem.menuItems?.map((menuItem) => {
            if (
              menuItem.id === currentMenu?.id &&
              currentMenu.cart_item_id !== menuItem.cart_item_id
            ) {
              updatedQuantity += menuItem.quantity;
            }
          });

          onSuccessItemAdded(
            currentMenu!,
            updatedQuantity,
            copiedCartItem,
            deletedItem.quantity * -1
          );

          if (copiedCartItem.menuItems?.length === 0) {
            dispatch(
              setCartCount({
                type: "count",
                value: 0
              })
            );
          }

          setCart(myPrev);
        } else if (currentMenu) {
          // let preservedQuantity = currentMenu!.quantity;

          if (isBundleBogo(currentMenu)) {
            currentMenu.total = Number(
              (currentMenu.total / currentMenu.quantity).toFixed(2)
            );
          }

          if (shouldAdd) {
            AppLog.log(
              () =>
                "\nIshouldAdd => " + JSON.stringify(currentMenu!.quantity),
              TAG.CART
            );
            currentMenu!.quantity += 1;
          } else {
            currentMenu!.quantity -= 1;
          }

          if (isBundleBogo(currentMenu)) {
            currentMenu.total = currentMenu.total * currentMenu.quantity;
          }

          myPrev?.splice(
            myPrev?.findIndex((_item) => _item.id === cartItem.id),
            1,
            _.cloneDeep(findCartItem)
          );

          AppLog.log(() => "\n onSuccessItemAdded => ", TAG.CART);
          let updatedQuantity: number = 0;
          findCartItem.menuItems?.map((menuItem) => {
            if (menuItem.id === currentMenu?.id) {
              updatedQuantity += menuItem.quantity;
            }
          });

          onSuccessItemAdded(
            currentMenu,
            updatedQuantity,
            cartItem,
            shouldAdd ? 1 : -1
          );
          setCart(myPrev);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cart]
  );

  const updateCartList = useCallback(
    (
      cartItem: Order,
      deletedItem: BarMenu,
      shouldAdd: boolean,
      shouldDelete: boolean
    ) => {
      resetCart(cartItem, deletedItem, shouldAdd, shouldDelete);
    },
    [resetCart]
  );

  useEffect(() => {
    if (
      refreshingEventArray?.find(
        (item) => item?.ORDER_CREATED_EVENT !== null
      )
    ) {
      onPullToRefresh();
    }
  }, [onPullToRefresh, refreshingEventArray]);

  useEffect(() => {
    if (refreshingEvent?.MOVE_TO_SCREEN === EScreen.MY_ORDERS) {
      cartNavigation.jumpTo("MyOrders");
    }
  }, [cartNavigation, onPullToRefresh, refreshingEvent]);

  useLayoutEffect(() => {
    if (route?.params?.isFrom === EScreen.VENUE_DETAIL) {
      navigation.setOptions({
        headerTitleAlign: "center",
        headerTitle: () => <HeaderTitle text={"My Cart"} />,
        headerLeft: () => (
          <HeaderLeftTextWithIcon
            containerStyle={{ marginLeft: SPACE.lg }}
            onPress={() => navigation.pop()}
            icon={() => <LeftArrow />}
          />
        )
      });
    }
  }, [route, navigation]);

  return (
    <MyCartView
      data={cart}
      pullToRefreshCallback={onPullToRefresh}
      isAllDataLoaded={isAllDataLoaded}
      onEndReached={onEndReached}
      shouldShowProgressBar={isLoading}
      navigateToOrderType={navigateToOrderType}
      updateCartList={updateCartList}
      shouldDisableStepper={route?.params?.exclusive_id ? true : false}
      exclusiveId={route?.params?.exclusive_id}
    />
  );
};

export default MyCartController;
