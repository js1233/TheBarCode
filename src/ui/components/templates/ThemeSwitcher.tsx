import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { AppLabel } from "ui/components/atoms/app_label/AppLabel";
import { AppSwitch } from "ui/components/atoms/app_switch/AppSwitch";
import { usePreferredTheme } from "hooks";
import { AppColorScheme } from "hooks/theme";

type props = {
  children: React.ReactNode;
};

export const ThemeSwitcher = React.memo<props>(({ children }) => {
  const { themedColors, setScheme, isDark } = usePreferredTheme();

  const [text, setText] = useState(
    isDark ? "Switch to light theme." : "Switch to dark theme."
  );

  return (
    <ScrollView
      style={[
        styles.root,
        { backgroundColor: themedColors.secondaryBackground }
      ]}>
      <>
        {children}

        {/* theme switcher */}
        <View
          style={[
            styles.themeSwitcherRoot,
            {
              borderTopColor: themedColors.interface["900"]
            }
          ]}>
          <AppLabel
            text={text}
            style={{ color: themedColors.interface["900"] }}
          />
          <AppSwitch
            defaultValue={isDark}
            showCustomThumb={true}
            onValueChange={(isEnabled) => {
              setText(
                isEnabled
                  ? "Switch to light theme."
                  : "Switch to dark theme."
              );
              setScheme(
                isEnabled ? AppColorScheme.DARK : AppColorScheme.LIGHT
              );
            }}
          />
        </View>
        {/* theme switcher */}
      </>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  root: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    flex: 1,
    flexDirection: "column",
    flexGrow: 1
  },
  themeSwitcherRoot: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    marginBottom: 16,
    borderTopWidth: 1
  }
});
