import React, { FC } from "react";
import CartController from "ui/screens/home/cart/CartController";
import EditsController from "ui/screens/home/edits/EditsController";
import { HomeBottomBar, HomeBottomBarParamsList } from "./HomeBottomBar";
import Cart from "assets/images/ic_cart.svg";
import Edits from "assets/images/ic_edits.svg";
import Explore from "assets/images/ic_explore.svg";
import Invite from "assets/images/ic_invite.svg";
import More from "assets/images/ic_more.svg";
import { COLORS, SPACE } from "config";
import { Platform, StyleSheet } from "react-native";
import InviteController from "ui/screens/home/invite/InviteController";
import MoreController from "ui/screens/home/more/MoreController";
import { shadowStyleProps } from "utils/Util";
import ExploreRootController from "ui/screens/home/explore/ExploreRootController";
import { useAppSelector } from "hooks/redux";
import { RootState } from "stores/store";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = { initialParams: keyof HomeBottomBarParamsList };
export const HomeBottomBarRoutes: FC<Props> = ({ initialParams }) => {
  // AppLog.log(
  //   () => "HomeBottomBarRoutes# params : " + JSON.stringify(isFrom),
  //   TAG.VENUE
  // );

  const { notificationCount, cartCount } = useAppSelector(
    (state: RootState) => state.general
  );

  const safeAreaInset = useSafeAreaInsets();

  return (
    <HomeBottomBar.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: COLORS.theme?.interface["500"],
        headerTitleAlign: "center",
        tabBarStyle: {
          paddingBottom:
            safeAreaInset.bottom === 0 ? 5 : safeAreaInset.bottom
        },
        headerStyle: {
          backgroundColor: COLORS.theme?.interface["50"],
          ...shadowStyleProps,
          shadowOpacity: 0.2
        }
      }}
      initialRouteName={initialParams}>
      <HomeBottomBar.Screen
        name="Trending"
        component={EditsController}
        options={{
          tabBarIcon: ({ focused }) => (
            <Edits
              stroke={
                focused
                  ? COLORS.theme?.interface["900"]
                  : COLORS.theme?.interface["500"]
              }
            />
          )
        }}
      />
      <HomeBottomBar.Screen
        name="Invite"
        component={InviteController}
        options={{
          tabBarIcon: ({ focused }) => (
            <Invite
              stroke={
                focused
                  ? COLORS.theme?.interface["900"]
                  : COLORS.theme?.interface["500"]
              }
            />
          )
        }}
      />
      <HomeBottomBar.Screen
        name="Explore"
        component={ExploreRootController}
        options={{
          tabBarIcon: ({ focused }) => (
            <Explore
              stroke={
                focused
                  ? COLORS.theme?.interface["900"]
                  : COLORS.theme?.interface["500"]
              }
            />
          )
        }}
      />
      <HomeBottomBar.Screen
        name="Cart"
        component={CartController}
        options={{
          tabBarBadge:
            cartCount === 0
              ? undefined
              : (cartCount ?? 0) > 9
              ? "9+"
              : cartCount,
          tabBarBadgeStyle: styles.tabBarBadgeStyle,
          tabBarIcon: ({ focused }) => (
            <Cart
              stroke={
                focused
                  ? COLORS.theme?.interface["900"]
                  : COLORS.theme?.interface["500"]
              }
            />
          )
        }}
      />
      <HomeBottomBar.Screen
        name="More"
        component={MoreController}
        options={{
          tabBarBadge:
            notificationCount === 0
              ? undefined
              : notificationCount! > 9
              ? "9+"
              : notificationCount,
          tabBarBadgeStyle: styles.tabBarBadgeStyle,
          tabBarIcon: ({ focused }) => (
            <More
              stroke={
                focused
                  ? COLORS.theme?.interface["900"]
                  : COLORS.theme?.interface["500"]
              }
            />
          )
        }}
      />
    </HomeBottomBar.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarBadgeStyle: {
    fontSize: Platform.OS === "android" ? SPACE._2md : SPACE.sm,
    width: 23,
    height: 23,
    borderRadius: 23 / 2,
    borderWidth: 1,
    borderColor: COLORS.white,
    textAlignVertical: "center"
  }
});
