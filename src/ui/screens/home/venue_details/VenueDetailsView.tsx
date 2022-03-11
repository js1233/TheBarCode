/* eslint-disable @typescript-eslint/no-unused-vars */
import { COLORS, SPACE } from "config";
import EVenueType from "models/enums/EVenueType";
import { isBarOperatesToday, toOffer, Venue } from "models/Venue";
import React, { useCallback, useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import VenueDetailsTopTabsNavigator from "routes/VenueDetailsTopTabsNavigator";
import Screen from "ui/components/atoms/Screen";
import RedeemDealButton from "ui/components/organisms/button_redeem_deal/RedeemDealButton";
import { ViewPager } from "ui/components/organisms/view_pager/ViewPager";
import Cross from "assets/images/ic_cross.svg";
import { Offer } from "models/Offer";
import { AppLog, parameterizedString, TAG } from "utils/Util";
import BundleOfferDialog from "ui/components/organisms/app_dialogs/BundleOfferDialog";
import { VenueDetailsTopTabsParamList } from "routes/VenueDetailsTopTabs";
import EScreen from "models/enums/EScreen";
import { StackNavigationProp } from "@react-navigation/stack";
import { HomeStackParamList } from "routes/HomeStack";
import { AppButton } from "ui/components/molecules/app_button/AppButton";
import { TEXT_TYPE } from "ui/components/atoms/app_label/AppLabel";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { useAppSelector } from "hooks/redux";
import { RootState } from "stores/store";
import CustomAppDialog from "ui/components/organisms/app_dialogs/CustomAppDialog";
import Strings from "config/Strings";
import SimpleToast from "react-native-simple-toast";

type Props = {
  venue: Venue | undefined;
  barMenu?: Offer[];
  initialRoute?: keyof VenueDetailsTopTabsParamList;
  isFrom: EScreen;
  notificationType?: string;
  navigation: StackNavigationProp<
    HomeStackParamList,
    keyof HomeStackParamList
  >;
  initialSegmentForWhatsOnIndex?: number;
  initialSegmentForMenuIndex?: number;
  refreshing: boolean;
  onRefresh: () => void;
  barCartCount: number;
  navigateToMyCart: () => void;
  onBundleOfferDialogClick: (offer: Offer) => void;
};

function VenueDetailsView({
  venue,
  barMenu,
  navigation,
  initialRoute,
  isFrom,
  notificationType,
  initialSegmentForWhatsOnIndex,
  initialSegmentForMenuIndex,
  refreshing,
  onRefresh,
  barCartCount,
  navigateToMyCart,
  onBundleOfferDialogClick
}: Props) {
  const [isDialogVisible, setIsDialogueVisible] = useState<boolean>(true);
  const [showRedemptionInsDialog, setShowRedemptionInsDialog] =
    useState<boolean>(false);

  const [isBundleDialogClosedByUser, setDialogClosedByUser] =
    useState<boolean>(false);

  const isFocused = useIsFocused();

  const snapItem = useCallback(
    ({ item }: { item: Offer }) => {
      return (
        <BundleOfferDialog
          offer={item}
          addToCart={() => {
            if (
              item.establishment?.is_payment_app &&
              isBarOperatesToday(item?.establishment!)
            ) {
              setIsDialogueVisible(false);
              setDialogClosedByUser(true);
              onBundleOfferDialogClick(item);
            } else {
              SimpleToast.show(
                "In app-payment service are unavailable, please contact administration"
              );
            }
          }}
        />
      );
    },
    [onBundleOfferDialogClick]
  );

  AppLog.log(
    () => "UNLIMITED REDEMPTION -> " + JSON.stringify(venue),
    TAG.IN_APP_PURCHASE
  );

  const { refreshingEvent } = useAppSelector(
    (state: RootState) => state.general
  );

  useEffect(() => {
    if (refreshingEvent?.POP_UP_OPEN) {
      setIsDialogueVisible(false);
    } else if (!refreshingEvent?.POP_UP_OPEN) {
      setIsDialogueVisible(true);
    }
  }, [refreshingEvent]);

  return (
    <>
      <Screen
        style={[styles.container]}
        bottomSafeAreaColor={COLORS.theme?.interface["50"]}>
        <VenueDetailsTopTabsNavigator
          isFrom={isFrom}
          notificationType={notificationType}
          initialRoute={initialRoute ?? "Menu"}
          initialSegmentForWhatsOnIndex={initialSegmentForWhatsOnIndex}
          initialSegmentForMenuIndex={initialSegmentForMenuIndex}
        />

        {
          venue?.type !== EVenueType.EXCLUSIVE && (
            /*venue?.standard_offer !== null &&
        !barCartCount ?*/ <View style={[styles.bottomButtonContainer]}>
              <RedeemDealButton
                offer={toOffer(venue?.standard_offer!)}
                venue={venue!}
                type="standard"
                navigation={navigation}
                buttonPressedCallback={(isVisible: boolean) => {
                  setIsDialogueVisible(!isVisible);
                  if (venue?.is_payment_app) {
                    setShowRedemptionInsDialog(true);
                  }
                }}
              />
            </View>
          ) /*: (
          barCartCount > 0 && (
            <View style={[styles.bottomButtonContainer]}>
              <AppButton text="View Cart" onPress={navigateToMyCart} />
            </View>
          )
          )*/
        }

        {isFocused &&
          !isBundleDialogClosedByUser &&
          barMenu &&
          (barMenu?.length ?? 0) > 0 && (
            <Modal
              animationType="none"
              transparent={true}
              visible={isDialogVisible}>
              <View style={styles.modal}>
                <ViewPager
                  shouldShowPagination={false}
                  snapView={snapItem}
                  data={barMenu}
                  //callBack={onOfferSnapChanged}
                  itemWidthRatio={0.7}
                  containerStyle={styles.viewPagerContainer}
                  shouldEnableScroll={true}
                />
                <View style={{ height: 20 }} />
                <View>
                  <Pressable
                    style={({ pressed }) => [
                      styles.crossIcon,
                      { opacity: pressed ? 0.5 : 1.0 }
                    ]}
                    onPress={() => {
                      setIsDialogueVisible(false);
                      setDialogClosedByUser(true);
                    }}>
                    <Cross
                      width={22}
                      height={22}
                      fill={COLORS.theme?.primaryShade[700]}
                    />
                  </Pressable>
                </View>
              </View>
            </Modal>
          )}

        <CustomAppDialog
          image={require("assets/images/img_reload.webp")}
          isVisible={showRedemptionInsDialog}
          buttonsText={["OK"]}
          textOnImage={""}
          message={parameterizedString(
            Strings.dialogs.redeemDialog.in_app_redeem,
            venue?.standard_offer?.title!
          )}
          textContainerStyle={{ maxHeight: 55 }}
          hideSelf={() => {
            setShowRedemptionInsDialog(false);
            setIsDialogueVisible(true);
          }}
          appButtonsProps={[
            {
              onPress: () => {
                setShowRedemptionInsDialog(false);
                setIsDialogueVisible(true);
              }
            }
          ]}
        />
      </Screen>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  bottomButtonContainer: {
    backgroundColor: COLORS.theme?.interface["50"],
    paddingHorizontal: SPACE.lg,
    paddingTop: SPACE._2md,
    borderTopWidth: 1,
    borderColor: COLORS.theme?.interface["300"]
  },
  pagination: {
    paddingTop: SPACE._2lg,
    flex: 0.1,
    alignItems: "flex-end",
    flexDirection: "column",
    justifyContent: "flex-end"
  },
  viewPagerContainer: {
    height: 450,
    flex: 0,
    paddingTop: SPACE._2xl,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center"
    // backgroundColor: "red"
  },
  modal: {
    flex: 1,
    backgroundColor: "rgba(90,94,94,0.6)",
    justifyContent: "center"
  },
  crossIcon: {
    alignSelf: "center",
    // marginTop: SPACE._3xl,
    width: 30,
    height: 30,
    backgroundColor: COLORS.white,
    padding: SPACE.xl,
    borderRadius: 30,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default VenueDetailsView;
