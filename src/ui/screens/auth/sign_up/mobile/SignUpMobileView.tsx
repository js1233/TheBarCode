import { COLORS, FONT_SIZE, SPACE, STRINGS } from "config";
import Strings from "config/Strings";
import { FormikValues } from "formik";
import React, { FC } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Screen from "ui/components/atoms/Screen";
import { BUTTON_TYPES } from "ui/components/molecules/app_button/AppButton";
import AppForm from "ui/components/molecules/app_form/AppForm";
import AppFormField from "ui/components/molecules/app_form/AppFormField";
import { AppFormSubmit } from "ui/components/molecules/app_form/AppFormSubmit";
import * as Yup from "yup";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import TermsPolicyView from "ui/components/molecules/terms_policy/TermsPolicyView";
import FlagUK from "assets/images/UKFlag.svg";
import FlagIndia from "assets/images/india.svg";
import { useAppSelector } from "hooks/redux";
import { RootState } from "stores/store";

type Props = {
  authMobile: (values: MobileFormValues) => void;
  shouldShowProgressBar: boolean;
  isOpenFromSignUp: boolean;
};

type MobileFormValues = {
  contact: string;
};

let initialValues: FormikValues = {
  contact: ""
};

export const SignUpMobileView: FC<Props> = ({
  authMobile,
  shouldShowProgressBar,
  isOpenFromSignUp
}) => {
  const onSubmit = (_value: FormikValues) => {
    authMobile({
      ...(_value as MobileFormValues)
    });
  };

  const { regionData } = useAppSelector(
    (state: RootState) => state.general
  );

  const validationSchema = Yup.object().shape({
    contact: Yup.string()
      .required(Strings.signUpMobile.mobile_required)
      .max(
        regionData?.country === "UK" ? 11 : 14,
        Strings.signUpMobile.mobile_validation
      )
      .min(
        regionData?.country === "UK" ? 10 : 10,
        Strings.signUpMobile.mobile_validation
      )
  });

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardAvoidingView}>
        <Screen style={styles.container} shouldAddBottomInset={false}>
          <ScrollView
            style={styles.scrollView}
            keyboardShouldPersistTaps={"handled"}
            contentContainerStyle={styles.scrollViewContent}>
            <View style={[styles.formContainer]}>
              <AppLabel
                text={Strings.signUpMobile.enter_mobile_below}
                style={styles.largeText}
                textType={TEXT_TYPE.BOLD}
              />

              <AppLabel
                text={Strings.signUpMobile.receive_sms}
                numberOfLines={0}
                style={styles.lightText}
              />

              <AppForm
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}>
                <AppFormField
                  fieldTestID="contact"
                  validationLabelTestID={"contactValidationLabel"}
                  name="contact"
                  labelProps={{
                    text: STRINGS.signUpMobile.mobile_number,
                    style: styles.nextField
                  }}
                  fieldInputProps={{
                    keyboardType: "phone-pad",
                    returnKeyType: "done",
                    placeholder: STRINGS.signUpMobile.enter_mobile,
                    autoCapitalize: "none",
                    placeholderTextColor: COLORS?.theme?.placeholderColor,
                    style: {
                      color: COLORS.theme?.interface["900"]
                    },
                    leftIcon: () =>
                      regionData?.country === "UK" ? (
                        <FlagUK />
                      ) : (
                        <FlagIndia />
                      ),
                    viewStyle: [styles.textFieldStyle]
                  }}
                />

                <AppFormSubmit
                  text={
                    isOpenFromSignUp
                      ? STRINGS.signUp.create_account
                      : STRINGS.login.sign_in
                  }
                  buttonType={BUTTON_TYPES.NORMAL}
                  textType={TEXT_TYPE.BOLD}
                  shouldShowProgressBar={shouldShowProgressBar}
                  textStyle={[
                    styles.signInButtonText,
                    { color: COLORS.theme?.secondaryBackground }
                  ]}
                  buttonStyle={styles.signInContainer}
                />
              </AppForm>

              {isOpenFromSignUp && <TermsPolicyView />}
            </View>
          </ScrollView>
        </Screen>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingVertical: SPACE._2xl,
    paddingHorizontal: SPACE.lg
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.theme?.interface["100"]
  },
  formContainer: {
    marginBottom: SPACE.lg,
    justifyContent: "center",
    alignItems: "center"
  },
  largeText: {
    color: COLORS.theme?.interface["900"],
    paddingBottom: SPACE.sm
  },
  lightText: { textAlign: "center", paddingBottom: SPACE.sm },
  keyboardAvoidingView: {
    flex: 1
  },
  textFieldStyle: {
    borderWidth: 1,
    borderColor: COLORS.theme?.borderColor
  },
  signInButtonText: {
    fontSize: FONT_SIZE.sm
  },
  scrollViewContent: {
    flexGrow: 1
  },
  nextField: { marginTop: SPACE.lg },
  signInContainer: { marginTop: SPACE._3xl },
  logo: { alignSelf: "center", marginVertical: 60 },
  forgot: {
    marginTop: SPACE._2xl,
    alignSelf: "center",
    color: COLORS.theme?.primaryColor
  }
});
