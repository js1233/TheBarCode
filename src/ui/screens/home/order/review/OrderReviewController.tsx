import React, {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState
} from "react";
import {
  RouteProp,
  useNavigation,
  useRoute
} from "@react-navigation/native";
import { HomeStackParamList } from "routes/HomeStack";
import HeaderTitle from "ui/components/headers/header_title/HeaderTitle";
import { StackNavigationProp } from "@react-navigation/stack";
import { getSplitAmount, isOrderForBundleBogo, Order } from "models/Order";
import { useOrderApis } from "repo/order/OrderApis";
import Strings from "config/Strings";
import LeftArrow from "assets/images/left.svg";
import { SplitPayment } from "models/SplitPayment";
import { useAppSelector } from "hooks/redux";
import { RootState } from "stores/store";
import ESplitPaymentStatus from "models/enums/ESplitPaymentStatus";
import OrderReviewScreen from "./OrderReviewView";
import HeaderLeftTextWithIcon from "ui/components/headers/header_left_text_with_icon/HeaderLeftTextWithIcon";
import { COLORS, SPACE } from "config";
import { usePreventDoubleTap } from "hooks";
import ECardType from "models/enums/ECardType";
import EPosType from "models/enums/EPosType";
import EPaymentGateway from "models/enums/EPaymentGateway";
import HeaderRightTextWithIcon from "ui/components/headers/header_right_text_with_icon/HeaderRightTextWithIcon";
import { TEXT_TYPE } from "ui/components/atoms/app_label/AppLabel";

type Props = {};
type HomeNavigationProp = StackNavigationProp<
  HomeStackParamList,
  "OrderDetails"
>;
type HomeRouteProp = RouteProp<HomeStackParamList, "OrderReview">;
const OrderReviewController: FC<Props> = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  const { params } = useRoute<HomeRouteProp>();
  const [order, setOrder] = useState<Order>();
  const { user } = useAppSelector((state: RootState) => state.auth);

  const { request: fetchOrderById, loading } = useOrderApis().getOrderById;

  const getOrderById = useCallback(async () => {
    const { hasError, dataBody } = await fetchOrderById({
      orderId: params.orderId
    });
    if (!hasError && dataBody !== undefined) {
      if ((dataBody.data.payment_split?.length ?? 0) > 0) {
        dataBody.data.payment_split = [
          {
            id: user?.id,
            name: user?.full_name,
            amount:
              getSplitAmount(ESplitPaymentStatus.UN_PAID, dataBody.data) -
              (dataBody.data.order_tip ?? 0.0),
            split_type: undefined,
            discount: 0.0,
            order_tip: dataBody.data.order_tip,
            type: ESplitPaymentStatus.UN_PAID
          } as SplitPayment,
          ...dataBody.data.payment_split!
        ];
      }
      setOrder(dataBody.data);
    }
  }, [fetchOrderById, params.orderId, user?.id, user?.full_name]);

  const onBackButtonPressed = usePreventDoubleTap(() => {
    navigation.goBack();
  });
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: "center",
      headerTitle: () => <HeaderTitle text={Strings.orderReview.title} />,
      headerLeft: () => (
        <HeaderLeftTextWithIcon
          icon={() => <LeftArrow />}
          onPress={onBackButtonPressed}
          containerStyle={{ marginLeft: SPACE.lg }}
        />
      ),
      headerRight: () => (
        <HeaderRightTextWithIcon
          text={Strings.common.back_to_cart}
          textStyle={{ color: COLORS.theme?.interface[500] }}
          textType={TEXT_TYPE.SEMI_BOLD}
          showIcon={false}
          onPress={() => {
            let findItem = navigation
              ?.getState()
              ?.routes?.find((route) => route.name === "MyCart");

            if (findItem) {
              navigation.navigate("MyCart", { ...findItem.params });
            } else {
              navigation.navigate("Home");
            }
          }}
        />
      )
    });
  }, [params, navigation, onBackButtonPressed]);

  useEffect(() => {
    if (params?.orderId) {
      getOrderById();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPress = (_order: Order) => {
    if (
      _order.offer_type === "exclusive" ||
      isOrderForBundleBogo(_order)
    ) {
      navigation.navigate("MyPayment", {
        order: _order,
        cardType:
          _order?.epos_type === EPosType.SQUARE_UP
            ? ECardType.SQUARE_UP
            : _order.establishment?.payment_gateway_type ===
              EPaymentGateway.PAYMENT_SENSE
            ? ECardType.PAYMENT_SENSE
            : ECardType.WORLD_PAY,
        splitPayment: undefined
      });
    } else {
      navigation.navigate("MemberDiscount", {
        order: _order
      });
    }
  };

  return (
    <OrderReviewScreen
      order={order}
      onPress={onPress}
      isLoading={loading}
    />
  );
};

export default OrderReviewController;
