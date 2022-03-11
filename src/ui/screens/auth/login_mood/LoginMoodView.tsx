import { COLORS, FONT_SIZE, SPACE } from "config";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import Screen from "ui/components/atoms/Screen";
import { AppLog, shadowStyleProps } from "utils/Util";
import TBC from "assets/images/tbc.svg";
import { AppButton } from "ui/components/molecules/app_button/AppButton";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import Strings from "config/Strings";
import Mobile from "assets/images/mobile.svg";
import {
  ConnectWithFacebook,
  SocialAccountResponse
} from "ui/components/organisms/connect_with_facebook/ConnectWithFacebook";
import { ConnectWithApple } from "ui/components/organisms/connect_with_apple/ConnectWithApple";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackParamList } from "routes/AuthStack";
import { useNavigation } from "@react-navigation/native";
import EScreen from "models/enums/EScreen";
import useSocialSignIn from "../useSocialSignIn";
import { SignUpRequestModel } from "models/api_requests/SignUpRequestModel";

export type SignInNavigationProp = StackNavigationProp<
  AuthStackParamList,
  "LoginMood"
>;

interface Props {}

export const LoginMoodView = React.memo<Props>(() => {
  AppLog.log(() => "Rendering LoginMood...");
  const navigation = useNavigation<SignInNavigationProp>();

  const { postSocialSignIn } = useSocialSignIn();
  const fbRetrievedData = (user: SocialAccountResponse) => {
    let requestModel: SignUpRequestModel = {
      provider: "facebook",
      full_name: user.userName,
      profile_image: user.imageUrl ?? "",
      social_account_id: user.id ?? "",
      access_token: user.accessToken
    };

    postSocialSignIn(requestModel, navigation).then().catch();
  };

  const appleRetrievedData = (user: SocialAccountResponse) => {
    let requestModel: SignUpRequestModel = {
      provider: "apple",
      access_token: user.accessToken,
      social_account_id: user.id,
      full_name: user.userName
    };

    postSocialSignIn(requestModel, navigation as SignInNavigationProp)
      .then()
      .catch();
  };

  return (
    <Screen
      style={styles.container}
      topSafeAreaAndStatusBarColor={COLORS.theme?.secondaryBackground}
      shouldAddBottomInset={false}>
      <TBC />

      <View style={styles.btnWrapper}>
        <AppLabel
          text={Strings.login.welcome_back}
          style={styles.welcome}
          textType={TEXT_TYPE.BOLD}
        />

        <AppLabel
          text={Strings.login.sign_in_account}
          style={styles.signInAccount}
        />

        <ConnectWithFacebook
          callbackOnSuccess={fbRetrievedData}
          text={Strings.login.sign_in_account}
        />

        <AppButton
          text={Strings.login.sign_in_mobile}
          textType={TEXT_TYPE.SEMI_BOLD}
          buttonStyle={styles.btnStyle}
          leftIcon={() => (
            <Mobile
              fill={COLORS.theme?.secondaryBackground}
              width={25}
              height={25}
            />
          )}
          onPress={() =>
            navigation.navigate("SignUpMobile", {
              isOpenFrom: EScreen.SIGN_IN
            })
          }
        />

        {Platform.OS === "ios" && (
          <ConnectWithApple
            text={Strings.login.sign_in_apple}
            callbackOnSuccess={appleRetrievedData}
          />
        )}

        <AppLabel
          text={Strings.login.sign_in_email}
          style={[styles.colorPrimary]}
          textType={TEXT_TYPE.SEMI_BOLD}
          onPress={() => navigation.navigate("Login")}
        />
      </View>

      <View style={styles.bottomWrapper}>
        <AppLabel
          text={Strings.login.not_a_member}
          style={{ color: COLORS.theme?.interface["900"] }}
          textType={TEXT_TYPE.SEMI_BOLD}
        />
        <AppLabel
          text={Strings.login.sign_up}
          style={[styles.colorPrimary]}
          textType={TEXT_TYPE.SEMI_BOLD}
          onPress={() => navigation.navigate("SignUpMood")}
        />
      </View>
    </Screen>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: SPACE.lg,
    flex: 1,
    paddingVertical: SPACE.md,
    backgroundColor: COLORS.theme?.secondaryBackground
  },
  welcome: {
    color: COLORS.theme?.interface["700"],
    fontSize: FONT_SIZE.xl
  },
  btnWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  signInAccount: {
    marginTop: SPACE._2xs,
    marginBottom: SPACE._3xl,
    color: COLORS.theme?.interface["700"]
  },
  btnStyle: {
    marginTop: SPACE._2xl,
    marginBottom: SPACE._2xl
  },
  signIn: {
    marginTop: SPACE._3xl
  },
  colorPrimary: {
    color: COLORS.theme?.primaryColor
  },
  bottomWrapper: {
    flexDirection: "row",
    marginTop: SPACE._2xl
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
    bottom: 40,
    justifyContent: "center",
    ...shadowStyleProps
  }
});
