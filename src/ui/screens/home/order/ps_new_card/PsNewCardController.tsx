import React, { FC, useLayoutEffect, useState } from "react";
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
import Screen from "ui/components/atoms/Screen";
import { API } from "config";
import { useAppDispatch, useAppSelector } from "hooks/redux";
import { RootState } from "stores/store";
import { AppLog, TAG } from "utils/Util";
import Env from "envs/env";
import {
  setRefreshingEvent,
  consumeRefreshCount
} from "stores/generalSlice";
import EScreen from "models/enums/EScreen";

type Props = {};
type PsCardNavigation = StackNavigationProp<
  HomeStackParamList,
  "PsNewCard"
>;
type PsCardRouteProp = RouteProp<HomeStackParamList, "PsNewCard">;
const PsNewCardController: FC<Props> = () => {
  const { user } = useAppSelector((state: RootState) => state.auth);
  const navigation = useNavigation<PsCardNavigation>();
  const route = useRoute<PsCardRouteProp>();
  const [url, setUrl] = useState<String | undefined>();
  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: "center",
      headerTitle: () => <HeaderTitle text={"Add a Card"} />,
      headerLeft: () => (
        <HeaderLeftTextWithIcon
          onPress={() => navigation.pop()}
          icon={() => <Cross width={20} height={20} fill={"#737373"} />}
        />
      )
    });
  }, [navigation]);

  useLayoutEffect(() => {
    let order = route.params.order;

    let uri = `${API.BASE_URL}${API.ADD_CARD_PAYMENT_SENSE}?source=mobile&orderId=${order?.id}&isLightTheme=true`;

    if (order?.voucher) {
      uri = uri + `&voucherId=${order.voucher.id}`;
    }

    if (route?.params?.splitPayment) {
      uri =
        uri +
        `&splitType=${
          route?.params?.splitPayment?.split_type ?? undefined
        }&value=${
          route?.params?.splitPayment?.amount?.toString() ?? undefined
        }`;
    }

    if (order?.offer) {
      uri =
        uri +
        `&offerId=${order.offer.id}&offerType=${
          order.offer.type ?? "exclusive"
        }`;

      if (order.offer?.user_credit) {
        uri = uri + `&useCredit=true`;
      }
    }

    setUrl(uri);
  }, [route.params.order, route.params?.splitPayment, user?.access_token]);

  // const WebViewComponent = withJavascriptInterface(
  //   {
  //     getData(value: string) {
  //       console.log("get data url " + url);
  //       console.log("get data called " + value);
  //       console.log("get data called " + user?.access_token);

  //       return user?.access_token;
  //     }
  //   },
  //   "MobileJSInterface"
  // )(WebView);

  const onNavigationStateChange = (navigationState: WebViewNavigation) => {
    AppLog.log(
      () => "navigationState " + JSON.stringify(navigationState.url),
      TAG.ORDERS
    );
    let _url = navigationState.url.split("?")[0];

    if (
      _url ===
      `${Env.BASE_URL}venue/${route.params.order?.establishment.id}/order/${route.params.order?.id}`
    ) {
      dispatch(
        setRefreshingEvent({
          PAYMENT_SENSE_CARD_SUCCESS: EScreen.PAYMENT_SENSE_CARD_SUCCESS
        })
      );
      setTimeout(() => dispatch(consumeRefreshCount()), 200);
    }
  };

  const INJECTED_JAVASCRIPT = `(function() {
    // window.console.log = document.write
    // document.write('1', typeof window.postMessage)
    // setInterval(() => {document.write(typeof errorMessage !== 'undefined' ? errorMessage : 'undefined' + '1<br>')}, 1000)
    //setInterval(() => {window.postMessage({key : "${user?.access_token}"});}, 1000)
    //document.write($)
   // $(document).ready(()=>{document.write('1')})
   // window.addEventListener('DOMContentLoaded', (event) => { document.write('1'); window.postMessage({key : "${user?.access_token}"}); })
    setTimeout(()=> { window.postMessage({key : "${user?.access_token}"}) },3000 );
    // document.write('hello', "${user?.access_token}")
  })();`;

  return (
    <Screen style={{ flex: 1 }}>
      {url && (
        <WebView
          originWhitelist={["*"]}
          source={{
            uri: url!
          }}
          injectedJavaScript={INJECTED_JAVASCRIPT}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          scalesPageToFit={false}
          onNavigationStateChange={onNavigationStateChange}
          onMessage={(e) =>
            AppLog.log(() => "onMessage " + JSON.stringify(e), TAG.ORDERS)
          }
        />
      )}
    </Screen>
  );
};

export default PsNewCardController;
