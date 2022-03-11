import { API, COLORS, Constants } from "config";
import React, { FC, useState } from "react";
import { StyleSheet } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import SimpleToast from "react-native-simple-toast";
import VersionCheck from "react-native-version-check";

interface Props {}

export const AppDebugView: FC<Props> = ({ children }) => {
  const showDebugStats = () => {
    let version = VersionCheck.getCurrentVersion();
    let baseApi = API.BASE_URL;
    let isForcedUpdateEnabled = Constants.SHOULD_ENABLE_FORCE_UPDATE;
    SimpleToast.show(
      `Version: ${version}\nBase URL: ${baseApi}\nisForcedUpdateEnabled: ${isForcedUpdateEnabled}`,
      SimpleToast.SHORT
    );
  };

  const COUNT_THRESHOLD = 5;
  const [pressCount, setPressCount] = useState(0);

  return (
    <TouchableWithoutFeedback
      style={children === undefined ? styles.debugView : undefined}
      onPress={() => {
        setPressCount((count) => count + 1);
        if (pressCount === COUNT_THRESHOLD) {
          setPressCount(0);
          showDebugStats();
        }
      }}>
      {children}
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  debugView: {
    position: "absolute",
    backgroundColor: COLORS.yellow,
    height: 30,
    width: 30,
    top: 0,
    start: 0
  }
});
