import React, { useEffect, useState } from "react";
import {
  // StyleProp,
  StyleSheet,
  SwitchProps
  // ViewStyle
} from "react-native";
import { AppLog, TAG } from "utils/Util";
import ToggleSwitch from "toggle-switch-react-native";
import { usePreferredTheme } from "hooks";
import SwitchActive from "assets/images/switch_active.svg";
import SwitchInActive from "assets/images/switch_inactive.svg";

export interface AppButtonProps extends SwitchProps {
  defaultValue: boolean;
  onValueChange: (isSwitchEnabled: boolean) => void;
  // style?: StyleProp<ViewStyle>;
  showCustomThumb?: boolean;
  shouldNeedCallBackCreate?: boolean;
  shouldToggle?: boolean;
}

export const AppSwitch = React.memo<AppButtonProps>(
  ({
    defaultValue,
    onValueChange,
    showCustomThumb = false,
    shouldNeedCallBackCreate = false,
    shouldToggle = true,
    // style,
    ...rest
  }) => {
    const [isEnabled, setIsEnabled] = useState<boolean>(defaultValue);
    const { themedColors } = usePreferredTheme();

    useEffect(() => {
      if (!shouldNeedCallBackCreate) {
        onValueChange(defaultValue);
      }
    }, [shouldNeedCallBackCreate, defaultValue, onValueChange]);

    useEffect(() => {
      if (shouldToggle) {
        setIsEnabled(defaultValue);
      }
    }, [shouldToggle, defaultValue]);

    const toggleSwitch = () => {
      if (!shouldToggle) {
        AppLog.log(() => "AppSwitch() => toggle working", TAG.VENUE);
        onValueChange(!isEnabled);
      } else {
        setIsEnabled((previousState) => !previousState);
        onValueChange(!isEnabled);
      }
    };
    // houldToggleTrue === false ? isEnabled : !isEnabled
    return (
      <ToggleSwitch
        testID="app-switch"
        isOn={isEnabled}
        onColor={themedColors.primaryColor}
        offColor={themedColors.secondaryColor}
        onToggle={toggleSwitch}
        thumbOffStyle={styles.thumb}
        icon={
          showCustomThumb ? (
            isEnabled ? (
              <SwitchActive width={20} height={20} />
            ) : (
              <SwitchInActive width={20} height={20} />
            )
          ) : null
        }
        {...rest}
      />
    );
  }
);

const styles = StyleSheet.create({
  switch: {},
  thumb: {},
  tinyLogo: {
    width: 20,
    height: 20
  }
});
