import React, { FC, useLayoutEffect } from "react";
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
import WebView, { WebViewNavigation } from "react-native-webview";
import { Screen } from "react-native-screens";
import { API } from "config";
import { useAppDispatch } from "hooks/redux";
import { setRefreshingEvent } from "stores/generalSlice";
import { Platform } from "react-native";

type Props = {};
type HomeNavigationProp = StackNavigationProp<
  HomeStackParamList,
  "WpVerification"
>;
type UpdateProfileRouteProp = RouteProp<
  HomeStackParamList,
  "WpVerification"
>;
const PaymentAuthController: FC<Props> = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  const route = useRoute<UpdateProfileRouteProp>();
  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: "center",
      headerTitle: () => <HeaderTitle text="Authentication" />,
      headerLeft: () => (
        <HeaderLeftTextWithIcon
          onPress={() => navigation.pop()}
          icon={() => <Cross width={20} height={20} fill={"#737373"} />}
        />
      )
    });
  }, [navigation]);

  const onNavigationStateChange = (navigationState: WebViewNavigation) => {
    if (
      navigationState.url.includes(API.WORLD_PAY_3D_RESPONSE_SCHEME) &&
      navigationState?.url?.includes("PaRes=")
    ) {
      let data = navigationState.url.split("PaRes=");

      if (data && data?.length > 1) {
        dispatch(
          setRefreshingEvent({
            WORLD_PAY_VERIFICATION_RESPONSE: {
              authenticatedCard: route?.params?.data ?? "",
              status: data[1]
            }
          })
        );
      }
      navigation.goBack();
    }
  };

  const onShouldStartLoadWithRequest = (
    navigationState: WebViewNavigation
  ) => {
    if (navigationState.url.includes(API.WORLD_PAY_3D_RESPONSE_SCHEME)) {
      if (Platform.OS === "ios") {
        if (
          navigationState.url.includes(API.WORLD_PAY_3D_RESPONSE_SCHEME) &&
          navigationState?.url?.includes("PaRes=")
        ) {
          let data = navigationState.url.split("PaRes=");

          if (data && data?.length > 1) {
            dispatch(
              setRefreshingEvent({
                WORLD_PAY_VERIFICATION_RESPONSE: {
                  authenticatedCard: route?.params?.data ?? "",
                  status: data[1]
                }
              })
            );
          }
          navigation.goBack();
        }
      }
      return false;
      // setTimeout(() => dispatch(consumeRefreshCount()), 200);
    }
    return true;
  };

  return (
    <Screen style={{ flex: 1 }}>
      <WebView
        source={{
          uri: route.params?.data?.redirect_url,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: `${encodeURIComponent("TermUrl")}=${encodeURIComponent(
            API.WORLD_PAY_TERM_URL
          )}&${encodeURIComponent("PaReq")}=${encodeURIComponent(
            route.params?.data?.secure_request
          )}`,
          method: "POST"
        }}
        originWhitelist={["*"]}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scalesPageToFit={false}
        onNavigationStateChange={onNavigationStateChange}
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
      />
    </Screen>
  );
};

export default PaymentAuthController;
