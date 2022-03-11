import { COLORS, FONT_SIZE, SPACE } from "config";
import Strings from "config/Strings";
import { usePreferredTheme, usePreventDoubleTap } from "hooks";
import React, { FC, useCallback } from "react";
import { View, Modal, StyleSheet, Image, Pressable } from "react-native";
import {
  AppLabel,
  AppLabelProps,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import { AppButton } from "ui/components/molecules/app_button/AppButton";
import Cross from "assets/images/ic_cross.svg";
import { RedeemDealRequestModel } from "models/api_requests/RedeemDealRequestModel";
import { useAppSelector } from "hooks/redux";
import { RootState } from "stores/store";
import { AppLog, Price, TAG } from "utils/Util";
import usePermission from "ui/screens/auth/location_permission/usePermission";
import { Location } from "react-native-get-location";
import SimpleToast from "react-native-simple-toast";
import { useGeneralApis } from "repo/general/GeneralApis";
import { Offer } from "models/Offer";
import { isMenuOffersMultiCategories } from "models/BarMenu";
import EPosType from "models/enums/EPosType";
import { Venue } from "models/Venue";

export type Action = {
  title: string;
  style?: AppLabelProps;
  onPress: () => void;
};

type Props = {
  isVisible: boolean;
  onClose: () => void;
  requestModel: RedeemDealRequestModel;
  onSuccessfulRedemption?: () => void;
  offer: Offer;
  venue: Venue;
  shouldShowExclusiveOfferDialog: (shouldShow: boolean) => void;
  shouldShowMenuDetail: (shouldShow: boolean) => void;
};

const DialogRedeemDeal: FC<Props> = ({
  isVisible,
  onClose,
  requestModel,
  onSuccessfulRedemption,
  offer,
  shouldShowExclusiveOfferDialog,
  shouldShowMenuDetail,
  venue
}) => {
  const theme = usePreferredTheme();

  const { request: redeemBarOffer, loading } =
    useGeneralApis().redeemBarOffer;

  const handleRedeemBarOffer = useCallback(async () => {
    const { hasError, dataBody, errorBody } = await redeemBarOffer(
      requestModel
    );

    if (hasError || dataBody === undefined) {
      //   mView.showRedeemProgress(false);
      SimpleToast.show(
        errorBody ?? Strings.common.some_thing_bad_happened
      );
      return;
    } else {
      onSuccessfulRedemption?.();
      onClose?.();
      setTimeout(() => SimpleToast.show(dataBody.message), 40);
    }

    onClose();
  }, [onClose, onSuccessfulRedemption, redeemBarOffer, requestModel]);

  const showLocationError = () => {
    SimpleToast.show(
      "Location not found, Please check app setting and allow location permission."
    );
  };

  const onLocationFound = (location: Location | undefined) => {
    if (location) {
      requestModel.latitude = location?.latitude;
      requestModel.longitude = location?.longitude;

      handleRedeemBarOffer();
      AppLog.log(
        () =>
          "DialogRedeemDeal# onLocationFound() => " +
          JSON.stringify(location),
        TAG.REDEEM
      );
    } else {
      AppLog.log(
        () => "DialogRedeemDeal# onLocationFound() => Invalid LatLng",
        TAG.REDEEM
      );

      showLocationError();
    }
  };

  const onLocationNotFound = () => {
    showLocationError();

    AppLog.log(() => "DialogRedeemDeal# onLocationNotFound()", TAG.REDEEM);
  };
  const { askPermission } = usePermission(
    onLocationFound,
    onLocationNotFound
  );

  const { regionData } = useAppSelector(
    (state: RootState) => state.general
  );

  const onRedeemDealClick = usePreventDoubleTap(() => {
    if (offer.is_menu_associated && venue.epos_name === EPosType.BARCODE) {
      if (offer?.menu) {
        if (isMenuOffersMultiCategories(offer.menu)) {
          onClose?.();
          shouldShowMenuDetail(false);
          shouldShowExclusiveOfferDialog(true);
        } else {
          onClose?.();
          shouldShowMenuDetail(true);
        }
      } else {
        onClose?.();
        setTimeout(
          () =>
            SimpleToast.show(
              Strings.venue_details.whatson.exclusive_offer_error
            ),
          40
        );
      }
    } else {
      askPermission();
    }
  });

  if (!isVisible) {
    return null;
  }

  const shouldShowVenuePremisesText = () => {
    if (offer.offer_type?.title === "Exclusive") {
      if (!offer.is_menu_associated) {
        return true;
      } else {
        if (offer.menu_id) {
          return false;
        } else {
          return true;
        }
      }
    } else if (offer.offer_type?.title === "5 A Day") {
      return true;
    } else {
      return false;
    }
  };

  return (
    <Modal
      testID="popup-modal"
      visible={true}
      animationType="fade"
      transparent={true}>
      <View style={styles.root}>
        <View
          style={[
            styles.content,
            { backgroundColor: theme.themedColors.primaryBackground }
          ]}>
          <Pressable
            style={{
              position: "absolute",
              zIndex: 1,
              right: 0,
              top: 0,
              width: 50,
              height: 50,
              alignItems: "center",
              justifyContent: "center"
            }}
            onPress={onClose}>
            <Cross stroke={COLORS.white} width={20} height={20} />
          </Pressable>

          <AppLabel
            text={Strings.dialogs.redeemDialog.title}
            textType={TEXT_TYPE.BOLD}
            style={styles.outOfCredit}
          />

          <Image
            source={require("assets/images/img_reload.webp")}
            style={styles.imgBg}
            resizeMode="cover"
          />

          {/* overlay effect */}
          <View
            style={[
              styles.imgBg,
              {
                position: "absolute",
                backgroundColor: COLORS.theme?.primaryColor,
                opacity: 0.4
              }
            ]}
          />
          {/* overlay effect */}

          <View style={styles.textContainer}>
            {shouldShowVenuePremisesText() && (
              <>
                <AppLabel
                  style={[
                    styles.titleStyle,
                    { fontSize: 12, lineHeight: 17 }
                  ]}
                  text={Strings.dialogs.redeemDialog.msg_redeem_location}
                  numberOfLines={0}
                />

                <AppLabel
                  style={styles.titleStyle}
                  text={Strings.dialogs.redeemDialog.msg_click_redeem}
                  numberOfLines={0}
                  textType={TEXT_TYPE.SEMI_BOLD}
                />
              </>
            )}
            {requestModel.standard_offer_id && (
              <AppLabel
                style={[
                  styles.titleStyle,
                  {
                    color: COLORS.theme?.interface["500"]
                  }
                ]}
                text={
                  requestModel.type && requestModel.type === "unlimited"
                    ? Strings.dialogs.redeemDialog.discount_only.replace(
                        "%s",
                        Price.toString(
                          regionData?.currency_symbol,
                          regionData?.round ?? 0.0
                        )
                      )
                    : Strings.dialogs.redeemDialog.discount_only.replace(
                        "%s",
                        Price.toString(
                          regionData?.currency_symbol,
                          regionData?.round ?? 0.0
                        )
                      )
                }
                numberOfLines={0}
              />
            )}

            <AppButton
              text={Strings.dialogs.redeemDialog.title}
              buttonStyle={{
                height: 40,
                marginTop: shouldShowVenuePremisesText() ? 0 : SPACE._2md
              }}
              textType={TEXT_TYPE.SEMI_BOLD}
              onPress={onRedeemDealClick}
              shouldShowProgressBar={loading}
            />

            <Pressable onPress={onClose}>
              <AppLabel
                style={[
                  styles.titleStyle,
                  {
                    color: COLORS.theme?.interface["900"],
                    marginTop: SPACE.lg
                  }
                ]}
                text={Strings.dialogs.redeemDialog.take_me_back}
                numberOfLines={0}
              />
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(90,94,94,0.6)"
  },
  content: {
    width: "100%",
    maxWidth: 300,
    borderRadius: 12,
    flexDirection: "column",
    alignItems: "center"
  },
  logoWrapper: {
    height: 50,
    width: 50,
    backgroundColor: COLORS.theme?.interface["100"],
    borderRadius: 50 / 2,
    justifyContent: "center",
    alignItems: "center",
    marginTop: SPACE.lg
  },
  imgBg: {
    width: "100%",
    height: 150,
    overflow: "hidden",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    opacity: 0.8
  },
  outOfCredit: {
    position: "absolute",
    zIndex: 1,
    marginTop: 70,
    color: COLORS.white,
    fontSize: FONT_SIZE.base
  },
  textContainer: {
    flexDirection: "column",
    paddingVertical: SPACE.lg,
    paddingHorizontal: SPACE.md
  },
  titleStyle: {
    textAlign: "center",
    fontSize: FONT_SIZE._3xs,
    paddingBottom: SPACE.lg
  },
  messageStyle: {
    fontSize: FONT_SIZE.sm,
    textAlign: "center"
  },
  separator: {
    height: 0.5
  },
  spacer: {
    padding: SPACE.xs
  },
  messageText: { fontSize: FONT_SIZE.sm }
});

export default DialogRedeemDeal;
