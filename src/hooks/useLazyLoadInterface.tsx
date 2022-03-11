import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  InteractionManager,
  StyleSheet,
  View
} from "react-native";
import { usePreferredTheme } from "hooks/index";

export default (
  actualView: React.ReactNode,
  loadingView?: React.ReactNode,
  delayAfterInteraction?: number,
  dontCompleteInteractionTillNotTrue?: () => boolean
) => {
  const [interactionComplete, setInteractionComplete] = useState(false);
  const [showUserInterface, setShowUserInterface] = useState(
    !delayAfterInteraction && !dontCompleteInteractionTillNotTrue
  );
  const { themedColors } = usePreferredTheme();

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      if (!dontCompleteInteractionTillNotTrue) {
        setInteractionComplete(true);
      }
      if (delayAfterInteraction) {
        setTimeout(() => {
          setShowUserInterface(true);
        }, delayAfterInteraction);
      }
    });
  });

  useEffect(() => {
    if (dontCompleteInteractionTillNotTrue) {
      let shouldShow = dontCompleteInteractionTillNotTrue();
      setInteractionComplete(shouldShow);
      setShowUserInterface(shouldShow);
    }
  }, [dontCompleteInteractionTillNotTrue]);

  if (!interactionComplete) {
    return loadingView ? (
      loadingView
    ) : (
      <View style={styles.container}>
        <ActivityIndicator
          testID="initial-loader"
          style={styles.initialPb}
          size="small"
          color={themedColors.primaryColor}
        />
      </View>
    );
  } else {
    return (
      <>
        {actualView}
        {!showUserInterface && (
          <View style={styles.container}>
            <ActivityIndicator
              testID="initial-loader"
              style={styles.initialPb}
              size="small"
              color={themedColors.primaryColor}
            />
          </View>
        )}
      </>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "center"
  },
  initialPb: {
    justifyContent: "center",
    alignItems: "center"
  }
});
