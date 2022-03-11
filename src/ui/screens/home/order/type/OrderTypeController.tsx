import {
  RouteProp,
  useNavigation,
  useRoute
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { COLORS, FONT_SIZE, SPACE } from "config";
import Cross from "assets/images/ic_cross.svg";
import Strings from "config/Strings";
import React, { FC, useCallback, useLayoutEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import { HomeStackParamList } from "routes/HomeStack";
import HeaderTitle from "ui/components/headers/header_title/HeaderTitle";
import { OrderTypeView } from "./OrderTypeView";
import { CreateOrderRequestModel } from "models/api_requests/CreateOrderRequestModel";
import { useOrderApis } from "repo/order/OrderApis";
import SimpleToast from "react-native-simple-toast";
import EOrderType from "models/enums/EOrderType";
import { usePreventDoubleTap } from "hooks";
import EPosType from "models/enums/EPosType";
import ECardType from "models/enums/ECardType";
import EPaymentGateway from "models/enums/EPaymentGateway";
import { TEXT_TYPE } from "ui/components/atoms/app_label/AppLabel";
import HeaderRightTextWithIcon from "ui/components/headers/header_right_text_with_icon/HeaderRightTextWithIcon";
import { isOrderForBundleBogo, Order } from "models/Order";

type OrderTypeNavigationController = StackNavigationProp<
  HomeStackParamList,
  "OrderType"
>;

type OrderTypeRouteProp = RouteProp<HomeStackParamList, "OrderType">;

type Props = {};

const OrderTypeController: FC<Props> = ({}) => {
  const route = useRoute<OrderTypeRouteProp>();
  const navigation = useNavigation<OrderTypeNavigationController>();

  const openAddressesScreen = () => {
    navigation.navigate("Addresses", { isOpenFromOrderType: true });
  };

  const navigateToSplitPayment = useCallback(
    (order: Order) => {
      navigation.navigate("SplitTheBill", { order: order });
    },
    [navigation]
  );

  const navigateToRedeemOffer = useCallback(
    (_order: Order) => {
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
    },
    [navigation]
  );

  const { request: _createOrder, loading } = useOrderApis().createOrder;

  const handleCreateOrder = useCallback(
    async (requestModel: CreateOrderRequestModel) => {
      const { hasError, dataBody, errorBody } = await _createOrder(
        requestModel
      );

      if (hasError || dataBody === undefined) {
        SimpleToast.show(
          errorBody ?? Strings.common.some_thing_bad_happened
        );
        return;
      } else {
        let order = dataBody.data;
        order.payment_split = [];
        requestModel.type === EOrderType.DINE_IN
          ? navigateToSplitPayment(order)
          : navigateToRedeemOffer(order);
      }
    },
    [_createOrder, navigateToRedeemOffer, navigateToSplitPayment]
  );
  const onBackButtonPressed = usePreventDoubleTap(() => {
    navigation.goBack();
  });
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle text={Strings.orderType.title} />,
      headerLeft: () => (
        <Pressable onPress={onBackButtonPressed} style={styles.leftHeader}>
          <Cross fill={COLORS.theme?.interface[500]} />
        </Pressable>
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
              ?.routes?.find((_route) => _route.name === "MyCart");

            if (findItem) {
              navigation.navigate("MyCart", { ...findItem.params });
            } else {
              navigation.navigate("Home");
            }
          }}
        />
      )
    });
  }, [navigation, route.params, onBackButtonPressed]);

  const createOrder = (requestModel: CreateOrderRequestModel) => {
    handleCreateOrder(requestModel);
  };

  return (
    <OrderTypeView
      openAddressesScreen={openAddressesScreen}
      createOrder={createOrder}
      loading={loading}
      order={route?.params?.order}
    />
  );
};

export default OrderTypeController;

const styles = StyleSheet.create({
  leftHeader: {
    marginLeft: SPACE.lg
  },
  rightHeader: {
    marginRight: SPACE.lg,
    fontSize: FONT_SIZE.lg,
    color: COLORS.theme?.primaryColor
  }
});
