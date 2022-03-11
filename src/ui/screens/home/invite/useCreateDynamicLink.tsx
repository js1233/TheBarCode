import dynamicLinks from "@react-native-firebase/dynamic-links";
import Env from "envs/env";
import { usePreventDoubleTap } from "hooks";
import { PostInviteLinkApiRequestModel } from "models/api_requests/PostInviteLinkApiRequestModel";
import { useRef } from "react";
import { Platform, Share } from "react-native";
import { useInviteApis } from "repo/invite/InviteApis";
import { AppLog, TAG } from "utils/Util";

export enum DYNAMIC_LINK_TYPE {
  FIVE_A_DAY = "five_a_day"
}

export const useCreateDynamicLink = (
  domainUriPrefix: string,
  customMessage: string,
  shouldOpenShareFeature: boolean,
  shouldCallPostAppLinkApi: boolean,
  linkToBeCreatedDynamic: string
) => {
  //const { user } = useAppSelector((state: RootState) => state.auth);
  AppLog.log(
    () => "linkToBeCreatedDynamic: " + linkToBeCreatedDynamic,
    TAG.EDITS
  );
  let link = useRef("");
  async function buildLink() {
    AppLog.log(
      () =>
        "Env.BASE_URL + linkToBeCreatedDynamic: " +
        Env.BASE_URL +
        linkToBeCreatedDynamic,
      TAG.EDITS
    );
    link.current = await dynamicLinks().buildShortLink({
      link: Env.BASE_URL + linkToBeCreatedDynamic,
      domainUriPrefix: domainUriPrefix,
      android: {
        packageName: "com.milnesmayltd.thebarcode",
        fallbackUrl:
          "https://play.google.com/store/apps/details?id=com.milnesmayltd.thebarcode"
      },
      ios: {
        bundleId: "com.cygnismedia.thebarcodeapp",
        appStoreId: "1589438138",
        fallbackUrl:
          "https://apps.apple.com/us/app/the-barcode-app/id1441084506"
      },
      social: {
        imageUrl:
          "https://thebarcode-dev.cygnis.dev/storage/light-tbc-logo.png",
        title: "The BarCode Invitation",
        descriptionText: customMessage
      }
    });
    AppLog.log(
      () => "Generated dynamic link: " + link.current,
      TAG.DYNAMIC_LINK
    );
    if (shouldOpenShareFeature) {
      onShare();
    }
  }
  //buildLink();

  const { request: postAppLinkRequest } =
    useInviteApis().postAppLinkShared;

  const onPostAppLinkApi = async (sharedThrough: string) => {
    const requestModel: PostInviteLinkApiRequestModel = {
      shared_through: sharedThrough
    };
    await postAppLinkRequest(requestModel);
  };

  const onShare = usePreventDoubleTap(async () => {
    AppLog.log(() => "share: ", TAG.EDITS);
    try {
      await Share.share({
        title: "App link",
        message: customMessage + link.current,
        url: customMessage + link.current
      }).then((result) => {
        if (Platform.OS === "android") {
          if (shouldCallPostAppLinkApi) {
            onPostAppLinkApi("android");
          }
        }
        if (result.action === Share.sharedAction) {
          AppLog.log(() => "result: " + JSON.stringify(result), TAG.EDITS);
          if (result.activityType) {
            if (shouldCallPostAppLinkApi) {
              onPostAppLinkApi(result.activityType);
            }
            AppLog.log(() => "shared1: " + result.activityType, TAG.EDITS);
            // shared with activity type of result.activityType
          } else {
            AppLog.log(() => "shared2: " + result.activityType, TAG.EDITS);
            // shared
          }
        } else if (result.action === Share.dismissedAction) {
          AppLog.log(() => "dismissed: ", TAG.EDITS);
          // dismissed
        }
      });
    } catch (error) {
      AppLog.log(() => JSON.stringify(error), TAG.EDITS);
    }
  });

  const getLink = () => {
    return link.current;
  };

  return { buildLink, getLink };
};
