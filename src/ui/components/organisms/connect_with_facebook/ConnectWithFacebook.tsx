import Facebook from "assets/images/fb_with_circle.svg";
import { COLORS } from "config";
import Strings from "config/Strings";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager
} from "react-native-fbsdk-next";
import { TEXT_TYPE } from "ui/components/atoms/app_label/AppLabel";
import { AppButton } from "ui/components/molecules/app_button/AppButton";
import { AppLog, TAG } from "utils/Util";

enum EPermission {
  PUBLIC_PROFILE = "public_profile",
  USER_EMAIL = "email",
  NAME = "name",
  FIRST_NAME = "first_name",
  LAST_NAME = "last_name",
  BIRTHDAY = "birthday"
}

export interface ConnectWithFacebookProps {
  text?: string;
  callbackOnSuccess?: (result: SocialAccountResponse) => void;
  callbackOnFailure?: (error: any) => void;
  permissions?: string[];
}

export interface SocialAccountResponse {
  id?: string;
  userName: string;
  email?: string;
  accessToken: string;
  imageUrl?: string;
}
export const ConnectWithFacebook = React.memo<ConnectWithFacebookProps>(
  ({
    text = Strings.login.sign_in_with_fb,
    callbackOnFailure,
    callbackOnSuccess,
    permissions = [
      EPermission.PUBLIC_PROFILE,
      EPermission.USER_EMAIL
      // EPermission.FIRST_NAME,
      // EPermission.LAST_NAME,
      // EPermission.BIRTHDAY,
      // EPermission.NAME
    ]
  }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [showProgressBar, setShouldShowProgressBar] =
      useState<boolean>(false);

    let accessToken: any = null;

    const responseInfoCallback = (error: any, result: any) => {
      if (error) {
        AppLog.log(
          () => "fb error is: " + JSON.stringify(error),
          TAG.COMPONENT
        );
        callbackOnFailure?.(error);
      } else {
        result!.access_token = accessToken;

        AppLog.log(
          () => "fb success : " + JSON.stringify(result),
          TAG.COMPONENT
        );

        let response = {
          id: result.id,
          userName: result.name,
          email: result.email,
          accessToken: result!.access_token,
          imageUrl: result.picture.data.url
        };

        accessToken = "";
        callbackOnSuccess?.(response);
      }

      setShouldShowProgressBar(false);
    };

    const onButtonClicked = () => {
      setShouldShowProgressBar(true);
      LoginManager.logOut();
      LoginManager.logInWithPermissions(permissions!).then(
        async function (result) {
          if (result.isCancelled) {
            setShouldShowProgressBar(false);
            callbackOnFailure?.(result);
          } else {
            accessToken = await AccessToken.getCurrentAccessToken();
            accessToken = accessToken?.accessToken;
            const infoRequest = new GraphRequest(
              "/me",
              {
                accessToken: accessToken,
                parameters: {
                  fields: {
                    string:
                      "email,name,first_name,middle_name,last_name,picture"
                  }
                }
              },
              responseInfoCallback
            );

            new GraphRequestManager().addRequest(infoRequest).start();
          }
        },
        function (err) {
          setShouldShowProgressBar(false);
          callbackOnFailure?.(err);
        }
      );
    };

    return (
      <AppButton
        text={text}
        onPress={onButtonClicked}
        buttonStyle={styles.button}
        shouldShowProgressBar={false}
        leftIcon={() => <Facebook />}
        textType={TEXT_TYPE.SEMI_BOLD}
      />
    );
  }
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.blue
  }
});
