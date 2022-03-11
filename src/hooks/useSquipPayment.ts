import { User } from "models/api_responses/SignInApiResponseModel";
import { PaymentMethod } from "models/enums/PaymentMethod";
import { checkoutPrice, Order } from "models/Order";
import { useCallback, useRef } from "react";
import { Platform } from "react-native";
import SimpleToast from "react-native-simple-toast";
import {
  SQIPCardEntry,
  SQIPCore,
  SQIPApplePay,
  CardDetails,
  Error
} from "react-native-square-in-app-payments";
import { AppLog, TAG } from "utils/Util";

export default (
  onBuyerVerificationFailure: () => void,
  onCardEntryCancel: () => void
) => {
  let cardEntryConfig = useRef<any>({});

  const initSquip = useCallback(async (order: Order, user: User) => {
    await SQIPCore.setSquareApplicationId(
      order?.establishment.square_app_id ?? ""
    );

    cardEntryConfig.current = {
      collectPostalCode: true,
      squareLocationId: order?.establishment?.location_id ?? "",
      buyerAction: "Store",
      amount: order?.total,
      currencyCode: "GBP",
      givenName: user?.full_name,
      countryCode: "GB"
    };
    if (Platform.OS === "ios") {
      initApplePay(
        "merchant.com.cygnismedia.thebarcodeapp.squareup",
        (code: string) => {
          if (code === "failed") {
            SimpleToast.show("Apple pay not supported");
            return;
          }
        }
      );
    }
  }, []);

  const startCardActivity = async (
    onBuyerVerificationSuccess: (card?: any) => void
  ) => {
    await SQIPCardEntry.startCardEntryFlowWithBuyerVerification(
      cardEntryConfig.current,
      onBuyerVerificationSuccess,
      onBuyerVerificationFailure,
      onCardEntryCancel
    );
  };

  const startBuyerVerifiction = async (
    card: PaymentMethod,
    onBuyerVerificationSuccess: (card?: PaymentMethod) => void
  ) => {
    (cardEntryConfig.current.addressLines = card?.address
      ? [card?.address]
      : undefined),
      (cardEntryConfig.current.city = card?.city ?? undefined),
      (cardEntryConfig.current.postalCode = card?.postcode ?? undefined);
    cardEntryConfig.current.buyerAction = "Charge";

    const onBuyerVerificationSuccessFull = (_card: any) => {
      card!.verification_token = _card.token;
      onBuyerVerificationSuccess(card);
    };

    await SQIPCardEntry.startBuyerVerificationFlow(
      card!.token ?? "",
      cardEntryConfig.current,
      onBuyerVerificationSuccessFull,
      onBuyerVerificationFailure,
      onCardEntryCancel
    );
  };

  const initApplePay = async (
    merchantId: string,
    callback: (code: string) => void
  ) => {
    let result = await SQIPApplePay.canUseApplePay();
    if (result) {
      await SQIPApplePay.initializeApplePay(merchantId);

      callback("success");
    } else {
      callback("failed");
    }
  };

  const startApplePayAuthorization = async (
    order: Order,
    successCallback: (cardDetails: CardDetails) => void,
    failureCallback: (error: Error) => void,
    onComplete: () => void
  ) => {
    try {
      await SQIPApplePay.requestApplePayNonce(
        {
          price: `${checkoutPrice(order).toFixed(2)}`,
          summaryLabel: "Apple Pay",
          countryCode: "GB",
          currencyCode: order?.establishment.currency_code ?? "GBP"
        },
        successCallback,
        failureCallback,
        onComplete
      );
    } catch (ex) {
      AppLog.log(() => "requestApplePayNonce catch" + ex, TAG.SQUARE_UP);
    }
  };

  return {
    initSquip,
    startCardActivity,
    startBuyerVerifiction,
    initApplePay,
    startApplePayAuthorization
  };
};
