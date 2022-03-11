/* eslint-disable @typescript-eslint/no-unused-vars */
import { InAppPurchaseRequestModel } from "models/api_requests/InAppPurchaseRequestModel";
import { useCallback, useEffect, useRef } from "react";
import { Platform } from "react-native";
import RNIap, {
  InAppPurchase,
  purchaseUpdatedListener,
  purchaseErrorListener,
  useIAP
} from "react-native-iap";
import SimpleToast from "react-native-simple-toast";
import { useGeneralApis } from "repo/general/GeneralApis";
import { useAppDispatch } from "hooks/redux";
import {
  setRefreshingEvent,
  consumeRefreshCount
} from "stores/generalSlice";
import EScreen from "models/enums/EScreen";
import { AppLog, TAG } from "./Util";
import Strings from "config/Strings";
import { usePreventDoubleTap } from "hooks";

export default () => {
  const {
    connected,
    products,
    getProducts,
    requestPurchase,
    currentPurchase
  } = useIAP();

  let purchaseUpdateReceipt = useRef<any>();
  let isConnected = useRef<any>();
  let productID = useRef<string>("");
  let venueID = useRef<string>("");
  const iOSbundle: string = "com.cygnismedia.thebarcodeapp";
  const dispatch = useAppDispatch();

  const availableProducts: string[] =
    Platform.OS === "ios"
      ? [
          iOSbundle + "." + "reload",
          iOSbundle + "." + "unlimitedredemption"
        ]
      : ["reload_for_one_euro_temp", "unlimited_redemption"];

  const requestModel = useRef<InAppPurchaseRequestModel>({
    token: ""
  });

  const { request: inAppPurchase, loading } =
    useGeneralApis().makeInAppPurchase;
  const { request: subscriptionPurchase, loading: subscriptionLoading } =
    useGeneralApis().subscription;

  const onSuccessfulRedemption = useCallback(() => {
    dispatch(
      setRefreshingEvent({
        SUCCESSFULL_PURCHASE: {
          bar_id: venueID.current
        },
        REFRESH_APIS_EXPLORE_SCREEN: [
          EScreen.RELOAD_BANNER,
          EScreen.VENUE_DETAIL,
          EScreen.VENUES_LIST
        ]
      })
    );
    dispatch(consumeRefreshCount());
  }, [dispatch, venueID]);

  const getInAppPurchaseConfirmation = usePreventDoubleTap(
    useCallback(
      async (token: string, establishment_id: string) => {
        requestModel.current.establishment_id = establishment_id;
        requestModel.current.token = token;
        const { hasError, dataBody, errorBody } = await inAppPurchase(
          requestModel.current
        );
        AppLog.log(
          () =>
            "getInAppPurchaseConfirmation=>" +
            JSON.stringify(dataBody) +
            "error=>" +
            errorBody,
          TAG.IN_APP_PURCHASE
        );
        if (!hasError && dataBody !== undefined) {
          SimpleToast.show(dataBody.message);
          onSuccessfulRedemption();
        } else {
          // SimpleToast.show(errorBody!);
        }
        venueID.current = "";
        productID.current = "";
      },
      [inAppPurchase, onSuccessfulRedemption]
    )
  );

  const getSubscriptionConfirmation = usePreventDoubleTap(
    useCallback(
      async (token: string) => {
        const { hasError, dataBody, errorBody } =
          await subscriptionPurchase({
            token: token
          });
        AppLog.log(
          () =>
            "getSubscriptionConfirmation=>" +
            dataBody +
            "error=>" +
            errorBody,
          TAG.IN_APP_PURCHASE
        );
        if (!hasError && dataBody !== undefined) {
          SimpleToast.show(dataBody.message);
          onSuccessfulRedemption();
        } else {
          // SimpleToast.show(errorBody!);
        }
        venueID.current = "";
        productID.current = "";
      },
      [onSuccessfulRedemption, subscriptionPurchase]
    )
  );

  const initConnection = async () => {
    try {
      isConnected.current = await RNIap.initConnection();
      AppLog.log(() => "init connection", TAG.IN_APP_PURCHASE);
      if (Platform.OS === "android") {
        await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
      } else {
        await RNIap.clearTransactionIOS();
      }
    } catch (err) {
      AppLog.log(() => "error init connection" + err, TAG.IN_APP_PURCHASE);
    }
  };

  const removeConnections = () => {
    purchaseUpdateReceipt.current = null;
    isConnected.current = null;
    RNIap.endConnection();
  };

  const purchaseRequestedItem = useCallback(async () => {
    AppLog.log(
      () => "calling purchaseRequestedItem function",
      TAG.IN_APP_PURCHASE
    );
    purchaseUpdateReceipt.current = purchaseUpdatedListener(
      async (purchase: InAppPurchase) => {
        AppLog.log(
          () => "purchase " + JSON.stringify(purchase),
          TAG.IN_APP_PURCHASE
        );
        const receipt = purchase.transactionReceipt;
        AppLog.log(() => "receipt " + receipt, TAG.IN_APP_PURCHASE);
        if (receipt) {
          try {
            // async () => {
            AppLog.log(
              () =>
                "\n DATA -> " +
                purchase.transactionId +
                "\n productID" +
                productID.current +
                "\n venueID" +
                venueID.current,
              TAG.IN_APP_PURCHASE
            );
            if (purchase.productId === productID.current) {
              if (purchase.transactionReceipt) {
                if (venueID.current !== "") {
                  getInAppPurchaseConfirmation(
                    Platform.OS === "ios"
                      ? purchase.transactionId
                      : purchase.purchaseToken!,
                    venueID.current
                  );
                } else {
                  getSubscriptionConfirmation(
                    Platform.OS === "ios"
                      ? purchase.transactionId
                      : purchase.purchaseToken!
                  );
                }
              }
            }
            await RNIap.finishTransaction(purchase, true).catch((err) => {
              AppLog.log(
                () => "finishTransaction error" + err,
                TAG.IN_APP_PURCHASE
              );
            });
            // };
          } catch (ackErr) {
            AppLog.log(() => "ackErr" + ackErr, TAG.IN_APP_PURCHASE);
          }
        } else {
          AppLog.log(() => "unable to fetch recipt", TAG.IN_APP_PURCHASE);
        }
      }
    );

    purchaseErrorListener((err) => {
      // SimpleToast.show(err.message!);
      AppLog.log(
        () => "purchaseErrorListener" + err.message!,
        TAG.IN_APP_PURCHASE
      );
    });
  }, [getInAppPurchaseConfirmation, getSubscriptionConfirmation]);

  useEffect(() => {
    if (!connected) {
      initConnection();
    }
  }, [connected]);

  useEffect(() => {
    AppLog.log(
      () => "calling purchaseRequestedItem useEffect",
      TAG.IN_APP_PURCHASE
    );
    if (productID.current !== "") {
      if (connected) {
        purchaseRequestedItem();
      } else {
        initConnection().then(() => {
          purchaseRequestedItem();
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPurchase, purchaseUpdatedListener]);

  const getPurchasedProducts = useCallback(async () => {
    // if (connected) {
    //   const purchasedProducts = await getPurchaseHistory();
    //   purchasedProducts.forEach(async (product) => {
    //     await finishTransaction(product, true)
    //       .catch((_) => {})
    //       .then(() => {});
    //   });
    // }
  }, []);

  const fetchProducts = useCallback(async () => {
    AppLog.log(() => "calling fetchProducts", TAG.IN_APP_PURCHASE);
    if (connected) {
      await getProducts(availableProducts).catch((err) => {
        AppLog.log(
          () => "error while fetching products" + err,
          TAG.IN_APP_PURCHASE
        );
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const purchaseProduct = useCallback(
    async (isReload: boolean, venue_id: string) => {
      AppLog.log(() => "calling purchaseProduct", TAG.IN_APP_PURCHASE);
      try {
        productID.current = availableProducts[isReload ? 0 : 1];
        venueID.current = venue_id;
        // if (!connected) {
        initConnection()
          .then(() => {
            purchaseRequestedItem();
            requestPurchase(availableProducts[isReload ? 0 : 1], false);
          })
          .catch(() => {
            SimpleToast.show(Strings.common.some_thing_bad_happened);
          });
        // } else {
        //   requestPurchase(availableProducts[isReload ? 0 : 1]);
        // }
      } catch (err) {
        AppLog.log(() => "error fetching" + err, TAG.IN_APP_PURCHASE);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [connected]
  );

  return {
    fetchProducts,
    products,
    purchaseProduct,
    getPurchasedProducts,
    initConnection,
    removeConnections,
    loading,
    subscriptionLoading
  };
};
