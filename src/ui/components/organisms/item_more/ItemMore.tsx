import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { AppLabel } from "ui/components/atoms/app_label/AppLabel";
import { FONT_SIZE, SPACE } from "config";
import EMoreType, { MoreProperty } from "models/enums/EMoreType";
import { useAppSelector } from "hooks/redux";
import { RootState } from "stores/store";

type Props = {
  moreType: MoreProperty;
  itemOnPress: (moreType: EMoreType) => void;
};

export const ItemMore = React.memo<Props>(({ moreType, itemOnPress }) => {
  const { notificationCount } = useAppSelector(
    (state: RootState) => state.general
  );

  return (
    <Pressable onPress={() => itemOnPress?.(moreType.displayText)}>
      {moreType.displayText === "Notifications" && notificationCount > 0 && (
        <View style={styles.notificationBadge}>
          <AppLabel
            text={
              notificationCount && notificationCount > 9
                ? "9+"
                : notificationCount?.toString()
            }
            style={styles.count}
          />
        </View>
      )}
      <View style={styles.container}>
        {moreType.icon?.(undefined, 22, 22)}
        <AppLabel text={moreType.displayText} style={styles.name} />
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    paddingVertical: SPACE._2lg,
    paddingLeft: SPACE.lg
  },
  name: {
    marginLeft: SPACE.sm,
    fontSize: FONT_SIZE.sm,
    paddingVertical: SPACE._2xs
  },
  notificationBadge: {
    flex: 1,
    width: 20,
    height: 20,
    borderRadius: 20 / 2,
    backgroundColor: "red",
    position: "absolute",
    left: 22,
    top: 10,
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  count: {
    color: "white",
    fontSize: Platform.OS === "android" ? SPACE._2md : FONT_SIZE._4xs,
    alignSelf: "center",
    textAlignVertical: "center",
    textAlign: "center"
  }
});
