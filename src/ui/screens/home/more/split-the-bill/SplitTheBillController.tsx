import { SplitTheBillView } from "./SplitTheBillView";
import React, { useLayoutEffect } from "react";
import HeaderTitle from "ui/components/headers/header_title/HeaderTitle";
import HeaderLeftTextWithIcon from "ui/components/headers/header_left_text_with_icon/HeaderLeftTextWithIcon";
import LeftArrow from "assets/images/left.svg";
import {
  RouteProp,
  useNavigation,
  useRoute
} from "@react-navigation/native";
import { COLORS, SPACE } from "config";
import { StackNavigationProp } from "@react-navigation/stack";
import { HomeStackParamList } from "routes/HomeStack";
import { usePreventDoubleTap } from "hooks";
import Strings from "config/Strings";
import { TEXT_TYPE } from "ui/components/atoms/app_label/AppLabel";
import HeaderRightTextWithIcon from "ui/components/headers/header_right_text_with_icon/HeaderRightTextWithIcon";

type SplitTheBillProp = StackNavigationProp<
  HomeStackParamList,
  "SplitTheBill"
>;

type SplitBillRouteProp = RouteProp<HomeStackParamList, "SplitTheBill">;

const SplitTheBillController = () => {
  const route = useRoute<SplitBillRouteProp>();
  const navigation = useNavigation<SplitTheBillProp>();

  const onBackButtonPressed = usePreventDoubleTap(() => {
    navigation.goBack();
  });
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <HeaderTitle text={"Split the bill"} shouldTruncate={false} />
      ),
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
  }, [navigation, onBackButtonPressed]);

  const onButtonPress = usePreventDoubleTap(() => {
    navigation.push("OrderReview", {
      orderId: route!.params!.order.id
    });
  });
  return (
    <SplitTheBillView order={route.params.order} onPress={onButtonPress} />
  );
};

export default SplitTheBillController;
