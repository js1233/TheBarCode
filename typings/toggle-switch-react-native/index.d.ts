declare module "toggle-switch-react-native" {
  import { StyleProp, ViewStyle } from "react-native";
  import React, { ReactElement } from "react";

  interface ToggleSwitchProps {
    isOn: boolean;
    label?: string;
    onColor: string;
    offColor: string;
    size?: string;
    labelStyle?: Object | ViewStyle;
    thumbOnStyle?: Object | ViewStyle;
    thumbOffStyle?: Object | ViewStyle;
    trackOnStyle?: Object | ViewStyle;
    trackOffStyle?: Object | ViewStyle;
    onToggle?: () => void;
    icon?: ReactElement | null;
    disabled?: boolean;
    animationSpeed?: number;
    useNativeDriver?: boolean;
    circleColor?: string;
    style?: StyleProp<any>;
  }

  export default class ToggleSwitch extends React.Component<ToggleSwitchProps> {}
}
