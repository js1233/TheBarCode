import React, {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState
} from "react";
import OrderDetailsView from "ui/screens/home/order/order_details/OrderDetailsView";
import {
  RouteProp,
  useNavigation,
  useRoute
} from "@react-navigation/native";
import { HomeStackParamList } from "routes/HomeStack";
import HeaderTitle from "ui/components/headers/header_title/HeaderTitle";
import HeaderLeftTextWithIcon from "ui/components/headers/header_left_text_with_icon/HeaderLeftTextWithIcon";
import Cross from "assets/images/ic_cross.svg";
import { StackNavigationProp } from "@react-navigation/stack";
import { AppLog, TAG } from "utils/Util";
import { Order } from "models/Order";
import { useOrderApis } from "repo/order/OrderApis";
import EScreen from "models/enums/EScreen";
import { useAppDispatch } from "hooks/redux";
import {
  consumeRefreshCount,
  consumeRefreshEventArray,
  setRefreshingEvent,
  setRefreshingEventArray
} from "stores/generalSlice";
import { COLORS } from "config";
import { ActivityIndicator, StyleSheet } from "react-native";
import { usePreventDoubleTap } from "hooks";

type Props = {};
type HomeNavigationProp = StackNavigationProp<
  HomeStackParamList,
  "OrderDetails"
>;
type HomeRouteProp = RouteProp<HomeStackParamList, "OrderDetails">;
const OrderDetailsController: FC<Props> = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  const { params } = useRoute<HomeRouteProp>();
  const [order, setOrder] = useState<Order | undefined>(
    params?.order ?? undefined
  );

  const { request: fetchOrderById, loading } = useOrderApis().getOrderById;

  const getOrderById = useCallback(async () => {
    const { hasError, dataBody } = await fetchOrderById({
      orderId: params?.order?.id ?? params?.order_id ?? -1
    });

    if (!hasError && dataBody !== undefined) {
      setOrder(dataBody.data);
      AppLog.log(
        () => "OrderByID: " + JSON.stringify(dataBody.data),
        TAG.API
      );
    }
  }, [params, fetchOrderById]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: "center",
      headerTitle: () => (
        <HeaderTitle
          text={
            params?.order_id
              ? "Order No# " + params?.order_id
              : "Order No# " + params?.order?.id
          }
        />
      ),
      headerLeft: () => (
        <HeaderLeftTextWithIcon
          onPress={() => {
            AppLog.log(
              () =>
                "Current navigation : " +
                JSON.stringify(navigation.getState()),
              TAG.ORDERS
            );
            navigation.pop();
          }}
          icon={() => <Cross width={20} height={20} fill={"#737373"} />}
        />
      )
    });
  }, [params, navigation]);

  useEffect(() => {
    if (params?.order_id || !order) {
      getOrderById();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    //fire event on successfull order
    if (params.isFrom === EScreen.PAYMENT) {
      dispatch(
        setRefreshingEventArray([
          {
            ORDER_CREATED_EVENT: {}
          }
        ])
      );

      dispatch(
        setRefreshingEvent({
          REFRESH_APIS_EXPLORE_SCREEN: [EScreen.RELOAD_BANNER]
        })
      );

      dispatch(
        setRefreshingEvent({
          SUCCESSFULL_REDEMPTION: {
            venueId: params.order?.establishment?.id ?? 0,
            offerId: Number(params.order?.offer?.id ?? 0),
            isVoucher: false
          }
        })
      );

      setTimeout(() => {
        dispatch(consumeRefreshCount());
        dispatch(consumeRefreshEventArray());
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onOrderStatusPress = usePreventDoubleTap(() => {
    dispatch(setRefreshingEvent({ MOVE_TO_SCREEN: EScreen.MY_ORDERS }));
    setTimeout(() => dispatch(consumeRefreshCount()), 100);
    navigation.goBack();
  });

  return (
    <>
      {loading ? (
        <ActivityIndicator
          testID="initial-loader"
          size="large"
          color={COLORS.theme?.interface["900"]}
          style={[
            styles.initialPb,
            { backgroundColor: COLORS.theme?.primaryBackground }
          ]}
        />
      ) : (
        <OrderDetailsView
          order={order}
          isOrderJustCompleted={params?.isFrom === EScreen.PAYMENT}
          onOrderStatusPress={onOrderStatusPress}
        />
      )}
    </>
  );
};

export const styles = StyleSheet.create({
  initialPb: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  }
});

export default OrderDetailsController;
