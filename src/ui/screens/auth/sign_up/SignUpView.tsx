import DateTimePicker, {
  Event
} from "@react-native-community/datetimepicker";
import Calendar from "assets/images/calendar.svg";
import DownArrow from "assets/images/ic_down_arrow.svg";
import { COLORS, SPACE, STRINGS } from "config";
import Strings from "config/Strings";
import { FormikValues } from "formik";
import { usePreferredTheme, usePreventDoubleTap } from "hooks";
import { useAppSelector } from "hooks/redux";
import _ from "lodash";
import { SignUpRequestModel } from "models/api_requests/SignUpRequestModel";
import { User } from "models/api_responses/SignInApiResponseModel";
import { DropDownItem } from "models/DropDownItem";
import EIntBoolean from "models/enums/EIntBoolean";
import React, { FC, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  View
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { RootState } from "stores/store";
import { TEXT_TYPE } from "ui/components/atoms/app_label/AppLabel";
import Screen from "ui/components/atoms/Screen";
import { BUTTON_TYPES } from "ui/components/molecules/app_button/AppButton";
import AppForm from "ui/components/molecules/app_form/AppForm";
import { AppFormDropDown } from "ui/components/molecules/app_form/AppFormDropDown";
import AppFormField from "ui/components/molecules/app_form/AppFormField";
import { AppFormSubmit } from "ui/components/molecules/app_form/AppFormSubmit";
import TermsPolicyView from "ui/components/molecules/terms_policy/TermsPolicyView";
import { PrettyTimeFormat } from "utils/PrettyTimeFormat";
import * as Yup from "yup";
import { isValidAge } from "utils/Util";

type Props = {
  signUp: (values: FormikValues) => void;
  shouldShowProgressBar: boolean;
  hideEmailPass: boolean;
  preFilledRequestModel: SignUpRequestModel | undefined;
  user: User;
  hideOnlyPass: boolean;
  isOpenFromAccountSettings: boolean;
};

const minDob = new Date();
minDob.setFullYear(minDob.getFullYear() - 18);

export const SignUpView: FC<Props> = ({
  signUp,
  shouldShowProgressBar,
  hideEmailPass,
  preFilledRequestModel,
  user,
  hideOnlyPass,
  isOpenFromAccountSettings
}) => {
  const prettyTime = new PrettyTimeFormat();

  let prefilledInitialValues: SignUpRequestModel = {
    ...preFilledRequestModel,
    full_name: preFilledRequestModel?.full_name ?? "",
    date_of_birth: preFilledRequestModel?.date_of_birth ?? "",
    email: preFilledRequestModel?.email ?? "",
    password: preFilledRequestModel?.password ?? "",
    gender: preFilledRequestModel?.gender ?? "",
    postcode: preFilledRequestModel?.postcode ?? "",
    oapa_code: preFilledRequestModel?.oapa_code ?? ""
  };

  const { themedColors } = usePreferredTheme();
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [dateOfBirth, setDateOfBirth] = useState<any>(
    user
      ? prettyTime.formatDateTime(
          String(user.date_of_birth),
          "DD / MM / YYYY"
        )
      : preFilledRequestModel?.date_of_birth
  );

  const [datePickerDate, setDatePicketDate] = useState<Date>(minDob);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { regionData } = useAppSelector(
    (state: RootState) => state.general
  );
  const genderList: DropDownItem[] = [
    { value: "Male", text: "male" },
    { value: "Female", text: "female" },
    { value: "Non Binary", text: "non_binary" },
    { value: "Rather Not Say", text: "other" }
  ];
  let schema = {
    email: Yup.string()
      .email(Strings.login.enter_valid_email_validation)
      .required(Strings.login.email_required_validation),
    password: !hideOnlyPass
      ? Yup.string()
          .required(Strings.login.pass_required_validation)
          .min(6, Strings.login.min_pass_validation)
      : Yup.string().optional(),
    full_name: Yup.string()
      .required(Strings.signUp.name_validation)
      .min(1),
    gender: Yup.object().required(Strings.signUp.gender_validation),
    date_of_birth: Yup.string()
      .required(Strings.signUp.dob_validation)
      .test(
        "date_of_birth",
        Strings.signUp.dob_restrict_validation,
        function (value: string | undefined) {
          if (value === undefined) {
            return false;
          }
          const getAge: number = isValidAge(value ?? "");
          return getAge >= 18;
        }
      )
      .min(1),
    postcode: Yup.string()
      .optional()
      .test(
        "postcode",
        Strings.signUp.postcode_validation,
        (): boolean => {
          return true;
        }
      ),
    newpassword: Yup.string()
      .optional()
      .min(6, Strings.login.min_pass_validation),
    confirmpassword: Yup.string().oneOf(
      [Yup.ref("newpassword"), null],
      "Passwords must match"
    ),
    oapa_code: Yup.string().optional()
  };

  let validationSchema;
  if (hideEmailPass) {
    validationSchema = Yup.object().shape(
      _.omit(schema, "email", "password")
    );
  } else if (hideOnlyPass) {
    validationSchema = Yup.object().shape(
      _.omit(schema, "newpassword", "confirmpassword")
    );
  } else {
    validationSchema = Yup.object().shape(schema);
  }

  let hideUpdatePasswordFields = false;
  if (user?.social_account_id) {
    hideUpdatePasswordFields = true;
  } else if (user?.contact_number) {
    hideUpdatePasswordFields = true;
  }

  const onSubmit = usePreventDoubleTap((_value: FormikValues) => {
    if (_value.oapa_code === preFilledRequestModel?.oapa_code) {
      signUp(_.omit(_value, "oapa_code"));
    } else {
      signUp({
        ..._value
      });
    }
  });

  const onChange = (event: Event, selectedDate: Date | undefined) => {
    setShowDatePicker(Platform.OS === "ios");
    if (event?.type !== "dismissed" && selectedDate) {
      setDatePicketDate(new Date(selectedDate));
      setDateOfBirth(
        prettyTime.formatDateTime(String(selectedDate), "DD / MM / YYYY")
      );
    }
  };

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardAvoidingView}>
        <Screen
          style={styles.container}
          shouldAddBottomInset={false}
          onPress={() => setShowDatePicker(false)}>
          <ScrollView
            style={styles.scrollView}
            keyboardShouldPersistTaps={"handled"}
            contentContainerStyle={styles.scrollViewContent}
            nestedScrollEnabled={true}>
            <View style={[styles.formContainer]}>
              <AppForm
                initialValues={prefilledInitialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}>
                <AppFormField
                  fieldTestID="name"
                  validationLabelTestID={"nameValidationLabel"}
                  name="full_name"
                  labelProps={{
                    text: STRINGS.login.name
                  }}
                  fieldInputProps={{
                    returnKeyType: "next",
                    placeholder: STRINGS.login.enter_name,
                    autoCapitalize: "none",
                    placeholderTextColor: themedColors.placeholderColor,
                    style: {
                      color: themedColors.interface["900"]
                    },
                    viewStyle: [styles.textFieldStyle],
                    onFocus: () => setShowDatePicker(false)!
                  }}
                />
                {!hideEmailPass && (
                  <>
                    <AppFormField
                      fieldTestID="email"
                      validationLabelTestID={"emailValidationLabel"}
                      name="email"
                      labelProps={{
                        text: STRINGS.login.email_address,
                        style: styles.nextField
                      }}
                      fieldInputProps={{
                        textContentType: "emailAddress",
                        keyboardType: "email-address",
                        returnKeyType: "next",
                        placeholder: STRINGS.login.enter_your_email,
                        autoCapitalize: "none",
                        placeholderTextColor:
                          themedColors.placeholderColor,
                        style: {
                          color: themedColors.interface["900"]
                        },
                        viewStyle: [styles.textFieldStyle],
                        onFocus: () => setShowDatePicker(false)!
                      }}
                      isLocked={
                        user ? EIntBoolean.TRUE : EIntBoolean.FALSE
                      }
                    />

                    {!hideOnlyPass && (
                      <AppFormField
                        fieldTestID="password"
                        validationLabelTestID={"passwordValidationLabel"}
                        name="password"
                        labelProps={{
                          text: STRINGS.login.password,
                          style: styles.nextField
                        }}
                        secureTextEntry={true}
                        fieldInputProps={{
                          textContentType: "password",
                          keyboardType: "default",
                          returnKeyType: "done",
                          placeholder: STRINGS.login.enter_pass,
                          autoCapitalize: "none",
                          placeholderTextColor:
                            themedColors.placeholderColor,
                          style: {
                            color: themedColors.interface["900"]
                          },
                          viewStyle: [styles.textFieldStyle],
                          onFocus: () => setShowDatePicker(false)!
                        }}
                      />
                    )}
                  </>
                )}
                <View
                  style={{
                    flexDirection: "row"
                  }}>
                  <Pressable
                    onTouchStart={() => {
                      Keyboard.dismiss();
                      setShowDatePicker(true);
                    }}
                    style={styles.dobContainer}>
                    <AppFormField
                      fieldTestID="date_of_birth"
                      validationLabelTestID={"dobcodeValidationLabel"}
                      name="date_of_birth"
                      labelProps={{
                        text: STRINGS.login.dob,
                        style: styles.nextField
                      }}
                      isFieldInHorizontalContainer={true}
                      isLocked={EIntBoolean.TRUE}
                      fieldInputProps={{
                        value: dateOfBirth,
                        returnKeyType: "next",
                        placeholder: STRINGS.login.enter_dob,
                        autoCapitalize: "none",
                        placeholderTextColor:
                          themedColors.placeholderColor,
                        style: {
                          color: themedColors.interface["900"]
                        },
                        viewStyle: [styles.textFieldStyle],
                        rightIcon: () => (
                          <Calendar
                            stroke={COLORS.theme?.interface["500"]}
                          />
                        )
                      }}
                    />
                  </Pressable>

                  <View style={{ flex: 1 }}>
                    <AppFormDropDown
                      name="gender"
                      validationLabelTestID={"genderValidationTestID"}
                      labelProps={{
                        text: STRINGS.login.gender,
                        style: [styles.nextField]
                      }}
                      isFieldInHorizontalContainer={true}
                      appDropDownProps={{
                        shouldShowCustomIcon: true,
                        title: STRINGS.login.enter_gender,
                        items: genderList,
                        selectedItemCallback: () => {
                          //setTitle(item.title);
                        },
                        dropDownIcon: () => (
                          <DownArrow
                            width={12}
                            height={12}
                            fill={COLORS.theme?.interface["500"]}
                          />
                        ),
                        style: [
                          styles.textFieldStyle,
                          {
                            backgroundColor:
                              COLORS.theme?.primaryBackground,
                            borderColor: COLORS.theme?.borderColor
                          }
                        ]
                      }}
                    />
                  </View>
                </View>
                <AppFormField
                  fieldTestID="postcode"
                  validationLabelTestID={"postcodeValidationLabel"}
                  name="postcode"
                  labelProps={{
                    text: STRINGS.login.postcode,
                    style: styles.nextField
                  }}
                  fieldInputProps={{
                    returnKeyType: "next",
                    placeholder: STRINGS.login.enter_postcode,
                    autoCapitalize: "none",
                    placeholderTextColor: themedColors.placeholderColor,
                    style: {
                      color: themedColors.interface["900"]
                    },
                    viewStyle: [styles.textFieldStyle]
                  }}
                />
                {!hideUpdatePasswordFields && isOpenFromAccountSettings && (
                  <>
                    <AppFormField
                      fieldTestID="password"
                      validationLabelTestID={"passwordValidationLabel"}
                      name="password"
                      labelProps={{
                        text: Strings.signUp.curr_pass_label,
                        style: styles.nextField
                      }}
                      secureTextEntry={true}
                      fieldInputProps={{
                        textContentType: "password",
                        keyboardType: "default",
                        returnKeyType: "done",
                        placeholder: Strings.signUp.curr_pass_placeholder,
                        autoCapitalize: "none",
                        placeholderTextColor:
                          themedColors.placeholderColor,
                        style: {
                          color: themedColors.interface["900"]
                        },
                        viewStyle: [styles.textFieldStyle]
                      }}
                    />
                    <AppFormField
                      fieldTestID="newpassword"
                      validationLabelTestID={"newpasswordValidationLabel"}
                      name="newpassword"
                      labelProps={{
                        text: Strings.signUp.new_pass_label,
                        style: styles.nextField
                      }}
                      secureTextEntry={true}
                      fieldInputProps={{
                        textContentType: "password",
                        keyboardType: "default",
                        returnKeyType: "done",
                        placeholder: Strings.signUp.new_pass_placeholder,
                        autoCapitalize: "none",
                        placeholderTextColor:
                          themedColors.placeholderColor,
                        style: {
                          color: themedColors.interface["900"]
                        },
                        viewStyle: [styles.textFieldStyle]
                      }}
                    />
                    <AppFormField
                      fieldTestID="confirmpassword"
                      validationLabelTestID={
                        "confirmpasswordValidationLabel"
                      }
                      name="confirmpassword"
                      labelProps={{
                        text: Strings.signUp.confirm_pass_label,
                        style: styles.nextField
                      }}
                      secureTextEntry={true}
                      fieldInputProps={{
                        textContentType: "password",
                        keyboardType: "default",
                        returnKeyType: "done",
                        placeholder:
                          Strings.signUp.confirm_pass_placeholder,
                        autoCapitalize: "none",
                        placeholderTextColor:
                          themedColors.placeholderColor,
                        style: {
                          color: themedColors.interface["900"]
                        },
                        viewStyle: [styles.textFieldStyle]
                      }}
                    />
                  </>
                )}
                <AppFormField
                  fieldTestID="oapa_code"
                  validationLabelTestID={"oapa_codeValidationLabel"}
                  name="oapa_code"
                  labelProps={{
                    text: STRINGS.login.oapa_code,
                    style: styles.nextField
                  }}
                  fieldInputProps={{
                    returnKeyType: "next",
                    placeholder: STRINGS.login.oapa_placeholder_text,
                    autoCapitalize: "none",
                    placeholderTextColor: themedColors.placeholderColor,
                    style: {
                      color: themedColors.interface["900"]
                    },
                    shouldDisable: user && user.oapa_code ? true : false,
                    viewStyle: [styles.textFieldStyle]
                  }}
                  isLocked={
                    user && user.oapa_code
                      ? EIntBoolean.TRUE
                      : EIntBoolean.FALSE
                  }
                />
                <AppFormSubmit
                  text={
                    user?.social_account_id === null ||
                    user?.contact_number === null
                      ? "Update"
                      : STRINGS.signUp.create_account
                  }
                  buttonType={BUTTON_TYPES.NORMAL}
                  textType={TEXT_TYPE.BOLD}
                  shouldShowProgressBar={shouldShowProgressBar}
                  textStyle={[styles.btn]}
                  buttonStyle={styles.signInContainer}
                />
              </AppForm>
              {!user && <TermsPolicyView />}
            </View>
          </ScrollView>
        </Screen>
      </KeyboardAvoidingView>

      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          value={datePickerDate}
          mode="date"
          onChange={onChange}
          themeVariant="light"
          //maximumDate={minDob}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.theme?.interface["100"]
  },
  formContainer: {
    marginHorizontal: SPACE.lg,
    marginBottom: SPACE.lg
  },
  keyboardAvoidingView: {
    flex: 1
  },
  textFieldStyle: {
    borderWidth: 1
  },
  scrollViewContent: {
    flexGrow: 1,
    flexDirection: "column",
    paddingTop: SPACE._2xl
  },
  btn: { color: COLORS.theme?.secondaryBackground },
  nextField: { marginTop: SPACE.lg },
  signInContainer: { marginTop: SPACE._3xl },
  logo: { alignSelf: "center", marginVertical: 60 },
  dobContainer: { flex: 1, marginEnd: SPACE.lg }
});
