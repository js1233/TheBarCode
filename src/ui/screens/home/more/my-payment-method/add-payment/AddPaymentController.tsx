import Strings from "config/Strings";
import React, { useLayoutEffect } from "react";
import Cross from "assets/images/ic_cross.svg";
import {
  RouteProp,
  useNavigation,
  useRoute
} from "@react-navigation/native";
import HeaderLeftTextWithIcon from "ui/components/headers/header_left_text_with_icon/HeaderLeftTextWithIcon";
import HeaderTitle from "ui/components/headers/header_title/HeaderTitle";
import { AddPaymentView } from "./AddPaymentView";
import { StackNavigationProp } from "@react-navigation/stack";
import { HomeStackParamList } from "routes/HomeStack";
import { FormikValues } from "formik";
import { useGeneralApis } from "repo/general/GeneralApis";
import PaymentMethodRequestModel from "models/api_requests/PaymentMethodRequestModel";
import SimpleToast from "react-native-simple-toast";
import { usePreventDoubleTap } from "hooks";
import {
  getCardNumberType,
  getCardType
} from "models/enums/EPaymentCardType";
import useRnEncryption from "hooks/useRnEncryption";
import { SPACE } from "config";

type AddPaymentNavigationProp = StackNavigationProp<
  HomeStackParamList,
  "AddPayment"
>;
type AddPaymentScreenProp = RouteProp<HomeStackParamList, "AddPayment">;
const AddPaymentController = () => {
  const navigation = useNavigation<AddPaymentNavigationProp>();
  const route = useRoute<AddPaymentScreenProp>();
  const encryptionHelper = useRnEncryption();

  const { request: addPaymentRequest, loading } =
    useGeneralApis().addPaymentMethod;
  const onBackButtonPressed = usePreventDoubleTap(() => {
    navigation.pop();
  });
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <HeaderTitle
          text={Strings.AddAPayment.add_Payment}
          shouldTruncate={false}
        />
      ),
      headerLeft: () => (
        <HeaderLeftTextWithIcon
          onPress={onBackButtonPressed}
          icon={() => <Cross width={20} height={20} fill={"#737373"} />}
          containerStyle={{ marginLeft: SPACE.lg }}
        />
      )
    });
  }, [navigation, onBackButtonPressed]);

  const onSubmit = usePreventDoubleTap(async (_values: FormikValues) => {
    const request: PaymentMethodRequestModel = {
      type: getCardNumberType(_values.cardNumber),
      ending_in: _values.cardNumber.replace(/ /g, "").slice(-4),
      name: _values.name,
      address: _values.address,
      postcode: _values.postalcode,
      city: _values.city,
      country: _values.country.text
    };

    if (route?.params?.isOPenForSquareUp) {
      (request.type = getCardType(
        route?.params?.preFilledCard?.card?.brand
      )),
        (request.ending_in =
          route?.params?.preFilledCard?.card?.lastFourDigits),
        (request.establishment_id = route.params?.venue?.id ?? "");
      request.nonce = route?.params?.preFilledCard?.nonce;
      request.verification_token =
        route?.params?.preFilledCard?.token ?? "";
    } else {
      let result = await encryptionHelper.encrypt(
        JSON.stringify({
          name: _values.name,
          cardNumber: _values.cardNumber,
          cvc: _values.cvc,
          expiryMonth: _values.expiry.split("/")[0].trim(),
          expiryYear: _values.expiry.split("/")[1].trim()
        })
      );

      request.card_details = result;
    }

    const { hasError, dataBody, errorBody } = await addPaymentRequest(
      request
    );

    if (!hasError && dataBody !== undefined) {
      SimpleToast.show(dataBody.message);
      route.params.onAddPaymentMethod(dataBody.data);
      navigation.pop();
    } else {
      SimpleToast.show(errorBody!);
    }
  });

  return (
    <AddPaymentView
      onSubmit={onSubmit}
      shouldShowProgressBar={loading}
      isOpenForSquareUp={route?.params?.isOPenForSquareUp === true}
    />
  );
};

export default AddPaymentController;
