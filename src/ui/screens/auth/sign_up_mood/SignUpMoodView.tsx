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
import { AuthStackParamList } from "routes/AuthStack";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import EScreen from "models/enums/EScreen";
import useSocialSignIn from "../useSocialSignIn";
import { SignUpRequestModel } from "models/api_requests/SignUpRequestModel";
import { SignInNavigationProp } from "../login_mood/LoginMoodView";

type SIgnUpNavigationProp = StackNavigationProp<
  AuthStackParamList,
  "SignUpMood"
>;

interface Props {}

export const SignUpMoodView = React.memo<Props>(() => {
  AppLog.log(() => "Rendering SignUpMood...");
  const navigation = useNavigation<SIgnUpNavigationProp>();

  const { postSocialSignIn } = useSocialSignIn();
  const fbRetrievedData = (user: SocialAccountResponse) => {
    let requestModel: SignUpRequestModel = {
      provider: "facebook",
      full_name: user.userName,
      profile_image: user.imageUrl ?? "",
      social_account_id: user.id ?? "",
      access_token: user.accessToken
    };

    postSocialSignIn(requestModel, navigation as SignInNavigationProp)
      .then()
      .catch();
  };

  const appleRetrievedData = (user: SocialAccountResponse) => {
    let requestModel: SignUpRequestModel = {
      provider: "apple",
      full_name: user.userName,
      access_token: user.accessToken,
      social_account_id: user.id
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
          text={Strings.signUp.welcome}
          style={styles.welcome}
          textType={TEXT_TYPE.BOLD}
        />

        <AppLabel
          text={Strings.signUp.create}
          style={styles.signInAccount}
        />

        <ConnectWithFacebook
          text={Strings.signUp.sign_facebook}
          callbackOnSuccess={fbRetrievedData}
        />

        <AppButton
          text={Strings.signUp.sign_mobile}
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
              isOpenFrom: EScreen.SIGN_UP
            })
          }
        />

        {Platform.OS === "ios" && (
          <ConnectWithApple
            text={Strings.signUp.sign_apple}
            callbackOnSuccess={appleRetrievedData}
          />
        )}

        <AppLabel
          text={Strings.signUp.sign_email}
          style={[styles.colorPrimary]}
          textType={TEXT_TYPE.SEMI_BOLD}
          onPress={() => navigation.navigate("SignUp")}
        />
      </View>

      <View style={styles.bottomWrapper}>
        <AppLabel
          text={Strings.signUp.alreadyMember}
          style={{ color: COLORS.theme?.interface["900"] }}
          textType={TEXT_TYPE.SEMI_BOLD}
        />
        <AppLabel
          text={Strings.login.sign_in}
          style={[styles.colorPrimary]}
          textType={TEXT_TYPE.SEMI_BOLD}
          onPress={() => navigation.navigate("LoginMood")}
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
