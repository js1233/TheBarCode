import { StackNavigationProp } from "@react-navigation/stack";
import { COLORS, FONT_SIZE, SPACE, STRINGS } from "config";
import Strings from "config/Strings";
import { useAppSelector } from "hooks/redux";
import EScreen from "models/enums/EScreen";
import ReloadData, {
  fixDataIssues,
  isAbleToReload
} from "models/ReloadData";
import React, { FC, useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle
} from "react-native";
import { useGeneralApis } from "repo/general/GeneralApis";
import { HomeStackParamList } from "routes/HomeStack";
import { RootState } from "stores/store";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import { parameterizedString, Price } from "utils/Util";
import CustomAppDialog from "../app_dialogs/CustomAppDialog";
import FirstRedeemDialog from "../app_dialogs/FirstRedeemDialog";
import { ReloadBannerInfo } from "./ReloadBannerInfo";
import Timer from "./Timer";

type Props = {
  containerStyle?: StyleProp<ViewStyle>;
  navigation?: StackNavigationProp<HomeStackParamList>;
};

const ReloadBanner: FC<Props> = ({ containerStyle, navigation }) => {
  const { request: getReloadDataRequest, loading } =
    useGeneralApis().getReloadData;
  const [shouldShowRealodBannerPopUp, setShouldShowRealodBannerPopup] =
    useState<boolean>(false);
  const [creditsPopUp, setCreditsPopUp] = useState<boolean>(false);
  const [reloadData, setReloadData] = useState<ReloadData | undefined>(
    undefined
  );
  const { refreshingEvent } = useAppSelector(
    (state: RootState) => state.general
  );
  const hideSelf = useCallback(() => {
    setShouldShowRealodBannerPopup(false);
  }, []);

  const { regionData } = useAppSelector(
    (state: RootState) => state.general
  );

  const getReloadData = useCallback(async () => {
    const { hasError, dataBody } = await getReloadDataRequest({});
    if (!hasError && dataBody !== undefined) {
      setReloadData(fixDataIssues(dataBody.data));
    }
  }, [getReloadDataRequest]);

  useEffect(() => {
    getReloadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Handle event from refreshing api event
  useEffect(() => {
    if (refreshingEvent?.REFRESH_APIS_EXPLORE_SCREEN) {
      if (
        refreshingEvent.REFRESH_APIS_EXPLORE_SCREEN.includes(
          EScreen.RELOAD_BANNER
        )
      ) {
        setReloadData(undefined);
        getReloadData();
      }
    } else if (refreshingEvent?.SUCCESSFULL_REDEMPTION) {
      setReloadData(undefined);
      getReloadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshingEvent]);

  return (
    <>
      <Pressable
        style={[
          styles.container,
          containerStyle,
          reloadData !== undefined && isAbleToReload(reloadData)
            ? { backgroundColor: COLORS.red }
            : { backgroundColor: COLORS.theme?.primaryShade["700"] }
        ]}
        onPress={() => {
          if (reloadData !== undefined && isAbleToReload(reloadData)) {
            navigation?.navigate("Reload");
          } else {
            setShouldShowRealodBannerPopup(true);
          }
        }}>
        {reloadData === undefined || loading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <View style={styles.dataContainer}>
            <View style={styles.timerContainer}>
              {!isAbleToReload(reloadData) && (
                <>
                  <AppLabel
                    style={styles.timerText}
                    text={STRINGS.explore.label_reloads_in}
                    textType={TEXT_TYPE.SEMI_BOLD}
                  />
                  <Timer
                    textStyle={styles.timerText}
                    diffInSeconds={reloadData.remaining_seconds}
                    isTicking={!reloadData.is_first_redeem}
                    onTimerEnded={() => {
                      setReloadData({
                        ...reloadData,
                        remaining_seconds: 0
                      });
                    }}
                  />
                </>
              )}
              {isAbleToReload(reloadData) && (
                <View
                  style={{
                    flexDirection: "column",
                    alignItems: "center"
                  }}>
                  <AppLabel
                    style={styles.congrats}
                    text={STRINGS.explore.label_congrats}
                    textType={TEXT_TYPE.SEMI_BOLD}
                  />
                  <AppLabel
                    style={styles.congrats}
                    text={STRINGS.explore.label_to_reload}
                    textType={TEXT_TYPE.SEMI_BOLD}
                  />
                </View>
              )}
            </View>
            <ReloadBannerInfo
              containerStyle={styles.savingContainer}
              label={STRINGS.explore.label_saving}
              value={Price.toString(
                reloadData.region?.currency_symbol,
                reloadData.saving,
                99
              )}
            />
            <Pressable
              onPress={() => setCreditsPopUp(true)}
              style={styles.creditsContainer}>
              <ReloadBannerInfo
                label={STRINGS.explore.label_credits}
                value={
                  reloadData.credit <= 999
                    ? reloadData.credit.toString()
                    : "999+"
                }
              />
            </Pressable>
          </View>
        )}
      </Pressable>
      {reloadData?.remaining_seconds === 604800 ? (
        <FirstRedeemDialog
          image={require("assets/images/reload_get_credits.webp")}
          isVisible={shouldShowRealodBannerPopUp}
          hideSelf={hideSelf}
          textOnImage={Strings.explore.heading_offers_dialog}
          message={Strings.explore.message_offers_dialog}
          buttonsText={[Strings.invite.invite_friends]}
          appButtonsProps={[
            {
              onPress: () => {
                navigation?.navigate("Invite");
                hideSelf();
              }
            }
          ]}
          customView={
            <>
              <View style={styles.flexContainer}>
                <View style={styles.subScriptionStyle}>
                  <AppLabel
                    text={Price.toString(
                      reloadData?.region?.currency_symbol,
                      reloadData?.saving_last_reload
                    )}
                    style={styles.currenyStyle}
                    textType={TEXT_TYPE.BOLD}
                  />
                </View>
                <View style={styles.textAlignment}>
                  <AppLabel
                    text={Strings.Reload.sub_text_1}
                    textType={TEXT_TYPE.BOLD}
                    style={styles.subScriptionText}
                    numberOfLines={0}
                  />
                </View>
              </View>
              <View style={styles.flexContainer}>
                <View style={styles.subScriptionStyle}>
                  <AppLabel
                    text={Price.toString(
                      reloadData?.region?.currency_symbol,
                      reloadData?.saving
                    )}
                    style={styles.currenyStyle}
                    textType={TEXT_TYPE.BOLD}
                  />
                </View>
                <View style={styles.textAlignment}>
                  <AppLabel
                    text={Strings.Reload.sub_text_2}
                    textType={TEXT_TYPE.BOLD}
                    style={styles.subScriptionText}
                    numberOfLines={0}
                  />
                </View>
              </View>
            </>
          }
        />
      ) : (
        <CustomAppDialog
          image={require("assets/images/reload_get_credits.webp")}
          isVisible={shouldShowRealodBannerPopUp}
          hideSelf={hideSelf}
          textContainerStyle={{ maxHeight: 80 }}
          textOnImage={Strings.explore.heading_reload_in}
          message={parameterizedString(
            Strings.explore.message_reload_in_dialog,
            regionData?.currency_symbol +
              " " +
              regionData?.reload.toFixed(2)
          )}
          buttonsText={[Strings.Reload.invite_friends_button_text]}
          appButtonsProps={[
            {
              onPress: () => {
                navigation?.navigate("Invite");
                hideSelf();
              }
            }
          ]}
        />
      )}
      {reloadData?.remaining_seconds! < 604800 && (
        <CustomAppDialog
          image={require("assets/images/credit_dialog_title_bg.webp")}
          isVisible={creditsPopUp}
          textContainerStyle={{ maxHeight: 70 }}
          hideSelf={() => setCreditsPopUp(false)}
          textOnImage={
            "You have " + reloadData?.credit.toString() + " Credits"
          }
          message={Strings.explore.message_credit_dialog}
          buttonsText={[Strings.explore.credit_dialog_button]}
          appButtonsProps={[
            {
              onPress: () => {
                navigation?.navigate("Invite");
                setCreditsPopUp(false);
              }
            }
          ]}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 54,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingHorizontal: SPACE.md
  },
  dataContainer: { flexDirection: "row" },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 4
  },
  timerText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.white
  },
  savingContainer: {
    flex: 1.5
  },
  creditsContainer: {
    flex: 1.2
  },
  congrats: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.white
  },
  currenyStyle: {
    color: "white",
    fontSize: FONT_SIZE.lg,
    textAlign: "center"
  },
  subScriptionStyle: {
    backgroundColor: COLORS.theme?.primaryShade[700],
    borderRadius: 50,
    marginTop: SPACE.xl,
    justifyContent: "center",
    width: 65,
    height: 65
  },
  subScriptionText: {
    // textAlign: "center"
    marginLeft: SPACE.md
  },
  flexContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  textAlignment: {
    marginTop: SPACE._3xl,
    flex: 1
  }
});

export default ReloadBanner;
