import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Cross from "assets/images/ic_cross.svg";
import Pin from "assets/images/pin.svg";
import { COLORS, FONT_SIZE, SPACE } from "config";
import Colors from "config/Colors";
import Strings from "config/Strings";
import EPosType from "models/enums/EPosType";
import { Offer } from "models/Offer";
import { isBarOperatesToday } from "models/Venue";
import React, { FC } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import HTMLView from "react-native-htmlview";
import SimpleToast from "react-native-simple-toast";
import { HomeStackParamList } from "routes/HomeStack";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import { AppButton } from "ui/components/molecules/app_button/AppButton";
import { getMilesAwayText } from "ui/components/organisms/view_pager/snap_items/ItemOffer";
import { offerStartEndDate } from "utils/Util";
import RedeemDealButton from "../button_redeem_deal/RedeemDealButton";

export type homeNavigationProp = StackNavigationProp<
  HomeStackParamList,
  "Home"
>;

type Props = {
  isVisible: boolean;
  hideSelf: () => void;
  offer: Offer;
  openGoogleMap?: (lat: number, lng: number, title: string) => void;
  buttonPressedCallback?: (pressed: boolean) => void;
  isChalkboard?: boolean;
  redirectToBogoBundle?: (offer: Offer) => void;
};

const FiveADayOfferDialog: FC<Props> = ({
  isVisible,
  offer,
  openGoogleMap,
  hideSelf,
  buttonPressedCallback,
  isChalkboard = false,
  redirectToBogoBundle
}) => {
  const navigation = useNavigation<homeNavigationProp>();
  return (
    <Modal
      testID="popup-modal"
      visible={isVisible}
      animationType="fade"
      transparent={true}>
      <View style={styles.root}>
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: offer?.image_url }}
              style={styles.image}
              resizeMode={"cover"}
            />
            <AppLabel
              text="Details"
              style={styles.details}
              textType={TEXT_TYPE.BOLD}
            />
          </View>
          <Pressable style={styles.crossIconContainer} onPress={hideSelf}>
            <Cross
              fill={COLORS.theme?.primaryColor}
              width={25}
              height={25}
            />
          </Pressable>
          <ScrollView
            contentContainerStyle={{ paddingBottom: SPACE.xl }}
            bounces={false}>
            <AppLabel
              text={offer?.sub_title}
              style={[styles.title, { color: COLORS.theme?.primaryColor }]}
              textType={TEXT_TYPE.BOLD}
            />
            <AppLabel
              text={offer?.title}
              style={styles.subTitle}
              textType={TEXT_TYPE.BOLD}
            />
            <HTMLView
              value={`<p>${offer?.description}</p>`}
              stylesheet={styleDesc}
            />
            <AppLabel
              text={offer?.establishments?.title}
              style={styles.shortDesc}
              textType={TEXT_TYPE.BOLD}
              onPress={() =>
                openGoogleMap?.(
                  offer?.establishments?.latitude!,
                  offer?.establishments?.longitude!,
                  offer?.establishments?.title!
                )
              }
            />
            <TouchableOpacity
              onPress={() =>
                openGoogleMap?.(
                  offer?.establishments?.latitude!,
                  offer?.establishments?.longitude!,
                  offer?.establishments?.title!
                )
              }>
              <View style={styles.locationContainer}>
                <Pin style={styles.pinIcon} />
                <AppLabel
                  text={
                    offer?.establishments?.distance.toFixed(2).toString() +
                    getMilesAwayText(offer)
                  }
                  style={[
                    styles.location,
                    { color: COLORS.theme?.primaryColor }
                  ]}
                />
              </View>
            </TouchableOpacity>

            <AppLabel
              text={offerStartEndDate(
                offer?.start_date!,
                offer?.end_date!,
                offer?.start_time!,
                offer?.end_time!
              )}
              textType={TEXT_TYPE.SEMI_BOLD}
              style={styles.startDateEndDate}
            />
          </ScrollView>

          <View
            style={{
              paddingHorizontal: SPACE.lg,
              marginTop: SPACE.lg,
              bottom: SPACE._2md
            }}>
            {!isChalkboard ? (
              <RedeemDealButton
                offer={offer}
                venue={offer?.establishments!}
                navigation={navigation}
                buttonPressedCallback={buttonPressedCallback}
              />
            ) : (
              <>
                {offer?.is_menu_associated &&
                  offer?.establishments?.epos_name ===
                    EPosType.BARCODE && (
                    <AppButton
                      shouldShowProgressBar={false}
                      text={Strings.venue_details.menu.addToCart}
                      onPress={() => {
                        if (
                          offer.establishments?.is_payment_app &&
                          isBarOperatesToday(offer?.establishments!)
                        ) {
                          redirectToBogoBundle?.(offer);
                        } else {
                          SimpleToast.show(
                            "In app-payment service are unavailable, please contact administration"
                          );
                        }
                        redirectToBogoBundle?.(offer);
                      }}
                      textType={TEXT_TYPE.SEMI_BOLD}
                    />
                  )}
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styleDesc = StyleSheet.create({
  p: {
    fontSize: FONT_SIZE._2xs,
    textAlign: "center",
    paddingHorizontal: SPACE._2md
  }
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(90,94,94,0.6)",
    paddingBottom: SPACE._4xl
  },
  container: {
    width: "75%",
    height: "75%",
    backgroundColor: COLORS.white,
    borderRadius: 15
  },
  imageContainer: {
    width: "100%",
    height: "40%",
    alignItems: "center",
    justifyContent: "center",
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15
  },
  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    opacity: 0.8
  },
  title: {
    alignSelf: "center",
    fontSize: FONT_SIZE._3xs,
    paddingTop: SPACE._2xl
  },
  subTitle: {
    alignSelf: "center",
    fontSize: FONT_SIZE.base,
    color: Colors.colors.black
  },
  longDesc: {
    fontSize: FONT_SIZE._2xs,
    marginTop: SPACE.md,
    paddingLeft: SPACE.xl,
    paddingRight: SPACE.xl
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
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  pinIcon: {
    marginTop: SPACE.xs
  },
  imageStyle: {
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15
  },
  details: {
    color: COLORS.white,
    fontSize: FONT_SIZE._2xl,
    position: "absolute"
  },
  crossIconContainer: {
    position: "absolute",
    top: "5%",
    right: "7%",
    backgroundColor: COLORS.white,
    borderRadius: 20,
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center"
  },
  startDateEndDate: {
    color: COLORS.theme?.primaryColor,
    alignSelf: "center",
    marginTop: SPACE._2md
  }
});

export default FiveADayOfferDialog;
