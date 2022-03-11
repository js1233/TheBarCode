import React, { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { HomeStackParamList } from "routes/HomeStack";
import HeaderLeftTextWithIcon from "ui/components/headers/header_left_text_with_icon/HeaderLeftTextWithIcon";
import Cross from "assets/images/ic_cross.svg";
import HeaderTitle from "ui/components/headers/header_title/HeaderTitle";
import { FaqsView } from "./FaqsView";
import Strings from "config/Strings";

type FaqsNavigationProp = StackNavigationProp<
  HomeStackParamList,
  "FrequentlyAskedQuestions"
>;

const FaqsController = () => {
  const navigation = useNavigation<FaqsNavigationProp>();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <HeaderTitle
          text={Strings.FrequentlyAskedQuestions.faq_title}
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

  return <FaqsView />;
};

export default FaqsController;
