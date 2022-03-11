import React, { FC, useEffect, useRef, useState } from "react";
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle
} from "react-native";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import { secondsToTimer } from "utils/Util";

type Props = {
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  diffInSeconds: number;
  isTicking?: boolean;
  onTimerEnded?: () => void;
};

const Timer: FC<Props> = ({
  containerStyle,
  textStyle,
  diffInSeconds,
  isTicking = false,
  onTimerEnded
}) => {
  const timerRef = useRef<any>();

  const [seconds, setSeconds] = useState<number>(diffInSeconds);

  useEffect(() => {
    if (seconds > 0 && isTicking) {
      timerRef.current = setInterval(() => {
        const newValue = seconds - 1;
        setSeconds(newValue);
        if (newValue === 0) {
          onTimerEnded?.();
        }
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [seconds, isTicking, onTimerEnded]);

  return (
    <View style={[styles.container, containerStyle]}>
      <AppLabel
        style={textStyle}
        text={secondsToTimer(seconds)}
        textType={TEXT_TYPE.SEMI_BOLD}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {}
});

export default Timer;
