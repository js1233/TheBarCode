import Strings from "config/Strings";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import { TEXT_TYPE } from "ui/components/atoms/app_label/AppLabel";
import { LinkButton } from "ui/components/atoms/link_button/LinkButton";
import HeaderLeftTextWithIcon from "ui/components/headers/header_left_text_with_icon/HeaderLeftTextWithIcon";
import HeaderTitle from "ui/components/headers/header_title/HeaderTitle";
import { MyPaymentMethodView } from "./MyPaymentMethodView";
import Cross from "assets/images/ic_cross.svg";
import {
  RouteProp,
  useNavigation,
  useRoute
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { HomeStackParamList } from "routes/HomeStack";
import { COLORS, SPACE } from "config";
import { useGeneralApis } from "repo/general/GeneralApis";
import PaymentMethodRequestModel from "models/api_requests/PaymentMethodRequestModel";
import { PaymentMethod } from "models/enums/PaymentMethod";
import SimpleToast from "react-native-simple-toast";
import _ from "lodash";
import ECardType from "models/enums/ECardType";
import EPosType from "models/enums/EPosType";
import { useOrderApis } from "repo/order/OrderApis";
import { PostPaymentRequestModel } from "models/api_requests/PostPaymentRequestModel";
import { useAppDispatch, useAppSelector } from "hooks/redux";
import { RootState } from "stores/store";
import uuid from "react-native-uuid";
import EScreen from "models/enums/EScreen";
import {
  setRefreshingEvent,
  consumeRefreshCount
} from "stores/generalSlice";
import { usePreventDoubleTap } from "hooks";
import { AppLog, TAG } from "utils/Util";
import useSquipPayment from "hooks/useSquipPayment";
import { Alert, Platform } from "react-native";
import {
  CardDetails,
  Error,
  SQIPApplePay
} from "react-native-square-in-app-payments";
import HeaderRightTextWithIcon from "ui/components/headers/header_right_text_with_icon/HeaderRightTextWithIcon";
import useRnEncryption from "hooks/useRnEncryption";
import { useWorldPayApi } from "repo/world_pay/WorldPayApis";
import { WorldPayCard } from "models/api_requests/WorldPayTokenRequest";

type MyPaymentNavigationProp = StackNavigationProp<
  HomeStackParamList,
  "MyPayment"
>;

type MyPaymentRouteProp = RouteProp<HomeStackParamList, "MyPayment">;

const MyPaymentController = () => {
  const { params } = useRoute<MyPaymentRouteProp>();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const navigation = useNavigation<MyPaymentNavigationProp>();

  const encryptionHelper = useRnEncryption();

  const { refreshingEvent } = useAppSelector(
    (state: RootState) => state.general
  );

  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const [deleteItemIndex, setDeleteItemIndex] = useState<number>(-1);

  const [paymentMethodData, setPaymentMethodData] = useState<
    PaymentMethod[] | undefined
  >(undefined);

  const [applePay, setApplePay] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const { request: paymentMethodRequest, loading } =
    useGeneralApis().getPaymentMethod;

  const { request: deletePaymentMethod, loading: isLoading } =
    useGeneralApis().deletePaymentMethod;

  const getPaymentMethods = async (
    card_type: string,
    onComplete?: () => void
  ) => {
    const requestModel: PaymentMethodRequestModel = {
      card_type: card_type,
      establishment_id:
        params?.order?.establishment_id.toString() ?? undefined
    };

    const { hasError, dataBody, errorBody } = await paymentMethodRequest(
      requestModel
    );
    if (!hasError && dataBody !== undefined) {
      setPaymentMethodData(dataBody.data);
    } else {
      SimpleToast.show(errorBody!);
    }

    onComplete?.();
  };

  const deleteCard = async (cardId: number) => {
    const requestModel: PaymentMethodRequestModel = {
      id: cardId
    };
    const { hasError, dataBody, errorBody } = await deletePaymentMethod(
      requestModel
    );
    if (!hasError && dataBody !== undefined) {
      const filteredArray = paymentMethodData?.filter(
        (item) => item.id !== cardId
      );
      setPaymentMethodData(_.cloneDeep(filteredArray));
      // getPaymentMethods("worldpay");
      SimpleToast.show(dataBody.message);
    } else {
      SimpleToast.show(errorBody!);
    }
  };

  //callback from add payment methods controller
  const onAddPaymentMethod = useCallback(
    (newPaymentMethodData: any) => {
      const findItem = paymentMethodData?.find(
        (item) => item.id === newPaymentMethodData.id
      );
      if (findItem) {
        setPaymentMethodData((prev) => {
          let copiedData = _.cloneDeep(prev);
          if (copiedData) {
            let findIndex = copiedData.findIndex(
              (item) => item.id === newPaymentMethodData.id
            );
            copiedData.splice(findIndex, 1, newPaymentMethodData);
            return copiedData;
          }
          return prev;
        });
      } else {
        setPaymentMethodData((prev) => {
          if (prev) {
            return [newPaymentMethodData, ...prev];
          } else {
            return [newPaymentMethodData];
          }
        });
      }
    },
    [paymentMethodData]
  );

  const onDeletePaymentMethod = async (
    id: number,
    index: number,
    isSelected: boolean //use to set selected card for payment
  ) => {
    if (isSelected) {
      setSelectedIndex(index);
    } else {
      onConfirmDelete(id, index);
    }
  };

  const onConfirmDelete = (id: number, index: number) => {
    return Alert.alert(
      "Are your sure?",
      "Are you sure you want to delete this card?",
      [
        {
          text: "Yes",
          onPress: () => {
            setDeleteItemIndex(index ?? -1);
            deleteCard(id);
          }
        },
        {
          text: "No"
        }
      ]
    );
  };

  useEffect(() => {
    getPaymentMethods(params?.cardType ?? "worldpay");

    if (params?.order?.epos_type === EPosType.SQUARE_UP) {
      squip.initSquip(params?.order, user!);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  ////////////////////////////////////////////////World pay token api/////////////////////////////////

  const { request: worldPayTokenRequest } = useWorldPayApi().getToken;

  const callWorldPayTokenApi = async (
    clientKey: string,
    result: WorldPayCard,
    _request: PaymentMethod
  ) => {
    const { hasError, dataBody, errorBody } = await worldPayTokenRequest({
      clientKey: clientKey,
      reusable: true,
      paymentMethod: { type: "Card", ...result }
    });

    if (!hasError && dataBody !== undefined) {
      _request.token = dataBody.token;
      handlePostPaymentApi(_request);
    } else {
      SimpleToast.show(errorBody!);
    }
  };
  ////////////////////////////////////////////////World pay token api end/////////////////////////////

  const refreshCallback = (onComplete?: () => void) => {
    setSelectedIndex(0);
    if (onComplete === undefined) {
      setPaymentMethodData(undefined);
    }
    getPaymentMethods(params?.cardType ?? "worldpay", onComplete);
  };

  const onContinueButtonPress = usePreventDoubleTap(() => {
    let findSelectedCard = paymentMethodData?.find(
      (__, index) => index === selectedIndex
    );

    if (findSelectedCard) {
      if (params?.order?.epos_type === EPosType.SQUARE_UP) {
        //verify buyer from square up sdk
        squip.startBuyerVerifiction(
          findSelectedCard,
          onBuyerVerificationSuccess
        );
      } else {
        //post payment
        if (findSelectedCard.token) {
          handlePostPaymentApi(findSelectedCard);
        } else {
          encryptionHelper
            .decrypt(findSelectedCard.card_details ?? "")
            .then((value: string) => {
              callWorldPayTokenApi(
                params?.order?.establishment?.worldpay_client_key ?? "",
                JSON.parse(value),
                findSelectedCard!
              );
            })
            .catch((_err) =>
              SimpleToast.show(
                "We are unable to process the card, please try to add this card again."
              )
            );
        }
      }
    } else {
      //psNewCard instance
      navigation.navigate("PsNewCard", {
        order: params?.order,
        splitPayment: params?.splitPayment
      });
    }
  });
  ////////////////////////////////////////Order API's///////////////////////////////////////////

  const navigateToPaymentAuth = useCallback(
    (request: JSON) => {
      navigation.navigate("WpVerification", { data: request });
    },
    [navigation]
  );

  const { request: postPaymentApi, loading: _isLoading } =
    useOrderApis().postPayment;

  let sessionId = useRef<string>(String(uuid.v4()));
  const handlePostPaymentApi = useCallback(
    async (card?: PaymentMethod | undefined, appleNonce?: string) => {
      if (_isLoading) {
        return;
      }

      sessionId.current = String(uuid.v4());

      const postPaymentRequestModel: PostPaymentRequestModel = {
        card_uid: card?.id?.toString() ?? undefined,
        session_id: sessionId.current,
        order_id: params?.order?.id?.toString(),
        token: card?.token ?? appleNonce ?? "",
        voucher_id: params?.order?.voucher?.id?.toString() ?? undefined,
        split_type: params?.splitPayment?.split_type ?? undefined,
        value: params?.splitPayment?.amount?.toString() ?? undefined,
        offer_id: params?.order?.offer?.id?.toString() ?? undefined,
        offer_type: params?.order?.offer?.type?.toString() ?? undefined,
        use_credit: params?.order?.offer?.user_credit ? "true" : undefined,
        verification_token: card?.verification_token ?? undefined
      };

      const { hasError, dataBody, errorBody, statusCode } =
        await postPaymentApi(postPaymentRequestModel);
      setApplePay(false);
      if (statusCode === 428) {
        //on authentication required
        navigateToPaymentAuth(errorBody as unknown as JSON);
        return;
      }

      if (!hasError && dataBody !== undefined) {
        //fire order created event
        dispatch(
          setRefreshingEvent({
            ORDER_CREATED_EVENT: { createdOrder: params?.order }
          })
        );
        dispatch(consumeRefreshCount());
      } else {
        SimpleToast.show(errorBody!);
      }
    },
    [_isLoading, dispatch, navigateToPaymentAuth, params, postPaymentApi]
  );

  const { request: updatePaymentApi, loading: __isLoading } =
    useOrderApis().updatePayment;

  const updatePayment = useCallback(
    async (authenticatedCard: any, secureCode: string) => {
      const updatePaymentRequestModel: PostPaymentRequestModel = {
        use_credit: params?.order?.offer?.user_credit ? "true" : undefined,
        session_id: sessionId.current ?? "",
        payment_code: authenticatedCard.payment_code ?? "",
        order_id: params?.order?.id.toString(),
        secure_code: secureCode ?? ""
      };

      const { hasError, dataBody, errorBody } = await updatePaymentApi(
        updatePaymentRequestModel
      );

      if (!hasError && dataBody !== undefined) {
        //fire order created event
        dispatch(
          setRefreshingEvent({
            ORDER_CREATED_EVENT: { createdOrder: params?.order }
          })
        );
      } else {
        SimpleToast.show(errorBody!);
      }

      dispatch(consumeRefreshCount());
    },
    [dispatch, params, updatePaymentApi]
  );

  ////////////////////////////////////////Order API's///////////////////////////////////////////

  //////////////////SQUARE UP PAYMENT //////////////////////////////
  const onCardEntrySuccess = useCallback(
    async (cardDetails: any) => {
      AppLog.log(
        () => "onCardEntrySuccess#" + JSON.stringify(cardDetails),
        TAG.SQUARE_UP
      );

      navigation.navigate("AddPayment", {
        onAddPaymentMethod: onAddPaymentMethod,
        isOPenForSquareUp: true,
        preFilledCard: cardDetails,
        venue: params?.order?.establishment
      });
    },
    [navigation, onAddPaymentMethod, params?.order?.establishment]
  );

  const onBuyerVerificationSuccess = (card: PaymentMethod | undefined) => {
    handlePostPaymentApi(card);
  };

  const onBuyerVerificationFailure = () => {
    AppLog.log(() => "onBuyerVerificationFailure#", TAG.SQUARE_UP);
    SimpleToast.show(Strings.common.some_thing_bad_happened);
  };

  const onCardEntryCancel = () => {
    AppLog.log(() => "onCardEntryCancel", TAG.SQUARE_UP);
  };

  const squip = useSquipPayment(
    onBuyerVerificationFailure,
    onCardEntryCancel
  );

  //Apple Pay with Square
  const onApplePayPress = () => {
    const successCallback = async (cardDetails: CardDetails) => {
      AppLog.log(
        () => "onApplePay Success" + JSON.stringify(cardDetails),
        TAG.SQUARE_UP
      );
      await SQIPApplePay.completeApplePayAuthorization(true);
      setApplePay(true);
      handlePostPaymentApi(undefined, cardDetails.nonce);
    };

    const failureCallback = async (error: Error) => {
      AppLog.log(
        () => "onApple pay failureCallback" + error,
        TAG.SQUARE_UP
      );
      await SQIPApplePay.completeApplePayAuthorization(
        false,
        error.message
      );
    };

    const onComplete = async () => {
      AppLog.log(() => "onApple pay Complete", TAG.SQUARE_UP);
      await SQIPApplePay.completeApplePayAuthorization(
        false,
        Strings.common.some_thing_bad_happened
      );
    };

    if (params?.order) {
      squip.startApplePayAuthorization(
        params!.order,
        successCallback,
        failureCallback,
        onComplete
      );
    }
  };
  /////////////////SQUARE UP PAYMENT END//////////////////////////////////

  //////////////////////////////Complete Order Flow///////////////////////
  const completeOrderFlow = useCallback(() => {
    navigation.navigate("Home");
    navigation.navigate("OrderDetails", {
      order_id: params?.order?.id,
      isFrom: EScreen.PAYMENT,
      order: params.order
    });
  }, [navigation, params?.order]);

  useEffect(() => {
    if (refreshingEvent?.PAYMENT_SENSE_CARD_SUCCESS) {
      completeOrderFlow();
    } else if (refreshingEvent?.WORLD_PAY_VERIFICATION_RESPONSE) {
      dispatch(consumeRefreshCount());
      updatePayment(
        refreshingEvent.WORLD_PAY_VERIFICATION_RESPONSE.authenticatedCard,
        refreshingEvent.WORLD_PAY_VERIFICATION_RESPONSE.status
      );
    } else if (refreshingEvent?.ORDER_CREATED_EVENT) {
      completeOrderFlow();
    }
  }, [completeOrderFlow, dispatch, refreshingEvent, updatePayment]);

  /////////////////////////////Complete Order Flow End////////////////////

  //add card button handling
  const openAddPaymentMethod = useCallback(() => {
    if (params?.cardType === ECardType.PAYMENT_SENSE) {
      navigation.navigate("PsNewCard", {
        order: params?.order,
        splitPayment: params.splitPayment ?? undefined
      });
    } else if (params?.order?.epos_type === EPosType.SQUARE_UP) {
      squip.startCardActivity(onCardEntrySuccess);
    } else {
      navigation.navigate("AddPayment", {
        onAddPaymentMethod: onAddPaymentMethod
      });
    }
  }, [navigation, onAddPaymentMethod, onCardEntrySuccess, params, squip]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <HeaderTitle
          text={
            params?.order
              ? Strings.MyPayment.title2
              : Strings.MyPayment.title
          }
          shouldTruncate={false}
        />
      ),
      headerLeft: () => (
        <HeaderLeftTextWithIcon
          onPress={() => navigation.pop()}
          icon={() => <Cross width={20} height={20} fill={"#737373"} />}
          containerStyle={{ marginLeft: SPACE.lg }}
        />
      ),
      headerRight: () =>
        !params?.order ? (
          <LinkButton
            textType={TEXT_TYPE.SEMI_BOLD}
            numberOfLines={0}
            text={Strings.MyPayment.header_right_button}
            viewStyle={{ marginRight: SPACE.xs }}
            onPress={openAddPaymentMethod}
          />
        ) : (
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
        )
    });
  }, [
    navigation,
    onAddPaymentMethod,
    openAddPaymentMethod,
    params?.order
  ]);

  return (
    <MyPaymentMethodView
      paymentMethodData={paymentMethodData!}
      shouldShowProgressBar={loading}
      onDeletePaymentMethod={onDeletePaymentMethod}
      deleteItemIndex={deleteItemIndex}
      shouldShowProgressBarOnDelete={isLoading}
      order={params?.order}
      selectedIndex={selectedIndex}
      openAddAddress={openAddPaymentMethod}
      refreshCallback={refreshCallback}
      onContinueButtonPress={onContinueButtonPress}
      continueButtonProgress={
        (_isLoading || __isLoading) && applePay === false
      }
      showApplePay={
        params?.order?.epos_type === EPosType.SQUARE_UP &&
        Platform.OS === "ios" &&
        params?.order?.establishment?.is_apple_pay_enabled === true
      }
      onApplePayPress={onApplePayPress}
      applePayLoader={applePay}
      openTermsScreen={() => {
        navigation.navigate("StaticContent");
      }}
    />
  );
};

export default MyPaymentController;
