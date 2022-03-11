import { DependencyList, EffectCallback, useEffect, useRef } from "react";

export default (effect: EffectCallback, deps?: DependencyList) => {
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    return effect();
  }, [effect, deps]);
};
