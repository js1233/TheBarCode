import React, { FC } from "react";
import {
  Image,
  ImageSourcePropType,
  Modal,
  Pressable,
  StyleSheet,
  View
} from "react-native";
import { COLORS, FONT_SIZE, SPACE } from "config";
import Cross from "assets/images/ic_cross.svg";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import {
  AppButton,
  AppButtonProps
} from "ui/components/molecules/app_button/AppButton";

export enum BUTTONS_DIRECTION {
  HORIZONTAL = "horizontal",
  VERTICAL = "vertical"
}

export type Props = {
  image?: ImageSourcePropType;
  textOnImage?: string;
  message?: string;
  isVisible: boolean;
  hideSelf?: () => void;
  buttonsAlign?: BUTTONS_DIRECTION;
  buttonsText?: Array<string>;
  appButtonsProps?: Array<AppButtonProps>;
  customView?: React.ReactElement | null;
};

const FirstRedeemDialog: FC<Props> = ({
  image,
  textOnImage,
  message,
  isVisible,
  hideSelf,
  buttonsAlign = BUTTONS_DIRECTION.VERTICAL,
  buttonsText,
  appButtonsProps,
  customView
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
          <Pressable style={styles.crossIconContainer} onPress={hideSelf}>
            <Cross stroke={COLORS.white} width={20} height={20} />
          </Pressable>
          <AppLabel
            text={textOnImage}
            textType={TEXT_TYPE.BOLD}
            numberOfLines={0}
            style={styles.outOfCredit}
          />
          <Image
            source={
              image
                ? image
                : require("assets/images/notification_title_bg.webp")
            }
            style={styles.imgBg}
            resizeMode="cover"
          />
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
          <View style={styles.textContainer}>
            <View style={{ flex: 1 }}>
              {message && (
                <AppLabel
                  style={[
                    styles.titleStyle,
                    { fontSize: 12, lineHeight: 17 }
                  ]}
                  text={message}
                  numberOfLines={0}
                />
              )}
              {customView}
            </View>
            <View
              style={[
                {
                  flexDirection:
                    buttonsAlign === BUTTONS_DIRECTION.HORIZONTAL
                      ? "row"
                      : "column",
                  width:
                    buttonsAlign === BUTTONS_DIRECTION.HORIZONTAL
                      ? "50%"
                      : "100%"
                }
              ]}>
              {buttonsText?.length! > 0 &&
                buttonsText?.map((buttonText, index) => (
                  <AppButton
                    key={index}
                    text={buttonText}
                    buttonStyle={[
                      styles.buttons,
                      buttonsAlign === BUTTONS_DIRECTION.HORIZONTAL
                        ? index === 0
                          ? { marginRight: SPACE.xs }
                          : { marginLeft: SPACE.xs }
                        : null,
                      message
                        ? { marginTop: SPACE.xl }
                        : { marginTop: SPACE._2xs }
                    ]}
                    textType={TEXT_TYPE.SEMI_BOLD}
                    {...appButtonsProps?.[index]}
                  />
                ))}
            </View>
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
    maxWidth: "85%",
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
    paddingHorizontal: SPACE._2md,
    textAlign: "center",
    color: COLORS.white,
    fontSize: FONT_SIZE.base
  },
  textContainer: {
    flexDirection: "column",
    paddingVertical: SPACE.md,
    paddingHorizontal: SPACE.xl,
    maxHeight: 400
  },
  titleStyle: {
    fontSize: FONT_SIZE._3xs,
    // paddingLeft: SPACE.lg,
    // paddingRight: SPACE.lg,
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
  messageText: { fontSize: FONT_SIZE.sm },
  crossIconContainer: {
    position: "absolute",
    zIndex: 1,
    right: 0,
    top: 0,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center"
  },
  buttons: {
    height: 40,
    marginTop: SPACE.lg
  }
});

export default FirstRedeemDialog;
