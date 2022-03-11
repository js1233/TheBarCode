import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Colors from "config/Colors";
import Strings from "config/Strings";
import { useAppSelector } from "hooks/redux";
import useContactsPermission from "hooks/useContactsPermission";
import React, { FC, useLayoutEffect } from "react";
import SimpleToast from "react-native-simple-toast";
import { HomeStackParamList } from "routes/HomeStack";
import { RootState } from "stores/store";
import HeaderTitle from "ui/components/headers/header_title/HeaderTitle";
import { useCreateDynamicLink } from "ui/screens/home/invite/useCreateDynamicLink";
import { parameterizedString, shadowStyleProps } from "utils/Util";
import { InviteView } from "./InviteView";

export type InviteNavigation = StackNavigationProp<
  HomeStackParamList,
  "Home"
>;

type Props = {};

const InviteController: FC<Props> = () => {
  const navigation = useNavigation<InviteNavigation>();

  const { user } = useAppSelector((state: RootState) => state.auth);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        borderBottomColor: Colors.colors.theme?.borderColor,
        borderBottomWidth: 1,
        ...shadowStyleProps
      },
      headerTitleAlign: "center",
      headerTitle: () => <HeaderTitle text={Strings.invite.title} />
    });
  }, [navigation]);

  const customMessage = parameterizedString(
    Strings.invite.invite_friends_message,
    user!.full_name,
    user!.own_referral_code
  );

  const customMessageWithoutName = parameterizedString(
    Strings.Reload.invite_friends_message_without_name,
    user!.own_referral_code
  );
  const { buildLink } = useCreateDynamicLink(
    `https://thebarcodeapp.page.link`,
    user?.full_name === "Not Available"
      ? customMessageWithoutName
      : customMessage,
    true,
    true,
    "invite?referral=" + user?.own_referral_code
  );

  const onClickedOnShareWithContacts = () => {
    navigation.navigate("Contacts");
  };

  const { askPermission } = useContactsPermission(
    onClickedOnShareWithContacts,
    () => SimpleToast.show("Permission denied")
  );

  return (
    <>
      <InviteView
        onInviteFriendsButtonClicked={buildLink}
        onShareWithContactsButtonClicked={askPermission}
      />
    </>
  );
};

export default InviteController;
