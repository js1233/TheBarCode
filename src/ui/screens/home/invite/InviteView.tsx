import Clipboard from "@react-native-community/clipboard";
import Copy from "assets/images/copy.svg";
import Envelop from "assets/images/envelop.svg";
import { FONT_SIZE, SPACE } from "config";
import Colors from "config/Colors";
import Strings from "config/Strings";
import { useAppSelector } from "hooks/redux";
import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import SimpleToast from "react-native-simple-toast";
import { RootState } from "stores/store";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import Screen from "ui/components/atoms/Screen";
import { AppButton } from "ui/components/molecules/app_button/AppButton";

type Props = {
  onInviteFriendsButtonClicked: () => void;
  onShareWithContactsButtonClicked: () => void;
};

export const InviteView: FC<Props> = ({
  onInviteFriendsButtonClicked,
  onShareWithContactsButtonClicked
}) => {
  const { user } = useAppSelector((state: RootState) => state.auth);

  const copyToClipboard = (copy: string) => {
    Clipboard.setString(copy);
    SimpleToast.show("Link copied");
  };

  return (
    <>
      <Screen style={styles.container} shouldAddBottomInset={false}>
        <ScrollView
          style={styles.scrollView}
          keyboardShouldPersistTaps={"handled"}
          contentContainerStyle={styles.scrollViewContent}>
          <Envelop style={{ marginTop: SPACE._2xl }} />
          <AppLabel
            text={Strings.invite.invite_friends_get_credit}
            style={styles.inviteFriendsGetCredit}
            textType={TEXT_TYPE.BOLD}
          />
          <AppLabel
            text={Strings.invite.invite_desc}
            numberOfLines={0}
            style={styles.inviteDesc}
          />
          <AppLabel
            text={Strings.invite.your_unique_invite_code}
            style={styles.inviteYourUniqueCode}
            textType={TEXT_TYPE.SEMI_BOLD}
          />
          <AppButton
            text={user!.own_referral_code}
            rightIcon={() => <Copy />}
            textType={TEXT_TYPE.BOLD}
            buttonStyle={styles.inviteCodeButton}
            textStyle={styles.inviteCodeButtonText}
            onPress={() => copyToClipboard(user!.own_referral_code)}
          />
          <View style={styles.bottomContainer}>
            <AppLabel
              text={Strings.invite.share_to_your_friends}
              style={styles.shareToYourFriends}
              textType={TEXT_TYPE.SEMI_BOLD}
            />
            <AppButton
              text={Strings.invite.invite_friends}
              textType={TEXT_TYPE.BOLD}
              buttonStyle={styles.inviteFriendsAndShareWithContacts}
              onPress={onInviteFriendsButtonClicked}
            />
            <AppLabel
              text={Strings.invite.or}
              style={styles.or}
              textType={TEXT_TYPE.SEMI_BOLD}
            />
            <AppButton
              text={Strings.invite.share_with_contacts}
              textType={TEXT_TYPE.BOLD}
              buttonStyle={styles.inviteFriendsAndShareWithContacts}
              onPress={onShareWithContactsButtonClicked}
            />
          </View>
        </ScrollView>
      </Screen>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: SPACE.lg
  },
  inviteFriendsGetCredit: {
    paddingTop: SPACE.lg,
    fontSize: FONT_SIZE.lg
  },
  inviteFriendsAndShareWithContacts: {
    marginTop: SPACE.lg
  },
  or: {
    paddingTop: SPACE.lg,
    alignSelf: "center"
  },
  shareToYourFriends: {
    alignSelf: "center"
  },
  inviteCodeButton: {
    marginTop: SPACE.md,
    backgroundColor: Colors.colors.white,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: Colors.colors.theme?.borderColor
  },
  inviteCodeButtonText: {
    color: Colors.colors.theme?.primaryColor
  },
  inviteYourUniqueCode: {
    paddingTop: SPACE._3xl
  },
  inviteDesc: {
    fontSize: FONT_SIZE._3xs,
    textAlign: "center",
    paddingTop: SPACE.sm
  },
  bottomContainer: {
    borderColor: Colors.colors.theme?.borderColor,
    borderRadius: 20,
    borderWidth: 1,
    paddingTop: SPACE._3xl,
    paddingBottom: SPACE._3xl,
    marginTop: SPACE.lg,
    paddingHorizontal: SPACE.lg,
    backgroundColor: Colors.colors.theme?.interface[50]
  },
  scrollView: {
    flex: 1
  },
  scrollViewContent: {
    flexGrow: 1,
    flexDirection: "column",
    alignItems: "center"
  }
});
