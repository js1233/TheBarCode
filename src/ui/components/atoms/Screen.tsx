import { COLORS, SPACE } from "config";
import React from "react";
import {
  Keyboard,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewProps
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface OwnProps extends ViewProps {
  // default false
  shouldKeyboardDismissOnTouch?: boolean;
  topSafeAreaAndStatusBarColor?: string; //default is theme.themedColor.background
  bottomSafeAreaColor?: string; //default is theme.themedColor.background
  contentViewBackgroundColor?: string; //default is theme.themedColor.backgroundSecondary
  onPress?: () => void;
  shouldAddBottomInset?: boolean;
  requiresSafeArea?: boolean;
  requiresExplicitPadding?: boolean;
}

type Props = OwnProps;

const Screen: React.FC<Props> = ({
  shouldKeyboardDismissOnTouch = false,
  style,
  topSafeAreaAndStatusBarColor,
  bottomSafeAreaColor,
  contentViewBackgroundColor,
  shouldAddBottomInset = true,
  requiresSafeArea = true,
  children,
  onLayout,
  onPress,
  requiresExplicitPadding = true
}) => {
  let view = shouldKeyboardDismissOnTouch ? (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
      onLayout={onLayout}>
      <View style={[style]}>{children}</View>
    </TouchableWithoutFeedback>
  ) : onPress ? (
    <TouchableWithoutFeedback onPress={onPress} onLayout={onLayout}>
      <View style={[style]}>{children}</View>
    </TouchableWithoutFeedback>
  ) : (
    <View style={[style]}>{children}</View>
  );

  const safeAreaInset = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            topSafeAreaAndStatusBarColor ?? COLORS.theme?.interface["50"]
        }
      ]}>
      {requiresSafeArea ? (
        <SafeAreaView
          style={[
            styles.container,
            {
              backgroundColor:
                contentViewBackgroundColor ??
                COLORS.theme?.interface["100"]
            }
          ]}>
          <StatusBar
            backgroundColor={
              topSafeAreaAndStatusBarColor ?? COLORS.theme?.interface["50"]
            }
            barStyle="dark-content"
          />
          {view}
        </SafeAreaView>
      ) : (
        <View
          style={[
            styles.container,
            {
              backgroundColor:
                contentViewBackgroundColor ??
                COLORS.theme?.interface["100"]
            }
          ]}>
          <StatusBar
            backgroundColor={
              topSafeAreaAndStatusBarColor ?? COLORS.theme?.interface["50"]
            }
            barStyle="dark-content"
          />
          {view}
        </View>
      )}

      {shouldAddBottomInset && requiresSafeArea && (
        <View
          style={[
            {
              height:
                safeAreaInset.bottom === 0 && requiresExplicitPadding
                  ? SPACE.lg
                  : safeAreaInset.bottom,
              backgroundColor:
                bottomSafeAreaColor ?? COLORS.theme?.primaryBackground
            },
            styles.bottomSafeArea
          ]}
        />
      )}
    </View>
  );
};

export default Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "red"
  },
  wrapper: {
    flex: 1
  },
  bottomSafeArea: {
    width: "100%",
    alignSelf: "flex-end"
  }
});
