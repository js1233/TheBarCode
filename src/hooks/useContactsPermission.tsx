import { useCallback } from "react";
import { Platform } from "react-native";
import {
  PERMISSIONS,
  requestMultiple,
  RESULTS
} from "react-native-permissions";
import { AppLog } from "utils/Util";

export default (onSuccess: () => void, onFailure: () => void) => {
  const askPermission = useCallback(async () => {
    requestMultiple(
      Platform.OS === "android"
        ? [
            PERMISSIONS.ANDROID.READ_CONTACTS,
            PERMISSIONS.ANDROID.WRITE_CONTACTS
          ]
        : [PERMISSIONS.IOS.CONTACTS]
    ).then(async (status) => {
      AppLog.log(
        () => "permission: " + JSON.stringify(status),
        "permissions"
      );
      if (
        Platform.OS === "android"
          ? status[
              (PERMISSIONS.ANDROID.READ_CONTACTS,
              PERMISSIONS.ANDROID.WRITE_CONTACTS)
            ] === RESULTS.GRANTED
          : status[PERMISSIONS.IOS.CONTACTS] === RESULTS.GRANTED
      ) {
        AppLog.log(() => "In RESULTS.GRANTED ", "permissions");
        onSuccess();
      } else if (
        Platform.OS === "android"
          ? status[
              (PERMISSIONS.ANDROID.READ_CONTACTS,
              PERMISSIONS.ANDROID.WRITE_CONTACTS)
            ] === RESULTS.DENIED
          : status[PERMISSIONS.IOS.CONTACTS] === RESULTS.DENIED
      ) {
        AppLog.log(() => "in RESULTS.DENIED ", "permissions");
        onFailure();
      } else if (
        Platform.OS === "android"
          ? status[
              (PERMISSIONS.ANDROID.READ_CONTACTS,
              PERMISSIONS.ANDROID.WRITE_CONTACTS)
            ] === RESULTS.BLOCKED
          : status[PERMISSIONS.IOS.CONTACTS] === RESULTS.BLOCKED
      ) {
        AppLog.log(() => "in RESULTS.BLOCKED ", "permissions");
        onFailure();
      } else if (
        Platform.OS === "android"
          ? status[
              (PERMISSIONS.ANDROID.READ_CONTACTS,
              PERMISSIONS.ANDROID.WRITE_CONTACTS)
            ] === RESULTS.UNAVAILABLE
          : status[PERMISSIONS.IOS.CONTACTS] === RESULTS.UNAVAILABLE
      ) {
        AppLog.log(() => "in RESULTS.UNAVAILABLE ", "permissions");
        onFailure();
      }
    });
  }, [onFailure, onSuccess]);
  return { askPermission };
};
