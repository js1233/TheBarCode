import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import TBC from "assets/images/tbc.svg";
import { COLORS, SPACE } from "config";
import Strings from "config/Strings";
import { useAppSelector } from "hooks/redux";
import getSliderData, { SplashSliderItem } from "models/SplashSliderItem";
import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { AuthStackParamList } from "routes";
import { RootState } from "stores/store";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import Screen from "ui/components/atoms/Screen";
import { AppButton } from "ui/components/molecules/app_button/AppButton";
import ItemSplashSlider from "ui/components/organisms/view_pager/snap_items/ItemSplashSlider";
import { ViewPager } from "ui/components/organisms/view_pager/ViewPager";
import { AppLog } from "utils/Util";

interface Props {}

type NavigationProps = StackNavigationProp<
  AuthStackParamList,
  "PostSplash"
>;

export const PostSplashView = React.memo<Props>(() => {
  AppLog.log(() => "Rendering PostSplashView...");

  const navigation = useNavigation<NavigationProps>();
  const { regionData } = useAppSelector(
    (state: RootState) => state.general
  );

  const splashData = getSliderData(
    regionData?.currency_symbol! + " " + regionData?.reload
  );
  const snapItem = useCallback(({ item }: { item: SplashSliderItem }) => {
    return <ItemSplashSlider item={item} />;
  }, []);

  return (
    <Screen
      style={styles.container}
      shouldAddBottomInset={false}
      topSafeAreaAndStatusBarColor={COLORS.theme?.interface["100"]}>
      <TBC height={64} style={styles.logo} />
      <ViewPager<SplashSliderItem>
        snapView={snapItem}
        data={splashData}
        autoPlayDelay={5000}
        itemWidthRatio={0.85}
        containerStyle={styles.viewPager}
        paginationContainerStyle={{
          alignSelf: "center",
          justifyContent: "center"
        }}
      />
      <AppButton
        text={Strings.postSplash.sign_up}
        textType={TEXT_TYPE.SEMI_BOLD}
        onPress={() => navigation.navigate("SignUpMood")}
        buttonStyle={styles.signUpButton}
      />
      <View style={styles.footerContainer}>
        <AppLabel
          text={Strings.postSplash.already_member}
          textType={TEXT_TYPE.SEMI_BOLD}
        />
        <AppLabel
          text={Strings.login.sign_in}
          style={styles.signIn}
          textType={TEXT_TYPE.SEMI_BOLD}
          onPress={() => navigation.navigate("LoginMood")}
        />
      </View>
    </Screen>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: COLORS.theme?.interface["100"],
    justifyContent: "space-evenly",
    paddingVertical: SPACE.xl
  },
  logo: {},
  signIn: {
    color: COLORS.theme?.primaryColor
  },
  viewPager: {
    alignItems: "center",
    flex: 0.95
  },
  signUpButton: {
    width: undefined,
    marginHorizontal: SPACE.lg
  },
  footerContainer: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: SPACE.lg
  }
});
