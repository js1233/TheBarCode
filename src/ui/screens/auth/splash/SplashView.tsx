import { NavigationContainer } from "@react-navigation/native";
import { COLORS } from "config";
import Env from "envs/env";
import { usePreferredTheme } from "hooks";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Linking,
  Platform,
  StyleSheet,
  View
} from "react-native";
import VersionCheck from "react-native-version-check";
import AuthStorage from "repo/auth/AuthStorage";
import { AuthRoutes } from "routes";
import { HomeRoutes } from "routes/HomeRoutes";
import { AppLog, shadowStyleProps, TAG } from "utils/Util";
import { setDynamicLink, updateRegionData } from "stores/generalSlice";
import { RootState } from "stores/store";
import { useAppDispatch, useAppSelector } from "hooks/redux";
import SplashLogo from "assets/images/splash_logo.svg";
import { useAuthApis } from "repo/auth/AuthApis";
import dynamicLinks from "@react-native-firebase/dynamic-links";
import Screen from "ui/components/atoms/Screen";
import { UpdateLocationRequest } from "models/api_requests/UpdateLocationRequest";
import { Location } from "react-native-get-location";
import usePermission from "../location_permission/usePermission";
import { setUser, updateUserProfile } from "stores/authSlice";
import { User } from "models/api_responses/SignInApiResponseModel";
import { PostInfluenceCountApiRequestModel } from "models/api_requests/PostInfluenceCountApiRequestModel";
import { useInviteApis } from "repo/invite/InviteApis";
import DeviceInfo from "react-native-device-info";
import SimpleToast from "react-native-simple-toast";
import useSendAnalytics from "hooks/useSendAnalytics";
import { ChangePasswordRequestModel } from "models/api_requests/ChangePasswordRequestModel";

interface Props {}

export const SplashView = React.memo<Props>(() => {
  AppLog.log(() => "Rendering SplashView...");

  const { user } = useAppSelector((state: RootState) => state.auth);
  const { shouldSkipLocationCheck } = useAppSelector(
    (state: RootState) => state.general
  );
  const dispatch = useAppDispatch();

  const [isReady, setIsReady] = useState(false);
  const [authInitialRoute, setAuthRoute] = useState<{
    name: string;
    params?: ChangePasswordRequestModel;
  }>({
    name: "PostSplash"
  });

  const { themedColors } = usePreferredTheme();
  const { sendAnalytics } = useSendAnalytics();

  useLayoutEffect(() => {
    Linking.getInitialURL().then((url) => {
      const isPaswordReset = url?.includes("password/set");
      const data = url?.split("/");
      const requestModel: ChangePasswordRequestModel = {
        email: data?.[6],
        token: data?.[5]
      };

      if (isPaswordReset) {
        setAuthRoute({
          name: "ChangePassword",
          params: { ...requestModel }
        });
      }
    });
  }, []);

  //This code will be used to update COLORS file according to the theme colors
  //i.e usePreferredTHeme hook
  // useEffect(() => {
  //   //update theme in color's file
  //   AppLog.log(
  //     () => "Update theme from splash " + JSON.stringify(themedColors),
  //     TAG.THEME
  //   );
  //   updateAppTheme(themedColors);

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [themedColors]);

  async function versionCheckLibraryImpl(): Promise<{
    isNeeded: boolean;
    storeUrl: string;
  }> {
    let versionCheckNeedUpdate: any;
    const noStoreUrlFound = {
      isNeeded: false,
      storeUrl: "N/A"
    };
    try {
      versionCheckNeedUpdate =
        (await VersionCheck.needUpdate()) ?? noStoreUrlFound;
    } catch (e) {
      // in case of no store url found
      AppLog.log(
        () => "Exception occurred.. No store url found..",
        TAG.VERSION_CHECK
      );
      versionCheckNeedUpdate = noStoreUrlFound;
    }

    AppLog.log(
      () =>
        "versionCheckNeedUpdate: " +
        JSON.stringify(versionCheckNeedUpdate),
      TAG.VERSION_CHECK
    );
    return versionCheckNeedUpdate;
  }

  async function checkForForcedUpdate() {
    return await versionCheckLibraryImpl();
  }

  //GET USER UPDATED LOCATION
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
    setIsReady(true);
  };

  const { askPermission } = usePermission(
    onLocationGranted,
    onLocationDenied,
    onNotificationPermissionGranted
  );

  const requestModel = useRef<UpdateLocationRequest>({
    latitude: "-1.0",
    longitude: "-1.0"
  });

  const { request: updateLocationRequest } =
    useAuthApis().updateLocationApi;

  const handleUpdateLocation = useCallback(async () => {
    if (requestModel.current === undefined) {
      return;
    }

    const { hasError, dataBody } = await updateLocationRequest(
      requestModel.current
    );

    if (hasError || dataBody === undefined) {
    } else {
      dispatch(
        updateUserProfile({
          latitude: dataBody.data.latitude ?? 0,
          longitude: dataBody.data.longitude ?? 0,
          is_location_updated: true
        } as User)
      );
    }

    setIsReady(true);
  }, [dispatch, updateLocationRequest]);
  //GET USER UPDATED LOCATION END
  const restoreUser = async () => {
    const _user = await AuthStorage.getUser();
    if (_user) {
      AppLog.log(
        () => "SplashView#restoreUser() => " + JSON.stringify(_user),
        TAG.AUTHENTICATION
      );
      sendAnalytics("app_view", "");
      dispatch(setUser(_user));
      askPermission(true);
    } else {
      setIsReady(true);
    }
  };

  function showForcedUpdateDialog(storeUrl: string) {
    Alert.alert(
      "Update available",
      "It looks like you are using an older version of our app. Please update to continue.",
      [
        {
          text: "Update",
          onPress: () => {
            BackHandler.exitApp();
            Linking.openURL(storeUrl);
          }
        }
      ]
    );
  }

  const { request: checkForceUpdate } = useAuthApis().checkForceUpdate;

  const checkForForceUpdate = useCallback(async () => {
    const { isNeeded, storeUrl } = await checkForForcedUpdate();

    /**
     * This api is only used tyo update region data, otherwise
     * version check is done by version check library, see method i.e checkForForcedUpdate()
     */

    const { hasError, dataBody } = await checkForceUpdate("123");
    if (hasError || dataBody === undefined) {
      //restore region data from local storage and insert in store
      const region = await AuthStorage.getRegionData();
      region && dispatch(updateRegionData(region));

      AppLog.log(
        () =>
          "fetched region data from storage : " + JSON.stringify(region),
        TAG.AUTHENTICATION
      );
      return { isNeeded: isNeeded, storeUrl: storeUrl };
    } else {
      //insert region data in store
      dispatch(updateRegionData(dataBody.data));
      return { isNeeded: isNeeded, storeUrl: storeUrl };
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function initializeApp() {
    let { isNeeded, storeUrl } = await checkForForceUpdate();
    if (isNeeded && Env.SHOULD_ENABLE_FORCE_UPDATE) {
      showForcedUpdateDialog(storeUrl);
    } else {
      if (!isReady) {
        setTimeout(() => {
          restoreUser().then(() => {
            AppLog.log(() => "Logging in...", TAG.AUTHENTICATION);
          });
        }, 2000);
      }
    }
  }

  useEffect(() => {
    initializeApp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  ///////////////////Dynamic Links Work///////////////////////////////

  const { request: postInfluenceIdRequest } =
    useInviteApis().updateInfluenceCount;
  const onPostInfluencerId = useCallback(
    async (id: string) => {
      const request: PostInfluenceCountApiRequestModel = {
        device_id: DeviceInfo.getUniqueId(),
        influencer_id: id,
        platform: Platform.OS
      };
      const { hasError, dataBody, errorBody } =
        await postInfluenceIdRequest(request);
      if (!hasError && dataBody !== undefined) {
        dispatch(setDynamicLink(undefined));
      } else {
        SimpleToast.show(errorBody!);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [postInfluenceIdRequest]
  );

  function doWorkedAfterGettingLink(link: string) {
    AppLog.log(() => "link.url: " + link, TAG.DYNAMIC_LINK);
    dispatch(setDynamicLink(link));
    if (
      link.split("influencer_id=")[1] !== null &&
      link.split("influencer_id=")[1] !== undefined
    ) {
      onPostInfluencerId(link.split("influencer_id=")[1]);
    }
  }

  // for foreground events
  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(async (link) => {
      AppLog.log(() => "in dynamicLinks.onLink..", TAG.DYNAMIC_LINK);
      if (link.url) {
        doWorkedAfterGettingLink(link?.url);
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // for background/quit events shared_by=371&offer_id=590&referral=YhRral6&shared_by_name=Abdul_Rehman_Anis
  useEffect(() => {
    dynamicLinks()
      .getInitialLink()
      .then((link) => {
        AppLog.log(() => "link.url: " + link, TAG.DYNAMIC_LINK);
        if (link?.url) {
          doWorkedAfterGettingLink(link?.url);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  ///////////////////Dynamic Links Work///////////////////////////////

  if (!isReady) {
    return (
      <Screen
        style={[
          styles.container,
          { backgroundColor: themedColors.secondaryBackground }
        ]}
        topSafeAreaAndStatusBarColor={themedColors.secondaryBackground}
        shouldAddBottomInset={false}>
        <View style={[styles.container]}>
          <SplashLogo width="200" height="80" />

          <View style={styles.loaderWrapper}>
            <ActivityIndicator
              size="small"
              color={themedColors.interface["900"]}
            />
          </View>
        </View>
      </Screen>
    );
  }

  return (
    <NavigationContainer>
      {AppLog.log(
        () => "User exists: " + (user !== undefined),
        TAG.AUTHENTICATION
      )}
      {AppLog.log(
        () => "user: " + JSON.stringify(user),
        TAG.AUTHENTICATION
      )}

      {AppLog.log(
        () =>
          "user location: " +
          JSON.stringify(user && user.is_location_updated),
        TAG.AUTHENTICATION
      )}

      {AppLog.log(
        () =>
          "user interest selected: " +
          JSON.stringify(user && user.is_interest_selected),
        TAG.AUTHENTICATION
      )}

      {user !== undefined ? (
        user?.is_interest_selected ? (
          user?.is_location_updated || shouldSkipLocationCheck ? (
            <HomeRoutes initialRouteName="Home" />
          ) : (
            <AuthRoutes initialRouteName="LocationPermission" />
          )
        ) : (
          <AuthRoutes initialRouteName="Preferences" />
        )
      ) : (
        <AuthRoutes
          initialRouteName={authInitialRoute.name}
          changePasswordParams={authInitialRoute.params}
        />
      )}
    </NavigationContainer>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },
  image: {
    width: 260,
    height: 87
  },
  imageContainer: {
    flex: 1
  },
  loaderWrapper: {
    padding: 5,
    backgroundColor: COLORS.white,
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    position: "absolute",
    bottom: 20,
    justifyContent: "center",
    ...shadowStyleProps
  }
});
