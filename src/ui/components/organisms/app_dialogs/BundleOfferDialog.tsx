import { Offer } from "models/Offer";
import Strings from "config/Strings";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { COLORS, FONT_SIZE, SPACE } from "config";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import Colors from "config/Colors";
import HTMLView from "react-native-htmlview";
import { AppLog, TAG } from "utils/Util";
import { AppButton } from "ui/components/molecules/app_button/AppButton";
import EFunnelType from "models/enums/EFunnelType";
import { useAppSelector } from "hooks/redux";
import { RootState } from "stores/store";
import EProductGroupType from "models/enums/EProductGroupType";
import { isBarOperatesToday } from "models/Venue";
import moment from "moment";

type Props = {
  offer: Offer;
  addToCart: () => void;
};

export const getMilesAwayText = (offer: Offer) => {
  if (offer?.establishments?.distance === 1) {
    return Strings.edits.mile_away;
  } else {
    return Strings.edits.miles_away;
  }
};

const BundleOfferDialog = React.memo<Props>(({ offer, addToCart }) => {
  const { regionData } = useAppSelector(
    (state: RootState) => state.general
  );

  AppLog.log(() => "imageUrl: " + offer.image, TAG.VENUE);

  const getSubtitle = () => {
    if (offer.bundle_offer_type === EFunnelType.DISCOUNT) {
      return offer.bundle_discount + "% OFF";
    } else if (offer.bundle_offer_type === EFunnelType.FIXED_PRICE) {
      return regionData?.currency_symbol + " " + offer.price.toFixed(2);
    } else if (offer.bundle_offer_type === EFunnelType.FREE_FUNNEL) {
      return "FREE FUNNEL";
    } else {
      return "";
    }
  };

  const getOfferDateTime = (dateTime: string) => {
    return `${moment(dateTime).format("lll")} `;
  };

  return (
    <View style={styles.container}>
      <Image
        source={
          offer.image !== null
            ? { uri: offer.image }
            : require("assets/images/cart_placeholder.png")
        }
        style={styles.image}
        resizeMode={"cover"}
      />
      <View
        style={{
          flex: 1,
          // justifyContent: "center",
          flexDirection: "column",
          paddingHorizontal: SPACE.lg,
          paddingTop: SPACE.md
        }}>
        <AppLabel
          text={offer.name}
          style={[styles.title]}
          textType={TEXT_TYPE.SEMI_BOLD}
        />

        {offer.description && (
          <View
            style={{
              // flex: 1,
              marginTop: SPACE.lg,
              justifyContent: "center",
              alignItems: "center"
            }}>
            <HTMLView
              value={`<p>${offer?.description}</p>`}
              stylesheet={styleDesc}
              nodeComponentProps={{ numberOfLines: 4 }}
            />
          </View>
        )}
        {offer.group_type === EProductGroupType.BUNDLE &&
          offer.bundle_offer_type !== EFunnelType.FREE_FUNNEL && (
            <View
              style={[
                // { flex: offer.description ? 0.3 : 1 },
                {
                  paddingTop: SPACE.xs,
                  alignItems: "center",
                  justifyContent: "center"
                }
              ]}>
              <AppLabel
                text={getSubtitle()}
                style={[
                  styles.discount,
                  { color: COLORS.theme?.primaryShade[700] }
                ]}
                textType={TEXT_TYPE.SEMI_BOLD}
              />
            </View>
          )}
      </View>
      {offer.establishment?.is_payment_app &&
        isBarOperatesToday(offer?.establishment!) && (
          <>
            <View
              style={{
                marginHorizontal: SPACE.lg,
                marginBottom: SPACE.sm
              }}>
              <AppButton
                // isDisable={totalBill === 0.0 ? true : false}
                // shouldShowProgressBar={addToCartLoading}
                text={"Add to cart"}
                onPress={addToCart}
                textType={TEXT_TYPE.SEMI_BOLD}
                buttonStyle={{ marginHorizontal: 10 }}
              />
            </View>

            <View style={{ alignSelf: "center" }}>
              <AppLabel
                text={
                  "Offer Start: " +
                  getOfferDateTime(
                    offer.start_date! + " " + offer.start_time
                  )
                }
                textType={TEXT_TYPE.SEMI_BOLD}
                style={styles.dateTime}
              />
              <AppLabel
                text={
                  "Offer End: " +
                  getOfferDateTime(offer.end_date! + " " + offer.end_time)
                }
                textType={TEXT_TYPE.SEMI_BOLD}
                style={[styles.dateTime, { paddingBottom: SPACE.lg }]}
              />
            </View>
          </>
        )}
    </View>
  );
});
const styleDesc = StyleSheet.create({
  p: {
    fontSize: FONT_SIZE._2xs,
    textAlign: "justify",
    marginBottom: 0,
    marginTop: 0,
    paddingBottom: 0,
    paddingTop: 0,
    fontWeight: "500"
  }
});
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8,
    marginHorizontal: 20,
    elevation: 1
  },
  title: {
    // flex: 0.3,
    alignSelf: "center",
    fontSize: FONT_SIZE._3xs,
    color: COLORS.theme?.interface[600],
    textTransform: "uppercase"
  },
  subTitle: {
    alignSelf: "center",
    fontSize: FONT_SIZE.base,
    color: Colors.colors.black
  },
  longDesc: {
    alignSelf: "center",
    fontSize: FONT_SIZE._2xs,
    paddingRight: SPACE._2xl,
    paddingLeft: SPACE._2xl,
    justifyContent: "center",
    textAlign: "center",
    marginTop: SPACE.md
  },
  shortDesc: {
    alignSelf: "center",
    fontSize: FONT_SIZE._2xs,
    paddingTop: SPACE.lg
  },
  location: {
    alignSelf: "center",
    fontSize: FONT_SIZE._3xs,
    paddingLeft: SPACE._2xs,
    paddingTop: SPACE.xs
  },
  image: {
    width: "100%",
    height: 150,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8
  },
  shareIcon: {
    marginTop: SPACE.lg
  },
  iconsContainer: {
    position: "absolute",
    right: SPACE.lg,
    top: SPACE.lg
  },
  startButton: {
    marginTop: SPACE.lg
  },

  decsriptionViewMoreContainer: {
    // height: 30
    //marginBottom: SPACE.lg
  },
  timerText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.white
  },
  discount: {
    textAlign: "center",
    textAlignVertical: "center",
    // paddingTop: SPACE.xs,
    fontSize: FONT_SIZE.sm
  },
  dateTime: {
    textAlign: "center",
    fontSize: FONT_SIZE._2xs,
    paddingHorizontal: SPACE.lg
  }
});

export default BundleOfferDialog;
