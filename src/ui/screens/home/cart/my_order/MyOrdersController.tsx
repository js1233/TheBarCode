import { COLORS } from "config";
import { arrangeOngoingCompletedOrders } from "models/api_responses/OrdersResponseModel";
import React, {
  FC,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import { useOrderApis, useOrderPaginatedApis } from "repo/order/OrderApis";
import { MyOrdersView } from "ui/screens/home/cart/my_order/MyOrdersView";
import { AppLog, TAG } from "utils/Util";
import { Order } from "models/Order";
import { StackNavigationProp } from "@react-navigation/stack";
import { HomeStackParamList } from "routes/HomeStack";
import { useNavigation } from "@react-navigation/native";
import SimpleToast from "react-native-simple-toast";
import { CartTabsParamsList } from "../CartMaterialTabs";
import CustomAppDialog, {
  BUTTONS_DIRECTION
} from "ui/components/organisms/app_dialogs/CustomAppDialog";
import { ReOrderRequestModel } from "models/api_requests/ReOrderRequestModel";
import Strings from "config/Strings";
import { useAppDispatch, useAppSelector } from "hooks/redux";
import { RootState } from "stores/store";
import { usePreventDoubleTap } from "hooks";
import {
  consumeRefreshCount,
  setRefreshingEvent
} from "stores/generalSlice";
import EOrderStatus from "models/enums/EOrderStatus";
import _ from "lodash";

type Props = {};
type HomeNavigationProp = StackNavigationProp<
  HomeStackParamList,
  "OrderDetails"
>;

type CartTabsNavigationProp = StackNavigationProp<
  CartTabsParamsList,
  "MyOrders"
>;

const MyOrdersController: FC<Props> = () => {
  AppLog.log(
    () => "App theme inside MyOrders : " + JSON.stringify(COLORS),
    TAG.THEME
  );

  const navigation = useNavigation<HomeNavigationProp>();
  const cartTabsNavigation = useNavigation<CartTabsNavigationProp>();
  const { request: reOrderRequest, loading } = useOrderApis().reOrder;
  const { request: cancelOrderRequest, loading: cancelOrderLoader } =
    useOrderApis().cancelOrder;
  const [orders, setOrders] = useState<Order[] | undefined>(undefined);
  const [dialogMessage, setdialogMessage] = useState("");
  const [shouldShowCreditDialog, setShouldShowCreditDialog] =
    useState(false);
  const [reOrderItemIndex, setReOrderItemIndex] = useState<number>(-1);
  const dispatch = useAppDispatch();
  const requestModel = useRef<ReOrderRequestModel>({
    cart_id: -1,
    force: false
  });

  const orderRef = useRef<Order>();
  const {
    isLoading,
    request: fetchOrders,
    isAllDataLoaded,
    onEndReached,
    onPullToRefresh
  } = useOrderPaginatedApis(
    setOrders,
    arrangeOngoingCompletedOrders
  ).orders;

  AppLog.log(() => "OrderList: " + JSON.stringify(orders), TAG.VENUE);

  const { refreshingEventArray } = useAppSelector(
    (state: RootState) => state.general
  );

  const onItemPress = (order: Order) => {
    navigation.push("OrderDetails", {
      order: order
    });
  };

  const onReOrder = usePreventDoubleTap(
    async (force: boolean, order?: Order, index?: number) => {
      setReOrderItemIndex(index ?? -1);
      if (order) {
        orderRef.current = order;
        requestModel.current!.cart_id = order?.cart_id;
      }
      requestModel.current!.force = force;
      const { hasError, dataBody, errorBody, statusCode } =
        await reOrderRequest(requestModel.current);
      if (!hasError && dataBody !== undefined) {
        SimpleToast.show(dataBody.message);
        dispatch(
          setRefreshingEvent({
            SUCCESSFULL_REORDER: true
          })
        );

        setTimeout(() => {
          dispatch(consumeRefreshCount());
        }, 100);

        cartTabsNavigation.navigate("MyCart");
      } else if (statusCode === 409) {
        setdialogMessage(errorBody!);
        setShouldShowCreditDialog(true);
      } else {
        SimpleToast.show(errorBody!);
      }
    }
  );

  const cancelOrderApi = useCallback(
    async (order: Order, index?: number) => {
      setReOrderItemIndex(index ?? -1);
      const { hasError, dataBody, errorBody } = await cancelOrderRequest({
        id: order.id
      });
      if (!hasError && dataBody !== undefined) {
        orders?.filter((item) => {
          if (item.id === order.id) {
            item.status = EOrderStatus.CANCELLED;
          }
        });
        setOrders(_.cloneDeep(orders));
        SimpleToast.show(dataBody.message);
      } else {
        if (errorBody) {
          SimpleToast.show(errorBody!);
        }
      }
    },
    [cancelOrderRequest, orders]
  );

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    if (
      refreshingEventArray?.find(
        (item) => item?.ORDER_CREATED_EVENT !== null
      )
    ) {
      AppLog.log(() => "OrderList: ", TAG.API);
      onPullToRefresh();
    }

    AppLog.log(() => "OrderList else: ", TAG.API);
  }, [onPullToRefresh, orders, refreshingEventArray]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onCancelOrderClick = usePreventDoubleTap(
    (order: Order, index: number) => {
      cancelOrderApi(order, index);
    }
  );

  return (
    <>
      <MyOrdersView
        data={orders}
        isLoading={isLoading}
        isAllDataLoaded={isAllDataLoaded}
        onEndReached={onEndReached}
        onPullToRefresh={onPullToRefresh}
        onItemPress={onItemPress}
        onReOrder={onReOrder}
        shouldShowProgressBar={loading}
        reOrderItemIndex={reOrderItemIndex}
        onCancelOrderClick={onCancelOrderClick}
        cancelOrderLoader={cancelOrderLoader}
      />
      <CustomAppDialog
        image={require("assets/images/reload_get_credits.webp")}
        isVisible={shouldShowCreditDialog}
        buttonsText={["Yes"]}
        buttonsAlign={BUTTONS_DIRECTION.VERTICAL}
        textOnImage={Strings.reOrder.title}
        message={dialogMessage}
        hideSelf={() => setShouldShowCreditDialog(false)}
        appButtonsProps={[
          {
            onPress: () => {
              onReOrder(true);
              setShouldShowCreditDialog(false);
            }
          }
        ]}
      />
    </>
  );
};

export default MyOrdersController;
