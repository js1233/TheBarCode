import React, { FC, useLayoutEffect } from "react";
import { WalletTabsRoutes } from "ui/screens/home/more/wallet/WalletTabsRoutes";
import HeaderTitle from "ui/components/headers/header_title/HeaderTitle";
import HeaderLeftTextWithIcon from "ui/components/headers/header_left_text_with_icon/HeaderLeftTextWithIcon";
import {
  RouteProp,
  useNavigation,
  useRoute
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { HomeStackParamList } from "routes/HomeStack";
import Cross from "assets/images/ic_cross.svg";
import { COLORS } from "config";
import { StyleSheet } from "react-native";
import Screen from "ui/components/atoms/Screen";

export type WalletRoutes = "Favourite" | "Shared" | "BookMarked";

type Props = {};
type HomeNavigationProp = StackNavigationProp<
  HomeStackParamList,
  "Wallet"
>;

type WalletScreenProp = RouteProp<HomeStackParamList, "Wallet">;

const WalletController: FC<Props> = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  const route = useRoute<WalletScreenProp>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        elevation: 0,
        shadowOpacity: 0,
        backgroundColor: COLORS.white
      },
      headerTitleAlign: "center",
      headerTitle: () => <HeaderTitle text={"Wallet"} />,
      headerLeft: () => (
        <HeaderLeftTextWithIcon
          onPress={() => navigation.pop()}
          icon={() => <Cross width={20} height={20} fill={"#737373"} />}
        />
      )
    });
  }, [navigation]);

  return (
    <Screen
      style={[styles.container]}
      requiresSafeArea={false}
      bottomSafeAreaColor={COLORS.theme?.interface["50"]}>
      <WalletTabsRoutes
        initialRouteName={route?.params?.initialRouteName ?? "Favourite"}
        selectedSegmentIndex={route?.params?.initialSegmentIndex}
      />
    </Screen>
  );

  // return (
  //   <Screen style={[styles.container]} shouldAddBottomInset={false}>
  //     <WalletTabsRoutes initialRoute={} />
  //   </Screen>
  // );
};

export default WalletController;

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
