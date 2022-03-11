import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Strings from "config/Strings";
import React, { useEffect, useLayoutEffect } from "react";
import { HomeStackParamList } from "routes/HomeStack";
import HeaderLeftTextWithIcon from "ui/components/headers/header_left_text_with_icon/HeaderLeftTextWithIcon";
import HeaderTitle from "ui/components/headers/header_title/HeaderTitle";
import { ReloadView } from "./ReloadView";
import Cross from "assets/images/ic_cross.svg";
import { parameterizedString } from "utils/Util";
import { useCreateDynamicLink } from "../../invite/useCreateDynamicLink";
import { useAppSelector } from "hooks/redux";
import { RootState } from "stores/store";
import useIAPHandler from "utils/useIAPHandler";
import { usePreventDoubleTap } from "hooks";
import ReloadData, { isAbleToReload } from "models/ReloadData";
import SimpleToast from "react-native-simple-toast";
import useContactsPermission from "hooks/useContactsPermission";

type ReloadNavigationProps = StackNavigationProp<
  HomeStackParamList,
  "FrequentlyAskedQuestions"
>;

const ReloadController = () => {
  const navigation = useNavigation<ReloadNavigationProps>();
  const { user } = useAppSelector((state: RootState) => state.auth);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <HeaderTitle text={Strings.Reload.title} shouldTruncate={false} />
      ),
      headerLeft: () => (
        <HeaderLeftTextWithIcon
          onPress={() => navigation.pop()}
          icon={() => <Cross width={20} height={20} fill={"#737373"} />}
        />
      )
    });
  }, [navigation]);
  const customMessage = parameterizedString(
    Strings.Reload.invite_friends_message,
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
    false,
    "invite?referral=" + user?.own_referral_code
  );
  const onClickedOnShareWithContacts = () => {
    navigation.navigate("Contacts");
  };

  const {
    fetchProducts,
    purchaseProduct,
    removeConnections,
    subscriptionLoading
  } = useIAPHandler();
  const { askPermission } = useContactsPermission(
    onClickedOnShareWithContacts,
    () => SimpleToast.show("Permission denied")
  );

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      removeConnections();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onReloadClicked = usePreventDoubleTap((reload: ReloadData) => {
    if (isAbleToReload(reload)) {
      purchaseProduct(true, "");
    } else {
      SimpleToast.show(
        "You Are Already Fully Loaded You can use all available offers and credits now. Reload again in 7 days."
      );
    }
  });

  return (
    <ReloadView
      loading={subscriptionLoading}
      onInviteFriendsButtonClicked={buildLink}
      onShareWithContactsButtonClicked={askPermission}
      onReloadClicked={onReloadClicked}
    />
  );
};

export default ReloadController;
