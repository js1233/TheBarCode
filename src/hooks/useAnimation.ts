import { useEffect, useState } from "react";
import { Animated, Easing } from "react-native";

export function useAnimation() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [anim, setAnim] = useState(new Animated.Value(0));

  const handleAnimation = () => {
    Animated.timing(anim, {
      toValue: 0,
      duration: 1500,
      easing: Easing.linear,
      useNativeDriver: false
    }).start(() => {
      Animated.timing(anim, {
        toValue: 0.3,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: false
      }).start(() => {
        Animated.timing(anim, {
          toValue: 0.6,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: false
        }).start(() => {
          Animated.timing(anim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.linear,
            useNativeDriver: false
          }).start(() => handleAnimation());
        });
      });
    });
  };
  useEffect(() => {
    handleAnimation();
  });
  return anim;
}
