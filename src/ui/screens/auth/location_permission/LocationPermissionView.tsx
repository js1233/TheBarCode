import { COLORS, SPACE } from "config";
import React, { useCallback, useRef } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Image,
  View
} from "react-native";
import Screen from "ui/components/atoms/Screen";
import { AppLog, shadowStyleProps } from "utils/Util";
import TBC from "assets/images/tbc.svg";
import { AppButton } from "ui/components/molecules/app_button/AppButton";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import Strings from "config/Strings";
import { useAuthApis } from "repo/auth/AuthApis";
import { UpdateLocationRequest } from "models/api_requests/UpdateLocationRequest";
import { useAppDispatch, useAppSelector } from "hooks/redux";
import { Location } from "react-native-get-location";
import { RootState } from "stores/store";
import usePermission from "./usePermission";
import SimpleToast from "react-native-simple-toast";
import { setUser } from "stores/authSlice";
import { User } from "models/api_responses/SignInApiResponseModel";
import MapOffer from "assets/images/map_offer.svg";
import MapCover from "assets/images/map_cover.svg";

interface Props {}

export const LocationPermissionView = React.memo<Props>(() => {
  AppLog.log(() => "Rendering LocationPermissionScreen...");

  const { user } = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const isSkipPressed = useRef<boolean>(false);

  const requestModel = useRef<UpdateLocationRequest>({
    latitude: "-1.0",
    longitude: "-1.0",
    send_five_day_notification: false
  });

  const { request: updateLocationRequest, loading } =
    useAuthApis().updateLocationApi;

  const handleUpdateLocation = useCallback(async () => {
    if (requestModel.current === undefined) {
      return;
    }

    const { hasError, dataBody, errorBody } = await updateLocationRequest(
      requestModel.current
    );

    if (hasError || dataBody === undefined) {
      SimpleToast.show(
        errorBody ?? Strings.common.some_thing_bad_happened
      );
      return;
    } else {
      let updatedUser = { ...user };
      updatedUser!.latitude = dataBody.data.latitude ?? 0;
      updatedUser!.longitude = dataBody.data.longitude ?? 0;
      updatedUser!.credit = dataBody.data.credit;
      updatedUser!.is_location_updated = true;

      dispatch(setUser(updatedUser! as User));
    }
  }, [updateLocationRequest, user, dispatch]);

  const resetNavigation = useCallback(async () => {
    isSkipPressed.current = true;
    await handleUpdateLocation();
    isSkipPressed.current = false;
  }, [handleUpdateLocation]);

  const onNotificationPermissionGranted = () => {
    requestModel.current.send_five_day_notification = true;
  };

  const onLocationGranted = (location?: Location) => {
    requestModel.current!.latitude = !location
      ? "-1.0"
      : location.latitude.toString();
    requestModel.current!.longitude = !location
      ? "-1.0"
      : location.longitude.toString();

    if (Platform.OS === "android") {
      requestModel.current!.send_five_day_notification = true;
    }

    handleUpdateLocation();
  };

  const onLocationDenied = () => {
    if (Platform.OS === "android") {
      requestModel.current!.send_five_day_notification = true;
    }

    handleUpdateLocation();
  };

  const { askPermission } = usePermission(
    onLocationGranted,
    onLocationDenied,
    onNotificationPermissionGranted
  );

  const askingForPermission = async () => {
    askPermission(true);
  };

  return (
    <Screen
      style={styles.container}
      topSafeAreaAndStatusBarColor={COLORS.theme?.secondaryBackground}
      shouldAddBottomInset={false}>
      <View style={styles.wrapper}>
        <View style={{ alignItems: "center" }}>
          <TBC />
        </View>

        <View
          style={{
            flex: 1,
            paddingVertical: SPACE._2xl
          }}>
          <View
            style={{
              flexDirection: "column",
              flexGrow: 1
            }}>
            <Image
              source={require("assets/images/map_static.png")}
              style={{
                overflow: "hidden",
                height: "100%",
                width: "100%",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                flex: 0.7
              }}
              resizeMode="cover"
            />
            <View
              style={{
                borderBottomLeftRadius: 12,
                borderBottomRightRadius: 12,
                ...shadowStyleProps,
                marginHorizontal: 5,
                backgroundColor: "#FFFFFF",
                top: 0,
                flex: 0.3,
                overflow: "hidden"
              }}>
              <MapCover width="100%" style={{ flexGrow: 1, top: -15 }} />
            </View>
          </View>
          <MapOffer
            width={"85%"}
            style={{
              position: "absolute",
              top: "25%",
              alignSelf: "center"
            }}
          />
        </View>

        <AppButton
          text={Strings.common.ask_me}
          textType={TEXT_TYPE.SEMI_BOLD}
          buttonStyle={styles.btnStyle}
          onPress={askingForPermission}
          shouldShowProgressBar={!isSkipPressed.current && loading}
        />

        <View style={styles.bottomWrapper}>
          {isSkipPressed.current && loading ? (
            <ActivityIndicator
              testID="loader"
              size="small"
              color={COLORS.theme?.primaryColor}
            />
          ) : (
            <AppLabel
              text={Strings.common.skip}
              style={{ color: COLORS.theme?.interface["500"] }}
              textType={TEXT_TYPE.SEMI_BOLD}
              onPress={resetNavigation}
            />
          )}
        </View>
      </View>
    </Screen>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
    paddingVertical: SPACE.md,
    paddingHorizontal: SPACE.lg,
    backgroundColor: COLORS.theme?.secondaryBackground
  },
  wrapper: {},
  btnWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  signInAccount: {
    color: COLORS.theme?.interface["700"]
  },
  btnStyle: {
    marginBottom: SPACE._2xl
  },
  colorPrimary: {
    color: COLORS.theme?.primaryColor
  },
  bottomWrapper: {
    flexDirection: "row",
    justifyContent: "center"
  }
});
