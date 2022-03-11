import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Cross from "assets/images/ic_cross.svg";
import { COLORS, FONT_SIZE, SPACE } from "config";
import Colors from "config/Colors";
import Strings from "config/Strings";
import { useAppSelector } from "hooks/redux";
import { SendInviteApiRequestModel } from "models/api_requests/SendInviteApiRequestModel";
import { Contact } from "models/Contact";
import React, {
  FC,
  MutableRefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import {
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import Contacts from "react-native-contacts";
import SimpleToast from "react-native-simple-toast";
import { useInviteApis } from "repo/invite/InviteApis";
import { HomeStackParamList } from "routes/HomeStack";
import { RootState } from "stores/store";
import { AppLabel } from "ui/components/atoms/app_label/AppLabel";
import HeaderTitle from "ui/components/headers/header_title/HeaderTitle";
import { ContactsView } from "ui/screens/home/invite/contacts/ContactsView";
import { useCreateDynamicLink } from "ui/screens/home/invite/useCreateDynamicLink";
import {
  AppLog,
  parameterizedString,
  shadowStyleProps,
  TAG
} from "utils/Util";

export type ContactsNavigation = StackNavigationProp<
  HomeStackParamList,
  "Contacts"
>;

type Props = {};

const ContactsController: FC<Props> = () => {
  const navigation = useNavigation<ContactsNavigation>();
  let emails: MutableRefObject<string[]> = useRef([]);
  let _selectedIds: MutableRefObject<number[]> = useRef([]);
  const [contacts, setContacts] = useState<Contact[]>();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const [invitePb, setInvitePb] = useState(false);
  const [contactPb, setContactPb] = useState(false);

  const customMessage = parameterizedString(
    Strings.invite.invite_friends_message,
    user!.full_name,
    user!.own_referral_code
  );

  const customMessageWithoutName = parameterizedString(
    Strings.Reload.invite_friends_message_without_name,
    user!.own_referral_code
  );

  const { buildLink, getLink } = useCreateDynamicLink(
    `https://thebarcodeapp.page.link`,
    user?.full_name === "Not Available"
      ? customMessageWithoutName
      : customMessage,
    false,
    false,
    "invite?referral=" + user?.own_referral_code
  );

  useEffect(() => {
    setContactPb(true);
    buildLink();
    if (Platform.OS === "android") {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: "Contacts",
          message: "This app would like to view your contacts.",
          buttonPositive: "Please accept bare mortal"
        }
      ).then(() => {
        loadContacts();
      });
    } else {
      loadContacts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadContacts = useCallback(() => {
    Contacts.getAll().then((deviceContacts) => {
      AppLog.log(
        () => "_contacts:" + JSON.stringify(deviceContacts),
        TAG.COMPONENT
      );
      deviceContacts.filter((contact) => {
        return contact.emailAddresses.length > 0;
      });
      let _contacts: Contact[] = [];
      deviceContacts.forEach((deviceCont) => {
        if (deviceCont.emailAddresses.length > 0) {
          _contacts.push({
            id: deviceCont.recordID,
            email: deviceCont.emailAddresses[0].email,
            name: deviceCont.displayName
          });
        }
      });
      AppLog.log(
        () => "_contacts:" + JSON.stringify(_contacts),
        TAG.COMPONENT
      );
      setContacts(_contacts);
      setContactPb(false);
    });
  }, []);
  const requestModel = useRef<SendInviteApiRequestModel>();
  const { request: sendContactsInviteRequest } =
    useInviteApis().sendInvite;

  const sendInvite = useCallback(async () => {
    const { dataBody, hasError } = await sendContactsInviteRequest(
      requestModel.current!
    );
    if (hasError || dataBody === undefined) {
      setInvitePb(false);
      SimpleToast.show("Failed");
      return;
    } else {
      setInvitePb(false);
      navigation.goBack();
      SimpleToast.show(dataBody.message);
    }
  }, [navigation, sendContactsInviteRequest]);

  const onSelectionChanged = useCallback((selectedIds: number[]) => {
    AppLog.log(
      () => "selectedIds: " + JSON.stringify(selectedIds),
      TAG.COMPONENT
    );
    _selectedIds.current = selectedIds;
  }, []);

  const fetchEmails = useCallback(() => {
    emails.current = [];
    AppLog.log(() => "contacts:" + JSON.stringify(contacts), TAG.EDITS);
    contacts?.forEach((value) => {
      _selectedIds.current.forEach((id) => {
        if (value.id === id) {
          emails.current.push(value.email);
        }
      });
    });
    requestModel.current = {
      emails: emails.current,
      url: getLink()
    };
    if (emails.current.length > 0) {
      setInvitePb(true);
      sendInvite();
    } else {
      SimpleToast.show(Strings.invite.at_least_one_contact);
    }
  }, [contacts, getLink, sendInvite]);

  const onInviteButtonClicked = useCallback(async () => {
    await fetchEmails();
  }, [fetchEmails]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        borderBottomColor: Colors.colors.theme?.borderColor,
        borderBottomWidth: 1,
        ...shadowStyleProps,
        shadowOpacity: 0.2
      },
      headerTitleAlign: "center",
      headerTitle: () => <HeaderTitle text={Strings.invite.contacts} />,
      headerRight: () => (
        <>
          {!invitePb && contacts?.length !== 0 && (
            <AppLabel
              text="Invite"
              style={styles.rightHeader}
              onPress={onInviteButtonClicked}
            />
          )}
          {invitePb && (
            <ActivityIndicator
              size={"small"}
              style={styles.rightHeaderPb}
            />
          )}
        </>
      ),
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.leftHeader}>
          <Cross fill={COLORS.black} />
        </TouchableOpacity>
      )
    });
  }, [navigation, invitePb, onInviteButtonClicked, contacts]);

  return (
    <ContactsView
      data={contacts!}
      onSelectionChange={onSelectionChanged}
      selectedIds={_selectedIds.current}
      isLoading={contactPb}
    />
  );
};

export default ContactsController;

const styles = StyleSheet.create({
  leftHeader: {
    marginLeft: SPACE.lg
  },
  rightHeader: {
    marginRight: SPACE.lg,
    fontSize: FONT_SIZE.lg,
    color: COLORS.theme?.primaryColor
  },
  imageHeaderContainer: {
    width: 30,
    height: 30,
    backgroundColor: COLORS.theme?.borderColor
  },
  rightHeaderPb: {
    marginBottom: SPACE.sm,
    marginRight: SPACE.lg
  }
});
