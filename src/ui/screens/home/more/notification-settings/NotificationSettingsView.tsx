import React, { FC, MutableRefObject, useState } from "react";
import Screen from "ui/components/atoms/Screen";
import { StyleSheet, View } from "react-native";
import { COLORS, FONT_SIZE, SPACE } from "config";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import Strings from "config/Strings";
import { AppSwitch } from "ui/components/atoms/app_switch/AppSwitch";
import { UpdateNotificationRequestModel } from "models/api_requests/UpdateNotificationRequestModel";
import CustomAppDialog from "ui/components/organisms/app_dialogs/CustomAppDialog";

type Props = {
  requestModel: MutableRefObject<UpdateNotificationRequestModel>;
  shouldShowDialog: boolean;
  setShouldShowDialog: (value: React.SetStateAction<boolean>) => void;
  is5DayNotify: number;
  isLiveOfferNotify: number;
};
export const NotificationSettingsView: FC<Props> = ({
  requestModel,
  shouldShowDialog,
  setShouldShowDialog,
  is5DayNotify,
  isLiveOfferNotify
}) => {
  const [fiveDayNotify, setFiveDayNotify] = useState<boolean>(
    is5DayNotify === 1
  );

  const [liveOfferNotify, setLiveOfferNotify] = useState<boolean>(
    isLiveOfferNotify === 1
  );

  const [dialogMessage, setDialogMessage] = useState(
    Strings.NotificationSettings.trending_dialog_message
  );

  const onChangeTrendingAction = (isEnabled: boolean) => {
    if (!isEnabled) {
      setDialogMessage(
        Strings.NotificationSettings.trending_dialog_message
      );
      setShouldShowDialog(true);
      requestModel.current.is_5_day_notify = 0;
    } else {
      requestModel.current.is_5_day_notify = 1;
      setFiveDayNotify(true);
    }
  };

  const onChangeAlertAction = (isEnabled: boolean) => {
    if (!isEnabled) {
      setDialogMessage(
        Strings.NotificationSettings.postOffers_dialog_message
      );
      setShouldShowDialog(true);
      requestModel.current.is_live_offer_notify = 0;
    } else {
      requestModel.current.is_live_offer_notify = 1;
      setLiveOfferNotify(true);
    }
  };
  return (
    <>
      <Screen style={{ flex: 1 }} shouldAddBottomInset={false}>
        <AppLabel
          text={Strings.NotificationSettings.push_notification_settings}
          style={styles.pushNotifications}
          textType={TEXT_TYPE.BOLD}
        />

        <View style={styles.bottomContainer}>
          <View style={styles.componentDirection}>
            <AppLabel
              text={Strings.NotificationSettings.trendings_heading}
              style={styles.containerHeading}
              textType={TEXT_TYPE.BOLD}
            />
            <AppSwitch
              defaultValue={fiveDayNotify}
              showCustomThumb={true}
              style={styles.alignment}
              onValueChange={onChangeTrendingAction}
              shouldNeedCallBackCreate={true}
              shouldToggle={!fiveDayNotify}
            />
          </View>
          <AppLabel
            text={Strings.NotificationSettings.trendings_text}
            style={styles.containerText}
            textType={TEXT_TYPE.NORMAL}
          />
        </View>

        <View style={styles.bottomContainer}>
          <View style={styles.componentDirection}>
            <AppLabel
              text={Strings.NotificationSettings.live_alert_heading}
              style={styles.containerHeading}
              textType={TEXT_TYPE.BOLD}
            />
            <AppSwitch
              defaultValue={liveOfferNotify}
              showCustomThumb={true}
              style={styles.alignment}
              onValueChange={onChangeAlertAction}
              shouldNeedCallBackCreate={true}
              shouldToggle={!liveOfferNotify}
            />
          </View>
          <AppLabel
            text={Strings.NotificationSettings.live_alert_text}
            style={styles.containerText}
            textType={TEXT_TYPE.NORMAL}
          />
        </View>
      </Screen>

      <CustomAppDialog
        textOnImage={Strings.NotificationSettings.dialogue_title}
        message={dialogMessage}
        isVisible={shouldShowDialog}
        buttonsText={["OK"]}
        textContainerStyle={{ maxHeight: 50 }}
        appButtonsProps={[
          {
            onPress: () => {
              if (requestModel.current.is_live_offer_notify === 0) {
                setLiveOfferNotify(false);
              }
              if (requestModel.current.is_5_day_notify === 0) {
                setFiveDayNotify(false);
              }
              setShouldShowDialog(false);
            }
          }
        ]}
        hideSelf={() => {
          setShouldShowDialog(false);
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  bottomContainer: {
    borderColor: COLORS.theme?.borderColor,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: SPACE.lg,
    backgroundColor: COLORS.theme?.interface[50],
    marginLeft: SPACE.lg,
    marginRight: SPACE.lg
  },
  pushNotifications: {
    marginLeft: SPACE.lg,
    paddingTop: SPACE._2xl,
    fontSize: FONT_SIZE.sm
  },
  containerHeading: {
    marginLeft: SPACE.md,
    marginTop: SPACE.md,
    fontSize: FONT_SIZE.sm
  },
  containerText: {
    marginTop: SPACE._2md,
    marginLeft: SPACE.md,
    paddingBottom: SPACE.md,
    fontSize: FONT_SIZE._2xs
  },
  componentDirection: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  alignment: {
    alignSelf: "flex-end",
    marginRight: SPACE.md
  }
});
