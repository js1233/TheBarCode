import { useCallback } from "react";
import { Platform } from "react-native";
import GetLocation, { Location } from "react-native-get-location";
import {
  requestNotifications,
  RESULTS,
  requestMultiple,
  PERMISSIONS
} from "react-native-permissions";
import { AppLog, TAG } from "utils/Util";

export default (
  onLocationPermissionGranted?: (location?: Location) => void,
  onLocationPermissionDenied?: () => void,
  onNotificationPermissionGranted?: () => void
) => {
  const askPermission = useCallback(
    async (askNotificationPermission: boolean = false) => {
      if (askNotificationPermission) {
        if (Platform.OS === "ios") {
          const { status } = await requestNotifications([
            "alert",
            "sound"
          ]);

          if (status === RESULTS.GRANTED) {
            onNotificationPermissionGranted?.();
          }
        }
      }

      requestMultiple(
        Platform.OS === "android"
          ? [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]
          : [
              PERMISSIONS.IOS.LOCATION_ALWAYS,
              PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
            ]
      )
        .then(async (statuses) => {
          AppLog.log(
            () =>
              "Location permission granted " +
              JSON.stringify(
                statuses[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] ===
                  RESULTS.GRANTED
              ),
            TAG.REDEEM
          );

          if (
            Platform.OS === "android"
              ? statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] ===
                RESULTS.GRANTED
              : statuses[PERMISSIONS.IOS.LOCATION_ALWAYS] ===
                  RESULTS.GRANTED ||
                statuses[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] ===
                  RESULTS.GRANTED
          ) {
            AppLog.log(
              () => "Location permission granted ",
              TAG.AUTHENTICATION
            );

            const latLng = await GetLocation.getCurrentPosition({
              enableHighAccuracy: true,
              timeout: 15000
            });

            AppLog.log(
              () => "Location params : " + JSON.stringify(latLng),
              TAG.AUTHENTICATION
            );

            onLocationPermissionGranted?.(latLng);
          } else if (
            Platform.OS === "android"
              ? statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]
              : statuses[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] ===
                  RESULTS.DENIED ||
                statuses[PERMISSIONS.IOS.LOCATION_ALWAYS] ===
                  RESULTS.DENIED
          ) {
            AppLog.log(
              () => "Location permission result denied",
              TAG.AUTHENTICATION
            );

            onLocationPermissionDenied?.();
          } else if (
            Platform.OS === "android"
              ? statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]
              : statuses[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] ===
                  RESULTS.BLOCKED ||
                statuses[PERMISSIONS.IOS.LOCATION_ALWAYS] ===
                  RESULTS.BLOCKED
          ) {
            AppLog.log(
              () => "Location permission result blocked",
              TAG.AUTHENTICATION
            );

            onLocationPermissionDenied?.();
          }
        })
        .catch((error) => {
          AppLog.log(
            () => "Location permission error : " + JSON.stringify(error),
            TAG.AUTHENTICATION
          );
          onLocationPermissionDenied?.();
        });
    },
    [
      onLocationPermissionDenied,
      onLocationPermissionGranted,
      onNotificationPermissionGranted
    ]
  );

  return { askPermission };
};
