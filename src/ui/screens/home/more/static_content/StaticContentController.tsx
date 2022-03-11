import React, { FC, useLayoutEffect } from "react";
import { StaticContentView } from "ui/screens/home/more/static_content/StaticContentView";
import HeaderTitle from "ui/components/headers/header_title/HeaderTitle";
import {
  RouteProp,
  useNavigation,
  useRoute
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { HomeStackParamList } from "routes/HomeStack";
import HeaderLeftTextWithIcon from "ui/components/headers/header_left_text_with_icon/HeaderLeftTextWithIcon";
import Cross from "assets/images/ic_cross.svg";
import EMoreType from "models/enums/EMoreType";
import Env from "envs/env";

type Props = {};
type HomeNavigationProp = StackNavigationProp<
  HomeStackParamList,
  "StaticContent"
>;
type UpdateProfileRouteProp = RouteProp<
  HomeStackParamList,
  "StaticContent"
>;
const StaticContentController: FC<Props> = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  const route = useRoute<UpdateProfileRouteProp>();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: "center",
      headerTitle: () => (
        <HeaderTitle
          text={
            route?.params?.contentType === EMoreType.PRIVACY_POLICY
              ? "Privacy Policy"
              : "Terms & Conditions"
          }
        />
      ),
      headerLeft: () => (
        <HeaderLeftTextWithIcon
          onPress={() => navigation.pop()}
          icon={() => <Cross width={20} height={20} fill={"#737373"} />}
        />
      )
    });
  }, [route?.params?.contentType, navigation]);
  const uri =
    route?.params?.contentType === EMoreType.PRIVACY_POLICY
      ? `${Env.BASE_URL}privacy-policy`
      : `${Env.BASE_URL}terms`;

  return <StaticContentView uri={uri} />;
};

export default StaticContentController;
