import { COLORS, FONT_SIZE, SPACE } from "config";
import Strings from "config/Strings";
import { usePreferredTheme } from "hooks";
import React, {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState
} from "react";
import { View, Modal, StyleSheet, Image, Pressable } from "react-native";
import {
  AppLabel,
  AppLabelProps,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import { AppButton } from "ui/components/molecules/app_button/AppButton";
import TBC from "assets/images/tbc.svg";
import Info from "assets/images/info.svg";
import Cross from "assets/images/ic_cross.svg";
import EOutOfCredit from "models/enums/EOutOfCredit";
import { useAppSelector } from "hooks/redux";
import { RootState } from "stores/store";
import { AppLog, Price, TAG } from "utils/Util";
import useIAPHandler from "utils/useIAPHandler";
import { fixDataIssues, isAbleToReload } from "models/ReloadData";
import SimpleToast from "react-native-simple-toast";
import { useGeneralApis } from "repo/general/GeneralApis";

export type Action = {
  title: string;
  style?: AppLabelProps;
  onPress: () => void;
};

type Props = {
  isVisible: boolean;
  onReloadBtnClick: () => void;
  onInviteBtnClick: () => void;
  onClose: () => void;
  venueId: number;
  type: EOutOfCredit | undefined;
};

const DialogOutOfCredit: FC<Props> = ({
  isVisible,
  onReloadBtnClick,
  onInviteBtnClick,
  onClose,
  venueId,
  type
}) => {
  const theme = usePreferredTheme();
  const { regionData } = useAppSelector(
    (state: RootState) => state.general
  );

  const [titleOne, setTitleOne] = useState<string>(
    Strings.dialogs.outOfCredit.msg_invite
  );
  const [titleTwo, setTitleTwo] = useState<string>(
    Strings.dialogs.outOfCredit.get_credits
  );

  const { fetchProducts, purchaseProduct, removeConnections, loading } =
    useIAPHandler();

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      removeConnections();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { request: getReloadDataRequest } = useGeneralApis().getReloadData;
  const getReloadData = useCallback(async () => {
    const { hasError, dataBody, errorBody } = await getReloadDataRequest(
      {}
    );
    if (!hasError && dataBody !== undefined) {
      if (
        !isAbleToReload(fixDataIssues(dataBody.data)) &&
        dataBody.data.credit === 0
      ) {
        purchaseProduct(false, `${venueId}`);
      } else {
        SimpleToast.show(
          "You Are Already Fully Loaded You can use all available offers and credits now. Reload again in 7 days."
        );
      }
    } else {
      SimpleToast.show(errorBody!);
    }
  }, [getReloadDataRequest, purchaseProduct, venueId]);

  const onReloadUnlimitedRedemption = () => {
    onClose?.();
    getReloadData();
  };

  useLayoutEffect(() => {
    AppLog.log(
      () => "DialogOutOfCredit# type => " + JSON.stringify(type),
      TAG.REDEEM
    );

    if (type === EOutOfCredit.ABLE_TO_RELOAD) {
      setTitleOne(Strings.dialogs.outOfCredit.msg_reload_now);
      setTitleTwo(Strings.dialogs.outOfCredit.out_of_credit_blue);
    } else if (type === EOutOfCredit.NOT_ABLE_TO_RELOAD) {
      setTitleOne(Strings.dialogs.outOfCredit.msg_invite);
      setTitleTwo("");
    } else if (type === EOutOfCredit.UNLIMITED_RELOAD_INVITE) {
      setTitleOne(
        `This venue offers unlimited redemption. Pay ${Price.toString(
          regionData?.currency_symbol,
          regionData?.reload ?? 0.0
        )} and you can redeem any offer till the venue closes.`
      );
      setTitleTwo(Strings.dialogs.outOfCredit.out_of_credit_blue);
    } else if (type === EOutOfCredit.UNLIMITED_RELOAD) {
      setTitleOne(
        `This venue offers unlimited redemption. Pay ${Price.toString(
          regionData?.currency_symbol,
          regionData?.reload ?? 0.0
        )} and you can redeem any offer till the venue closes.`
      );
    } else {
      // Timer expired, user now need to reload in order to use credits
      setTitleOne(Strings.dialogs.outOfCredit.msg_reload_now1);
      setTitleTwo("");
    }
  }, [type, isVisible, regionData?.reload, regionData?.currency_symbol]);

  if (!isVisible) {
    return null;
  }

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
            text={
              type === EOutOfCredit.UNLIMITED_RELOAD
                ? Strings.dialogs.outOfCredit.unlimited_redemption
                : Strings.dialogs.outOfCredit.out_of_credit
            }
            textType={TEXT_TYPE.BOLD}
            style={styles.redeemDialog}
          />
          <Image
            source={require("assets/images/credit_dialog_title_bg.webp")}
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

          <View style={styles.logoWrapper}>
            <TBC
              height={25}
              width={25}
              stroke={COLORS.theme?.secondaryBackground}
              fill={COLORS.theme?.secondaryBackground}
            />

            <Info
              fill={COLORS.red}
              style={{ position: "absolute", top: 0, right: 0 }}
            />
          </View>

          <View style={styles.textContainer}>
            <AppLabel
              style={[styles.titleStyle]}
              text={titleOne}
              numberOfLines={0}
            />

            {type !== EOutOfCredit.UNLIMITED_RELOAD && (
              <AppLabel
                style={styles.titleStyle}
                text={titleTwo}
                numberOfLines={0}
              />
            )}

            {type !== EOutOfCredit.NOT_ABLE_TO_RELOAD && (
              <AppButton
                text={
                  type === EOutOfCredit.UNLIMITED_RELOAD ||
                  type === EOutOfCredit.UNLIMITED_RELOAD_INVITE
                    ? Strings.dialogs.outOfCredit.unlimited_redemption
                    : "Reload"
                }
                buttonStyle={{ height: 40 }}
                shouldShowProgressBar={loading}
                textType={TEXT_TYPE.SEMI_BOLD}
                onPress={() => {
                  type === EOutOfCredit.UNLIMITED_RELOAD ||
                  type === EOutOfCredit.UNLIMITED_RELOAD_INVITE
                    ? onReloadUnlimitedRedemption()
                    : onReloadBtnClick();
                }}
              />
            )}

            {(type === EOutOfCredit.ABLE_TO_RELOAD ||
              type === EOutOfCredit.NOT_ABLE_TO_RELOAD ||
              type === EOutOfCredit.UNLIMITED_RELOAD_INVITE) && (
              <AppButton
                text="Invite"
                buttonStyle={{ marginTop: SPACE.md, height: 40 }}
                textType={TEXT_TYPE.SEMI_BOLD}
                onPress={onInviteBtnClick}
              />
            )}
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
  redeemDialog: {
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
    paddingBottom: SPACE.lg,
    paddingLeft: SPACE.md,
    paddingRight: SPACE.md
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

export default DialogOutOfCredit;
