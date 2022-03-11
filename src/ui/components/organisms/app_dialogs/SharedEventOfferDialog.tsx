/* eslint-disable @typescript-eslint/no-unused-vars */
import Cross from "assets/images/ic_cross.svg";
import { COLORS, FONT_SIZE, SPACE } from "config";
import Strings from "config/Strings";
import React, { FC } from "react";
import { Image, Modal, Pressable, StyleSheet, View } from "react-native";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import { AppButton } from "ui/components/molecules/app_button/AppButton";
import { AppLog, parameterizedString } from "utils/Util";

type Props = {
  isVisible: boolean;
  hideSelf?: () => void;
  isOffer?: boolean;
  inviteeName?: string;
  onButtonClicked?: () => void;
};

const SharedEventOfferDialog: FC<Props> = ({
  isVisible,
  isOffer,
  hideSelf,
  inviteeName,
  onButtonClicked
}) => {
  return (
    <Modal
      testID="popup-modal"
      visible={isVisible}
      animationType="fade"
      transparent={true}>
      <View style={styles.root}>
        <View
          style={[
            styles.content,
            { backgroundColor: COLORS.theme?.primaryBackground }
          ]}>
          {/* <Pressable
            style={{
              position: "absolute",
              zIndex: 1,
              right: 15,
              top: 10
            }}
            onPress={hideSelf}>
            <Cross stroke={COLORS.white} width={20} height={20} />
          </Pressable> */}
          <AppLabel
            text={
              isOffer
                ? Strings.common.shared_offer
                : Strings.common.shared_event
            }
            textType={TEXT_TYPE.BOLD}
            style={styles.outOfCredit}
          />
          <Image
            source={require("assets/images/notification_title_bg.webp")}
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
            <AppLabel
              style={[styles.titleStyle, { fontSize: 12, lineHeight: 17 }]}
              text={parameterizedString(
                isOffer
                  ? Strings.common.shared_offer_congrats
                  : Strings.common.shared_event_congrats,
                inviteeName!
              )}
              numberOfLines={0}
            />
            <AppButton
              text={"Ok"}
              buttonStyle={{ height: 40, marginTop: SPACE.lg }}
              textType={TEXT_TYPE.SEMI_BOLD}
              onPress={onButtonClicked}
            />
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
    maxWidth: "70%",
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
    height: 170,
    overflow: "hidden",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    opacity: 0.8
  },
  outOfCredit: {
    position: "absolute",
    zIndex: 1,
    marginTop: 80,
    color: COLORS.white,
    fontSize: FONT_SIZE.base
  },
  textContainer: {
    flexDirection: "column",
    paddingVertical: SPACE.xl,
    paddingHorizontal: SPACE.md
  },
  titleStyle: {
    fontSize: FONT_SIZE._3xs,
    paddingLeft: SPACE.lg,
    paddingRight: SPACE.lg,
    textAlign: "left"
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
export default SharedEventOfferDialog;
