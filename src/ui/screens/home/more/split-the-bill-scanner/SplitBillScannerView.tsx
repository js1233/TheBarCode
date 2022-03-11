import React, { FC, useEffect, useLayoutEffect, useRef } from "react";
import QRCodeScanner from "react-native-qrcode-scanner";
import { RNCamera as Camera } from "react-native-camera";
import { ActivityIndicator, Platform, StyleSheet } from "react-native";
import Screen from "ui/components/atoms/Screen";
import { COLORS, SPACE } from "config";
import { SplitBillScannerProp } from "./SplitBillScannerController";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import SimpleToast from "react-native-simple-toast";
import { PERMISSIONS, request, RESULTS } from "react-native-permissions";

type Props = {
  onSuccess: (e: any) => void;
  showProgressbar: boolean;
};

export const SplitBillScannerView: FC<Props> = ({
  onSuccess,
  showProgressbar
}) => {
  const navigation = useNavigation<SplitBillScannerProp>();

  let scannerRef = useRef<any>();

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      scannerRef?.reactivate();
    }
  }, [isFocused]);

  useLayoutEffect(() => {
    if (Platform.OS === "ios") {
      request(PERMISSIONS.IOS.CAMERA)
        .then((result) => {
          if (result === RESULTS.BLOCKED) {
            SimpleToast.show(
              "Please allow camera permission from settings"
            );
          } else {
          }
        })
        .catch();
    }
  }, []);

  return (
    <Screen style={styles.container}>
      <QRCodeScanner
        ref={(ref) => (scannerRef = ref)}
        onRead={onSuccess}
        cameraProps={{
          autoFocus: Camera.Constants.AutoFocus.on,
          flashMode: Camera.Constants.FlashMode.auto,
          onStatusChange: (cameraStatus) => {
            if (cameraStatus.cameraStatus === "NOT_AUTHORIZED") {
              navigation.pop();
            }
          }
        }}
        reactivate={false}
        showMarker={true}
        markerStyle={styles.markerStyle}
        cameraStyle={styles.cameraStyle}
        permissionDialogMessage={
          "We need your permission to use your camera"
        }
        permissionDialogTitle={"Permission to use camera"}
      />
      {showProgressbar && (
        <ActivityIndicator
          style={{ marginBottom: SPACE._4xl }}
          size={"large"}
          color={COLORS.theme?.interface[700]}
        />
      )}
    </Screen>
  );
};
const styles = StyleSheet.create({
  markerStyle: {
    borderColor: "red"
  },
  container: {
    flex: 1,
    paddingLeft: SPACE.lg,
    paddingRight: SPACE.lg
  },
  cameraStyle: {
    overflow: "hidden",
    height: 330,
    width: 330,
    borderRadius: 12,
    alignSelf: "center",
    marginBottom: 250
  }
});
