import { MemberDiscountView } from "./MemberDiscountView";
import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import { HomeStackParamList } from "routes/HomeStack";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  RouteProp,
  useNavigation,
  useRoute
} from "@react-navigation/native";
import HeaderLeftTextWithIcon from "ui/components/headers/header_left_text_with_icon/HeaderLeftTextWithIcon";
import HeaderTitle from "ui/components/headers/header_title/HeaderTitle";
import { COLORS, SPACE } from "config";
import LeftArrow from "assets/images/left.svg";
import Strings from "config/Strings";
import { useGeneralApis } from "repo/general/GeneralApis";
import { OptionsData } from "models/OptionsData";
import { OrderOffer } from "models/api_responses/OfferDetailsResponseModel";
import { Order } from "models/Order";
import EPosType from "models/enums/EPosType";
import ECardType from "models/enums/ECardType";
import EPaymentGateway from "models/enums/EPaymentGateway";
import _ from "lodash";
import { usePreventDoubleTap } from "hooks";
import HeaderRightTextWithIcon from "ui/components/headers/header_right_text_with_icon/HeaderRightTextWithIcon";
import { TEXT_TYPE } from "ui/components/atoms/app_label/AppLabel";

export type MemberDiscountNavigation = StackNavigationProp<
  HomeStackParamList,
  "MemberDiscount"
>;

type MemberDiscountRoute = RouteProp<HomeStackParamList, "MemberDiscount">;

const MemberDiscountController = () => {
  const [offersMessage, setOffersMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [isReloadRequired, setReloadRequired] = useState<boolean>(false);
  const navigation = useNavigation<MemberDiscountNavigation>();
  const { params } = useRoute<MemberDiscountRoute>();
  let order = params?.order;
  if (params?.splitPayment) {
    order.payment_split = [params?.splitPayment];
  }
  const { request: offerDetailRequest, loading } =
    useGeneralApis().getOrderOffers;
  let offerDetailData = [{ value: "Not this time", text: "none" }];
  const [offerDetailsData, setOfferDetailsData] = useState<OptionsData[]>(
    []
  );
  const offers = useRef<OrderOffer[]>([]);
  const onBackButtonPressed = usePreventDoubleTap(() => {
    navigation.goBack();
  });
  useLayoutEffect(() => {
    navigation.setOptions({
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
              ?.routes?.find((route) => route.name === "MyCart");

            if (findItem) {
              navigation.navigate("MyCart", { ...findItem.params });
            } else {
              navigation.navigate("Home");
            }
          }}
        />
      ),
      headerTitle: () => (
        <HeaderTitle text={Strings.memberDiscount.title} />
      )
    });
  }, [navigation, onBackButtonPressed]);

  const getOrderOfferDetail = async () => {
    const { hasError, dataBody, errorBody } = await offerDetailRequest({
      establishment_id: params.order.establishment.id
    });
    if (!hasError && dataBody !== undefined) {
      dataBody.data.map((data: OrderOffer) =>
        offerDetailData.push({
          value: data.text,
          text: data.value.toString()
        })
      );

      offers!.current! = dataBody.data;
      setOfferDetailsData(offerDetailData);

      let willUseCreditMessage: string | null = null;
      if (dataBody.message !== "Success.") {
        willUseCreditMessage = dataBody.message;
      }
      setOffersMessage(willUseCreditMessage);
      setIsError(false);

      // dataBody.data.forEach((offer) => {
      //   offer.user_credit = willUseCreditMessage !== null;
      // });
    } else {
      setOffersMessage(errorBody ?? null);
      setIsError(true);
      setOfferDetailsData(offerDetailData);
      if (errorBody?.includes("Please reload to redeem offers here.")) {
        setReloadRequired(true);
      }
    }
  };
  useEffect(() => {
    getOrderOfferDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPress = (_order: Order) => {
    navigation.navigate("MyPayment", {
      order: _order,
      cardType:
        _order?.epos_type === EPosType.SQUARE_UP
          ? ECardType.SQUARE_UP
          : _order.establishment?.payment_gateway_type ===
            EPaymentGateway.PAYMENT_SENSE
          ? ECardType.PAYMENT_SENSE
          : ECardType.WORLD_PAY,
      splitPayment: params?.splitPayment ?? undefined
    });
  };

  const onReloadClick = () => {
    navigation.navigate("Reload");
  };

  return (
    <MemberDiscountView
      offerDetailsData={offerDetailsData}
      order={_.cloneDeep(order)}
      onPress={onPress}
      offersMessage={offersMessage}
      isError={isError}
      isReloadRequired={isReloadRequired}
      onReloadClick={onReloadClick}
      offers={offers.current}
      isLoading={loading}
    />
  );
};
export default MemberDiscountController;
