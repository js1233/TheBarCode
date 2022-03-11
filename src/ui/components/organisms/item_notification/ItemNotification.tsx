import { COLORS, FONT_SIZE, SPACE } from "config";
import Notification from "models/Notification";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import Bell from "assets/images/ic_bell_fill.svg";
import { timeFromNow } from "models/DateTime";
import { shadowStyleProps } from "utils/Util";

type Props = {
  notification: Notification;
  navigateToScreen: (notification: Notification) => void;
};

export const ItemNotification = React.memo<Props>(
  ({ notification, navigateToScreen }) => {
    return (
      <Pressable
        onPress={() => navigateToScreen(notification)}
        style={[styles.mainContainer]}>
        <View style={styles.container}>
          <View style={styles.iconWithMessage}>
            <View style={styles.roundedIcon}>
              <Bell width={15} height={15} />
            </View>
            <View style={styles.descriptionContainer}>
              <AppLabel
                text={notification.title}
                textType={TEXT_TYPE.BOLD}
                numberOfLines={0}
                style={{
                  color: COLORS.theme?.interface[900],
                  fontSize: FONT_SIZE._2xs
                }}
              />
              <AppLabel
                text={notification.message}
                numberOfLines={0}
                style={styles.message}
              />
              <AppLabel
                text={timeFromNow(notification.created_at)}
                style={[styles.time]}
              />
            </View>
          </View>
        </View>
      </Pressable>
    );
  }
);

export const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: SPACE.md,
    paddingRight: SPACE.lg,
    paddingLeft: SPACE.lg
  },
  container: {
    backgroundColor: COLORS.theme?.primaryBackground,
    borderColor: COLORS.theme?.interface[300],
    borderRadius: 10,
    // borderWidth: 0.5,
    padding: SPACE.md,
    ...shadowStyleProps,
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3
  },
  iconWithMessage: {
    flexDirection: "row"
  },
  roundedIcon: {
    width: 30,
    height: 30,
    backgroundColor: COLORS.theme?.primaryBackground,
    borderRadius: 30,
    borderColor: COLORS.theme?.interface[200],
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center"
  },
  descriptionContainer: { marginLeft: SPACE._2md, flex: 1 },
  message: { fontSize: FONT_SIZE._2xs, paddingTop: SPACE._2xs },
  time: {
    fontSize: FONT_SIZE._3xs,
    paddingTop: SPACE._2md,
    color: COLORS.theme?.interface[700]
  }
});
