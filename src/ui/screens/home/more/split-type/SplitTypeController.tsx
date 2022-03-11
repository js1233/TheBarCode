import { SplitTypeView } from "./SplitTypeView";
import React, { useLayoutEffect } from "react";
import HeaderTitle from "ui/components/headers/header_title/HeaderTitle";
import HeaderLeftTextWithIcon from "ui/components/headers/header_left_text_with_icon/HeaderLeftTextWithIcon";
import LeftArrow from "assets/images/left.svg";
import { StackNavigationProp } from "@react-navigation/stack";
import { HomeStackParamList } from "routes/HomeStack";
import {
  RouteProp,
  useNavigation,
  useRoute
} from "@react-navigation/native";
import Strings from "config/Strings";
import { SPACE } from "config";
import { OptionsData } from "models/OptionsData";
import ESplitType from "models/enums/ESplitType";
import { SplitPayment } from "models/SplitPayment";
import ESplitPaymentStatus from "models/enums/ESplitPaymentStatus";
import { useAppSelector } from "hooks/redux";
import { RootState } from "stores/store";

type SplitTypeProp = StackNavigationProp<HomeStackParamList, "SplitType">;
type splitTypeScreenProp = RouteProp<HomeStackParamList, "SplitType">;

const SplitTypeController = () => {
  const route = useRoute<splitTypeScreenProp>();
  const order = route.params.order;

  const { user } = useAppSelector((state: RootState) => state.auth);
  const navigation = useNavigation<SplitTypeProp>();

  const radioData: OptionsData[] = [
    {
      value: "50 - 50 Equal Split",
      text: "50 - 50 Equal Split"
    },
    {
      value: "Split by fixed amount",
      text: "Split by fixed amount"
    },
    {
      value: "Split by percentage (%)",
      text: "Split by percentage (%)"
    }
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <HeaderTitle
          text={Strings.splitType.title}
          shouldTruncate={false}
        />
      ),
      headerLeft: () => (
        <HeaderLeftTextWithIcon
          icon={() => <LeftArrow />}
          onPress={() => {
            navigation.goBack();
          }}
          containerStyle={{ marginLeft: SPACE.lg }}
        />
      )
    });
  }, [navigation]);

  const onButtonPress = (data: {
    payByMe: number;
    splitType: ESplitType;
  }) => {
    let splitPayment: SplitPayment = {
      id: Number(user?.id),
      name: user?.full_name ?? "",
      split_type: data.splitType,
      amount: data.payByMe,
      type: ESplitPaymentStatus.UN_PAID
    };

    let updatedOrder = order;
    updatedOrder.payment_split = [splitPayment];

    navigation.navigate("MemberDiscount", {
      order: updatedOrder,
      splitPayment: splitPayment
    });
  };

  return (
    <SplitTypeView
      order={order}
      radioData={radioData}
      onButtonPress={onButtonPress}
    />
  );
};

export default SplitTypeController;
