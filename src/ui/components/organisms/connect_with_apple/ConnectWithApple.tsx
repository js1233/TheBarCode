import appleAuth from "@invertase/react-native-apple-authentication";
import AppleLogo from "assets/images/apple.svg";
import { COLORS, SPACE } from "config";
import Strings from "config/Strings";
import React from "react";
import { StyleSheet } from "react-native";
import { TEXT_TYPE } from "ui/components/atoms/app_label/AppLabel";
import { AppButton } from "ui/components/molecules/app_button/AppButton";
import { SocialAccountResponse } from "ui/components/organisms/connect_with_facebook/ConnectWithFacebook";
import { AppLog, TAG } from "utils/Util";

export interface ConnectWithAppleProps {
  text?: string;
  callbackOnSuccess?: (result: SocialAccountResponse) => void;
  callbackOnFailure?: (error: any) => void;
  permissions?: string[];
}

export const ConnectWithApple = React.memo<ConnectWithAppleProps>(
  ({
    text = Strings.signUp.sign_apple,
    callbackOnFailure,
    callbackOnSuccess
  }) => {
    const onButtonClicked = async () => {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME]
      });

      const { user, fullName, identityToken } = appleAuthRequestResponse;

      AppLog.log(
        () =>
          "apple response: " + JSON.stringify(appleAuthRequestResponse),
        TAG.COMPONENT
      );

      if (identityToken !== undefined && identityToken !== null) {
        let response = {
          id: user ?? "",
          accessToken: identityToken ?? "",
          userName:
            fullName?.givenName && fullName?.familyName
              ? fullName?.givenName + " " + fullName?.familyName
              : "Not Available"
        };

        callbackOnSuccess?.(response);
      } else {
        callbackOnFailure?.("Unable to sign in with apple");
      }
    };

    return (
      <AppButton
        text={text}
        onPress={onButtonClicked}
        buttonStyle={styles.button}
        shouldShowProgressBar={false}
        leftIcon={() => <AppleLogo />}
        textType={TEXT_TYPE.SEMI_BOLD}
      />
    );
  }
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.theme?.interface["900"],
    marginBottom: SPACE._3xl
  }
});
