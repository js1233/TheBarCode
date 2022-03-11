import { StackNavigationProp } from "@react-navigation/stack";
import { COLORS, FONT_SIZE, STRINGS } from "config";
import Strings from "config/Strings";
import { useAppDispatch } from "hooks/redux";
import { RedeemDealRequestModel } from "models/api_requests/RedeemDealRequestModel";
import {
  getStartInMillis,
  isDealActive,
  isExpired
} from "models/DateTime";
import EOfferType from "models/enums/EOfferType";
import EOutOfCredit from "models/enums/EOutOfCredit";
import { Offer } from "models/Offer";
import {
  getStandardOfferColor,
  isBarOperatesToday,
  isBarUnlimitedRedemptionToday,
  Venue
} from "models/Venue";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle
} from "react-native";
import SimpleToast from "react-native-simple-toast";
import { useGeneralApis } from "repo/general/GeneralApis";
import { HomeStackParamList } from "routes/HomeStack";
import {
  consumeRefreshCount,
  setRefreshingEvent
} from "stores/generalSlice";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import { AppButton } from "ui/components/molecules/app_button/AppButton";
import { AppLog, convertMilisecondsToSeconds, TAG } from "utils/Util";
import Timer from "../reload_banner/Timer";
import DialogOutOfCredit from "./DialogOutOfCredit";
import DialogRedeemDeal from "./DialogRedeemDeal";
import CustomAppDialog, {
  BUTTONS_DIRECTION
} from "ui/components/organisms/app_dialogs/CustomAppDialog";
import EScreen from "models/enums/EScreen";
import ESupportedOrderType from "models/enums/ESupportedOrderType";
import { BarMenu, isBasicBogo, supportedOrderTypes } from "models/BarMenu";
import useBasicBogoApiHandler from "hooks/useBasicBogoApiHandler";

type Props = {
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  offer: Offer;
  venue: Venue;
  navigation: StackNavigationProp<
    HomeStackParamList,
    keyof HomeStackParamList
  >;
  type?: string;
  buttonPressedCallback?: (pressed: boolean) => void;
};

//EOfferType.STANDARD && EOfferType.VOUCHER
function RedeemDealButton({
  containerStyle,
  textStyle,
  offer,
  venue,
  navigation,
  type = "reload",
  buttonPressedCallback
}: Props) {
  const [shouldShowCounter, setShouldShowCounter] = useState(false);
  const subscriptionRequest = useRef<RedeemDealRequestModel>({
    establishment_id: venue?.id?.toString()
  });
  const [isDisabled, setIsDisabled] = useState(false);
  const [shouldShowCreditDialog, setShouldShowCreditDialog] =
    useState(false);
  const [shouldShowDailyLimitDialog, setShouldShowDailyLimitDialog] =
    useState(false);
  const [
    shouldShowExclusiveOfferDialog,
    setShouldShowExclusiveOfferDialog
  ] = useState(false);
  const outOfCreditType = useRef<EOutOfCredit>();
  const dispatch = useAppDispatch();
  // useTraceUpdate(shouldShowCounter);

  // AppLog.log(
  //   () => "Redeem deal button # venue : " + JSON.stringify(venue),
  //   TAG.REDEEM
  // );

  const [backgroundColor, setBackgroundColor] = useState<
    string | undefined
  >(COLORS.theme?.primaryColor);

  const [text, setText] = useState<string>(
    STRINGS.common.action_redeem_deal
  );

  const getButtonText = useCallback(
    (_text: string) => {
      if (offer.offer_type_id !== EOfferType.STANDARD) {
        AppLog.log(
          () => "Rendering redeem deal button # " + JSON.stringify(offer),
          TAG.REDEEM
        );

        if (
          !venue?.can_redeem_offer &&
          !isBarUnlimitedRedemptionToday(venue!) &&
          !offer.is_voucher
        ) {
          //grey color
          AppLog.log(
            () => "Can redeem offer # " + venue?.can_redeem_offer,
            TAG.REDEEM
          );

          AppLog.log(
            () =>
              "isUnlimitedRedemption # " +
              isBarUnlimitedRedemptionToday(venue!),
            TAG.REDEEM
          );

          setBackgroundColor(COLORS.theme?.interface["400"]);
          setIsDisabled(false);
        }

        if (isExpired(offer)) {
          setShouldShowCounter(false);
          setIsDisabled(true);
          setText("Expired");
        } else if (isDealActive(offer)) {
          setShouldShowCounter(false);
          setIsDisabled(false);
          setText("Redeem Deal");
        } else {
          setShouldShowCounter(true);
          setIsDisabled(true);
          setText(_text);
        }
      } else {
        if (
          !venue?.can_redeem_offer &&
          !isBarUnlimitedRedemptionToday(venue!)
        ) {
          //grey color
          AppLog.log(
            () => "Can redeem offer # " + venue?.can_redeem_offer,
            TAG.REDEEM
          );

          AppLog.log(
            () =>
              "isUnlimitedRedemption # " +
              isBarUnlimitedRedemptionToday(venue!),
            TAG.REDEEM
          );

          setBackgroundColor(COLORS.theme?.interface["400"]);
          setIsDisabled(false);
        } else {
          AppLog.log(
            () => "is Standard offer else is working",
            TAG.REDEEM
          );

          setBackgroundColor(getStandardOfferColor(venue));
          setIsDisabled(false);
        }

        setShouldShowCounter(false);
        setText(_text);
      }
    },
    [offer, venue]
  );

  useEffect(() => {
    getButtonText(offer.title);
  }, [getButtonText, offer]);

  //Out of credit dialog work
  const showOutOfCreditDialog = (creditType: EOutOfCredit) => {
    outOfCreditType.current = creditType;
    setIsDialogVisible(true);
  };

  const [isDialogVisible, setIsDialogVisible] = useState<boolean>(false);

  const onClose = () => {
    setIsDialogVisible(false);
    buttonPressedCallback?.(false);
  };
  const onReloadClick = () => {
    buttonPressedCallback?.(false);
    navigation.navigate("Reload");
    setIsDialogVisible(false);
  };
  const onInviteBtnClick = () => {
    navigation.navigate("Invite");
    setIsDialogVisible(false);
    buttonPressedCallback?.(false);
  };
  //Out of credit dialog work end

  //Redeem Deal dialog work
  const [isRedeemDialogVisible, setIsRedeemDialogVisible] =
    useState<boolean>(false);

  const showRedeemDialog = useCallback(() => {
    buttonPressedCallback?.(true);
    setIsRedeemDialogVisible(true);
  }, [buttonPressedCallback]);

  const onRedeemDialogClose = () => {
    buttonPressedCallback?.(false);
    setIsRedeemDialogVisible(false);
  };

  const onSuccessfulRedemption = () => {
    buttonPressedCallback?.(false);
    dispatch(
      setRefreshingEvent({
        REFRESH_APIS_EXPLORE_SCREEN: [EScreen.RELOAD_BANNER]
      })
    );
    dispatch(
      setRefreshingEvent({
        SUCCESSFULL_REDEMPTION: {
          venueId: venue.id,
          offerId: Number(subscriptionRequest?.current?.offer_id ?? 0),
          isVoucher: subscriptionRequest.current.type === "voucher"
        }
      })
    );

    setTimeout(() => {
      dispatch(consumeRefreshCount());
    }, 500);
  };
  //Redeem Deal dialog work end

  const showUseCreditDialog = useCallback(() => {
    // Alert.alert("Use Credit", "Use credit to redeem this deal.", [
    //   {
    //     text: "Cancel",
    //     style: "cancel",
    //     onPress: () => {
    //       buttonPressedCallback?.(false);
    //     }
    //   },
    //   { text: "OK", onPress: () => showRedeemDialog() }
    // ]);
    setShouldShowCreditDialog(true);
  }, []);

  const showDailyLimitReachedDialog = useCallback(() => {
    buttonPressedCallback?.(false);
    // Alert.alert(
    //   "You've Reached Your Daily Limit For This Venue",
    //   "You have used your two offer limit here today. Don't worry, you can use credits to redeem offers here again tomorrow.",
    //   [{ text: "OK" }]
    // );
    setShouldShowDailyLimitDialog(true);
  }, [buttonPressedCallback]);

  const buttonPress = () => {
    buttonPressedCallback?.(true);

    /**
     * need to show pop in venue details for redemption, to redeem
     * discount during checkout. Since, in app payment is open.
     */
    if (type === "standard" && venue.is_payment_app) {
      return;
    }

    if (offer != null) {
      if (offer.shared_id) {
        subscriptionRequest.current!.shared_id =
          offer.shared_id?.toString();
      }
    }

    subscriptionRequest.current!.establishment_id = venue.id.toString();

    if (type === "standard") {
      subscriptionRequest.current!.standard_offer_id =
        venue.standard_offer.id.toString();
    } else {
      subscriptionRequest.current!.offer_id = offer.id.toString();
    }

    if (offer && offer.is_voucher) {
      subscriptionRequest.current!.type = "voucher";
      subscriptionRequest.current!.user_voucher_id =
        offer.user_voucher_id.toString();
      showRedeemDialog();
    } else if (venue.can_redeem_offer) {
      subscriptionRequest.current!.type = type;
      showRedeemDialog();
    } else if (
      venue.can_unlimited_redeem &&
      isBarUnlimitedRedemptionToday(venue)
    ) {
      subscriptionRequest.current!.type = "unlimited";
      showRedeemDialog();
    } else {
      //   mView.showRedeemProgress(true);
      handleLoadSubscriptionDetails();
    }
  };

  const { request: subscriptionDetailRequest, loading } =
    useGeneralApis().getReloadData;

  const handleLoadSubscriptionDetails = useCallback(async () => {
    const { hasError, dataBody } = await subscriptionDetailRequest({
      establishment_id: venue.id
    });

    if (hasError || dataBody === undefined) {
      //   mView.showRedeemProgress(false);
      SimpleToast.show(Strings.common.some_thing_bad_happened);
      buttonPressedCallback?.(false);
      return;
    } else {
      AppLog.log(
        () =>
          "RedeemDealButton#handleLoadSubscriptionDetails()=>  " +
          JSON.stringify(dataBody.data),
        TAG.REDEEM
      );

      if (
        (dataBody.data.redeemed_count ?? 0) < 2 ||
        isBarUnlimitedRedemptionToday(venue)
      ) {
        let credit = dataBody.data.credit;

        if (credit > 0) {
          if (dataBody.data.remaining_seconds === 0) {
            // Timer is finished, user should need to reload now in order to use credits
            showOutOfCreditDialog(EOutOfCredit.TIMER_EXPIRED);
          } else {
            subscriptionRequest.current!.type = "credit";
            showUseCreditDialog();
          }
        } else {
          let _type: EOutOfCredit = EOutOfCredit.NOT_ABLE_TO_RELOAD;
          if (dataBody.data.remaining_seconds === 0) {
            _type = EOutOfCredit.ABLE_TO_RELOAD;
          } else if (isBarUnlimitedRedemptionToday(venue)) {
            _type = EOutOfCredit.UNLIMITED_RELOAD_INVITE;
          }

          showOutOfCreditDialog(_type);
        }
      } else {
        showDailyLimitReachedDialog();
      }
    }
  }, [
    buttonPressedCallback,
    showDailyLimitReachedDialog,
    showUseCreditDialog,
    subscriptionDetailRequest,
    venue
  ]);

  //////////////////////////////////Handle Basic Bogo/////////////////////////////
  const { updateBasicBogo } = useBasicBogoApiHandler();

  const addBasicBogoToCart = useCallback(
    async (
      bogo: BarMenu,
      menuType: ESupportedOrderType,
      redeemType: string | undefined,
      exclusiveId: string | undefined
    ) => {
      let request = {
        offer_type: "exclusive",
        exclusive_offer_id: exclusiveId,
        redeem_type: redeemType
      };

      updateBasicBogo(bogo, menuType, request, () => {
        dispatch(
          setRefreshingEvent({
            FETCH_CART_COUNT: true
          })
        );

        navigation.push("MyCart", {
          isFrom: EScreen.VENUE_DETAIL,
          establishment_id: bogo.establishment_id
        });
      });
    },
    [dispatch, navigation, updateBasicBogo]
  );
  //////////////////////////////////Handle Basic Bogo End/////////////////////////////

  const startMenuDetailScreen = (
    menuType?: ESupportedOrderType,
    id?: number,
    redeemType?: string,
    exclusive_offer_id?: string
  ) => {
    if (isBasicBogo(offer.menu)) {
      addBasicBogoToCart(
        offer.menu,
        menuType!,
        redeemType,
        exclusive_offer_id
      );
      return;
    }

    navigation.navigate("BundleBogo", {
      menuType: menuType ?? ESupportedOrderType.ALL,
      menu: offer.menu,
      menu_id: offer.menu_id,
      establishment_id: id!,
      productType: offer.menu.group_type,
      redeemType: redeemType,
      exclusive_offer_id: exclusive_offer_id,
      supportedType: offer.menu.menu_type
    });
  };

  const startMenuDetailScreenOrUpdateCartFromRedeem = (
    menuType?: ESupportedOrderType
  ) => {
    if (menuType !== null && menuType !== undefined) {
      startMenuDetailScreen(
        menuType,
        offer.establishment_id!,
        type,
        offer.id.toString()
      );
    } else {
      startMenuDetailScreen(
        supportedOrderTypes(offer.menu),
        offer.establishment_id!,
        type,
        offer.id.toString()
      );
    }
  };

  return (
    <>
      <DialogOutOfCredit
        isVisible={isDialogVisible}
        onClose={onClose}
        onReloadBtnClick={onReloadClick}
        onInviteBtnClick={onInviteBtnClick}
        venueId={venue?.id}
        type={outOfCreditType.current}
      />

      <DialogRedeemDeal
        isVisible={isRedeemDialogVisible}
        onClose={onRedeemDialogClose}
        onSuccessfulRedemption={onSuccessfulRedemption}
        requestModel={subscriptionRequest.current}
        offer={offer}
        venue={venue}
        shouldShowExclusiveOfferDialog={(shouldShow) => {
          if (shouldShow) {
            buttonPressedCallback?.(true);
          } else {
            buttonPressedCallback?.(false);
          }
          if (
            offer.establishments?.is_payment_app &&
            isBarOperatesToday(offer?.establishments!)
          ) {
            setShouldShowExclusiveOfferDialog(shouldShow);
          } else {
            buttonPressedCallback?.(false);
            setTimeout(
              () =>
                SimpleToast.show(
                  "In app-payment service are unavailable, please contact administration"
                ),
              40
            );
          }
        }}
        shouldShowMenuDetail={(shouldShow) => {
          if (shouldShow) {
            startMenuDetailScreenOrUpdateCartFromRedeem(undefined);
          }
        }}
      />

      <CustomAppDialog
        isVisible={shouldShowCreditDialog}
        buttonsText={["Yes", "No"]}
        buttonsAlign={BUTTONS_DIRECTION.VERTICAL}
        textContainerStyle={{ maxHeight: 0 }}
        textOnImage={Strings.dialogs.redeemCreditDialog.credit_to_redeem}
        // message={Strings.dialogs.redeemCreditDialog.credit_msg}
        hideSelf={() => {
          buttonPressedCallback?.(false);
          setShouldShowCreditDialog(false);
        }}
        appButtonsProps={[
          {
            onPress: () => {
              setShouldShowCreditDialog(false);
              showRedeemDialog();
            }
          },
          {
            onPress: () => {
              buttonPressedCallback?.(false);
              setShouldShowCreditDialog(false);
            }
          }
        ]}
      />
      <CustomAppDialog
        isVisible={shouldShowDailyLimitDialog}
        buttonsText={["OK"]}
        textOnImage={Strings.dialogs.dailyLimitDialog.daily_limit_text}
        message={Strings.dialogs.dailyLimitDialog.daily_limit_msg}
        textContainerStyle={{ maxHeight: 60 }}
        hideSelf={() => {
          buttonPressedCallback?.(false);
          setShouldShowDailyLimitDialog(false);
        }}
        appButtonsProps={[
          {
            onPress: () => {
              buttonPressedCallback?.(false);
              setShouldShowDailyLimitDialog(false);
            }
          }
        ]}
      />

      {!shouldShowCounter ? (
        <AppButton
          text={text}
          buttonStyle={[
            styles.container,
            containerStyle,
            { backgroundColor: backgroundColor }
          ]}
          textType={TEXT_TYPE.SEMI_BOLD}
          textStyle={[styles.text, textStyle]}
          isDisable={isDisabled}
          shouldShowProgressBar={loading}
          onPress={buttonPress}
        />
      ) : (
        <View style={styles.counterButtonContainer}>
          <AppLabel
            text="Starts in "
            style={styles.timerText}
            textType={TEXT_TYPE.BOLD}
          />
          <Timer
            textStyle={styles.timerText}
            diffInSeconds={convertMilisecondsToSeconds(
              getStartInMillis(offer)
            )}
            isTicking={true}
            onTimerEnded={() => {
              setIsDisabled(false);
              setText("Redeem Deal");
            }}
          />
        </View>
      )}

      <CustomAppDialog
        isVisible={shouldShowExclusiveOfferDialog}
        buttonsText={["Dine-in", "Takeaway/Delivery"]}
        buttonsAlign={BUTTONS_DIRECTION.VERTICAL}
        textContainerStyle={{ maxHeight: 0 }}
        textOnImage={Strings.dialogs.exclusiveOfferDialog.msg}
        hideSelf={() => {
          buttonPressedCallback?.(false);
          setShouldShowExclusiveOfferDialog(false);
        }}
        appButtonsProps={[
          {
            onPress: () => {
              buttonPressedCallback?.(false);
              setShouldShowExclusiveOfferDialog(false);
              startMenuDetailScreenOrUpdateCartFromRedeem(
                ESupportedOrderType.DINE_IN_COLLECTION
              );
            }
          },
          {
            onPress: () => {
              buttonPressedCallback?.(false);
              setShouldShowExclusiveOfferDialog(false);
              startMenuDetailScreenOrUpdateCartFromRedeem(
                ESupportedOrderType.TAKEAWAY_DELIVERY
              );
            }
          }
        ]}
      />
    </>
  );
}

export default RedeemDealButton;

const styles = StyleSheet.create({
  container: {},
  text: { fontSize: FONT_SIZE.sm },
  counterButtonContainer: {
    backgroundColor: COLORS.theme?.primaryColor,
    height: 44,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row"
  },
  timerText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.white
  }
});
