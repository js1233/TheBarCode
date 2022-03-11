import { useNavigation } from "@react-navigation/native";
import Strings from "config/Strings";
import React, { useLayoutEffect } from "react";
import HeaderLeftTextWithIcon from "ui/components/headers/header_left_text_with_icon/HeaderLeftTextWithIcon";
import HeaderTitle from "ui/components/headers/header_title/HeaderTitle";
import Cross from "assets/images/ic_cross.svg";
import { StackNavigationProp } from "@react-navigation/stack";
import { HomeStackParamList } from "routes/HomeStack";
import { RedemptionRulesView } from "./RedemptionView";

type RedemptionReloadProp = StackNavigationProp<
  HomeStackParamList,
  "RedemptionAndReloadRules"
>;

const RedemptionRulesController = () => {
  const navigation = useNavigation<RedemptionReloadProp>();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <HeaderTitle
          text={Strings.RedemptionAndReloadRules.title}
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
  return <RedemptionRulesView />;
};
export default RedemptionRulesController;
