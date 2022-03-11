import React, { FC, useCallback, useEffect, useState } from "react";
import ReloadIcon from "assets/images/reload.svg";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import { COLORS, FONT_SIZE, SPACE } from "config";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import Strings from "config/Strings";
import { AppButton } from "ui/components/molecules/app_button/AppButton";
import Separator from "ui/components/atoms/separator/Separator";
import Screen from "ui/components/atoms/Screen";
import { useGeneralApis } from "repo/general/GeneralApis";
import ReloadData, { fixDataIssues } from "models/ReloadData";
import Timer from "ui/components/organisms/reload_banner/Timer";
import { AppLog, Price, TAG } from "utils/Util";
import { useAppSelector } from "hooks/redux";
import { RootState } from "stores/store";
import _ from "lodash";

type Props = {
  onInviteFriendsButtonClicked: () => void;
  onShareWithContactsButtonClicked: () => void;
  onReloadClicked: (reload: ReloadData) => void;
  loading: boolean;
};

export const ReloadView: FC<Props> = ({
  onInviteFriendsButtonClicked,
  onShareWithContactsButtonClicked,
  onReloadClicked,
  loading: buttonLoading
}) => {
  const { request: getReloadDataRequest, loading } =
    useGeneralApis().getReloadData;

  const { refreshingEvent, regionData } = useAppSelector(
    (state: RootState) => state.general
  );

  const [reloadData, setReloadData] = useState<ReloadData | undefined>(
    undefined
  );
  const getReloadData = useCallback(async () => {
    const { hasError, dataBody, errorBody } = await getReloadDataRequest(
      {}
    );
    if (!hasError && dataBody !== undefined) {
      setReloadData(_.cloneDeep(fixDataIssues(dataBody.data)));
    } else {
      AppLog.log(
        () => "error reload API" + errorBody,
        TAG.IN_APP_PURCHASE
      );
    }
  }, [getReloadDataRequest]);

  useEffect(() => {
    getReloadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (refreshingEvent?.SUCCESSFULL_PURCHASE) {
      getReloadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshingEvent]);

  return (
    <Screen style={styles.container} requiresSafeArea={false}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: SPACE.lg,
          paddingTop: SPACE._2xl
        }}>
        <ReloadIcon style={styles.iconStyle} />
        <View
          style={{
            height: 65
          }}>
          {reloadData === undefined || loading ? (
            <ActivityIndicator
              style={{ marginTop: SPACE._3xl }}
              color={COLORS.black}
            />
          ) : reloadData.remaining_seconds === 604800 ? (
            <AppLabel
              text={Strings.Reload.loader_main_text}
              style={[styles.timerText]}
              textType={TEXT_TYPE.BOLD}
            />
          ) : (
            <Timer
              textStyle={styles.timerText}
              diffInSeconds={reloadData.remaining_seconds}
              isTicking={reloadData && !reloadData.is_first_redeem}
              onTimerEnded={() => {
                setReloadData({ ...reloadData, remaining_seconds: 0 });
              }}
            />
          )}
        </View>
        {/* <AppLabel
                text={Strings.Reload.loader_main_text}
                style={styles.loaderText}
                textType={TEXT_TYPE.BOLD}
            /> */}
        <AppLabel
          text={Strings.Reload.loader_para}
          style={styles.loaderPara}
          textType={TEXT_TYPE.NORMAL}
          numberOfLines={3}
        />
        <View style={styles.mainView}>
          <View style={styles.bottomContainer}>
            <View style={styles.subScriptionStyle}>
              <AppLabel
                text={Price.toString(
                  regionData?.currency_symbol,
                  reloadData?.saving_last_reload
                )}
                style={styles.currenyStyle}
                textType={TEXT_TYPE.BOLD}
              />
            </View>
            <AppLabel
              text={Strings.Reload.sub_text_1}
              style={styles.subScriptionText}
              textType={TEXT_TYPE.BOLD}
              numberOfLines={0}
            />
          </View>
          <View style={styles.bottomContainer}>
            <View style={styles.subScriptionStyle}>
              <AppLabel
                text={Price.toString(
                  regionData?.currency_symbol,
                  reloadData?.saving
                )}
                style={styles.currenyStyle}
                textType={TEXT_TYPE.BOLD}
              />
            </View>
            <AppLabel
              text={Strings.Reload.sub_text_2}
              style={styles.subScriptionText}
              textType={TEXT_TYPE.BOLD}
              numberOfLines={0}
            />
          </View>
        </View>
        <View style={styles.creditContainer}>
          <AppLabel
            text={Strings.Reload.credit_text}
            style={styles.creditTextStyle}
            textType={TEXT_TYPE.BOLD}
          />
          {reloadData?.credit === undefined || loading ? (
            <ActivityIndicator
              style={{ marginTop: SPACE._2xl }}
              color={COLORS.black}
            />
          ) : (
            <AppLabel
              text={"" + reloadData?.credit}
              style={styles.creditTextStyle}
              textType={TEXT_TYPE.BOLD}
            />
          )}
        </View>
        <AppButton
          shouldShowProgressBar={buttonLoading}
          text={Strings.Reload.reload_button_text}
          buttonStyle={styles.reloadButton}
          textStyle={styles.buttonText}
          textType={TEXT_TYPE.BOLD}
          onPress={() => onReloadClicked(reloadData!)}
        />
        <Separator color={COLORS.theme?.interface[300]} thickness={0.5} />
        <AppLabel
          text={Strings.Reload.invite_text}
          style={styles.inviteText}
          textType={TEXT_TYPE.NORMAL}
          numberOfLines={3}
        />
        <View style={styles.buttonView}>
          <AppButton
            text={Strings.Reload.invite_friends_button_text}
            buttonStyle={styles.inviteAndShareButton}
            textStyle={styles.buttonText}
            textType={TEXT_TYPE.BOLD}
            onPress={onInviteFriendsButtonClicked}
          />
          <AppButton
            text={Strings.Reload.share_button_text}
            buttonStyle={styles.inviteAndShareButton}
            textStyle={styles.buttonText}
            textType={TEXT_TYPE.BOLD}
            onPress={onShareWithContactsButtonClicked}
          />
        </View>
      </ScrollView>
    </Screen>
  );
};
const styles = StyleSheet.create({
  timerText: {
    fontSize: FONT_SIZE.lg,
    marginTop: SPACE._3xl,
    color: COLORS.black,
    textAlign: "center"
  },
  container: {
    flex: 1
  },
  iconStyle: {
    alignSelf: "center"
  },
  loaderText: {
    marginTop: SPACE._3xl,
    textAlign: "center",
    fontSize: FONT_SIZE.lg
  },
  loaderPara: {
    marginTop: SPACE.md,
    textAlign: "center",
    fontSize: FONT_SIZE.xs
  },
  inviteText: {
    marginTop: SPACE._2xl,
    textAlign: "center",
    fontSize: FONT_SIZE.xs
  },
  bottomContainer: {
    borderColor: COLORS.theme?.interface[300],
    borderRadius: 12,
    borderWidth: 0.5,
    marginTop: SPACE.lg,
    backgroundColor: "white",
    width: "48%"
  },
  mainView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SPACE._2xl
  },
  buttonView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SPACE.lg,
    paddingBottom: SPACE.md
  },
  inviteAndShareButton: {
    width: "48%"
  },
  subScriptionStyle: {
    backgroundColor: COLORS.theme?.primaryShade[700],
    borderRadius: 50,
    marginTop: SPACE.lg,
    alignSelf: "center",
    justifyContent: "center",
    width: 80,
    height: 80
  },
  currenyStyle: {
    color: "white",
    fontSize: FONT_SIZE.lg,
    textAlign: "center"
  },
  subScriptionText: {
    padding: SPACE.md,
    textAlign: "center"
  },
  creditTextStyle: {
    textAlign: "center",
    marginTop: SPACE._2xl,
    fontSize: FONT_SIZE.lg
  },
  reloadButton: {
    marginTop: SPACE.lg,
    marginBottom: SPACE._2xl
  },
  buttonText: {
    fontSize: FONT_SIZE.sm
  },
  creditContainer: {
    flexDirection: "row",
    alignSelf: "center"
  }
});
