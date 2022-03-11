import { SplitBillScannerView } from "./SplitBillScannerView";
import React, { useLayoutEffect } from "react";
import HeaderTitle from "ui/components/headers/header_title/HeaderTitle";
import Strings from "config/Strings";
import Cross from "assets/images/ic_cross.svg";
import HeaderLeftTextWithIcon from "ui/components/headers/header_left_text_with_icon/HeaderLeftTextWithIcon";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { HomeStackParamList } from "routes/HomeStack";
import SimpleToast from "react-native-simple-toast";
import { useOrderApis } from "repo/order/OrderApis";
import { AppLog, TAG } from "utils/Util";

export type SplitBillScannerProp = StackNavigationProp<
  HomeStackParamList,
  "SplitBillScanner"
>;

const SplitBillScannerController = () => {
  const navigation = useNavigation<SplitBillScannerProp>();
  const { request: orderRequest, loading } = useOrderApis().getOrderById;

  const onSuccess = async (e: any) => {
    AppLog.log(() => "onSuccess : " + JSON.stringify(e.data), TAG.ORDERS);

    const { hasError, dataBody, errorBody } = await orderRequest({
      orderId: Number(e.data),
      is_splitting: true
    });
    if (!hasError && dataBody !== undefined) {
      //SimpleToast.show("Record has been update successfully");
      navigation.navigate("SplitType", {
        order: dataBody.data
      });
    } else {
      SimpleToast.show(errorBody!);
      navigation.pop();
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <HeaderTitle
          text={Strings.splitBillScanner.title}
          shouldTruncate={false}
        />
      ),
      headerLeft: () => (
        <HeaderLeftTextWithIcon
          onPress={() => navigation.pop()}
          icon={() => <Cross width={20} height={20} fill={"#737373"} />}
        />
      )
    });
  }, [navigation]);

  return (
    <SplitBillScannerView
      onSuccess={onSuccess}
      showProgressbar={loading}
    />
  );
};
export default SplitBillScannerController;
