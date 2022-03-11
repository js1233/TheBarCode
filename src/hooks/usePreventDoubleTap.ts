import { useRef } from "react";

export default (
  callback: any,
  timeBlocked = 1000
): ((...args: any[]) => void) => {
  const isBlockedRef = useRef(false);
  const unblockTimeout = useRef<any>();

  return (...callbackArgs) => {
    if (!isBlockedRef.current) {
      callback(...callbackArgs);
    }
    if (unblockTimeout.current !== undefined) {
      clearTimeout(unblockTimeout.current);
    }
    unblockTimeout.current = setTimeout(
      () => (isBlockedRef.current = false),
      timeBlocked
    );
    isBlockedRef.current = true;
  };
};
