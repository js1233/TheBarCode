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
import { usePreventDoubleTap } from "hooks";

type Props = {
  signIn: (values: ForgotPasswordFormValues) => void;
  shouldShowProgressBar?: boolean;
};
type ForgotPasswordFormValues = {
  email: string;
};

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email(Strings.login.enter_valid_email_validation)
    .required(Strings.login.email_required_validation)
});

let initialValues: FormikValues = {
  email: ""
};

export const ForgotPasswordView: FC<Props> = ({
  signIn,
  shouldShowProgressBar
}) => {
  const onSubmit = usePreventDoubleTap((_value: FormikValues) => {
    signIn({
      email: _value.email
    });
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
            <AppLabel
              text={Strings.login.forgot_pass_text}
              numberOfLines={0}
              style={styles.appLabel}
              textType={TEXT_TYPE.NORMAL}
            />
            <View style={[styles.formContainer]}>
              <AppForm
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}>
                <AppFormField
                  fieldTestID="email"
                  validationLabelTestID={"emailValidationLabel"}
                  name="email"
                  labelProps={{
                    text: STRINGS.login.email_address
                  }}
                  fieldInputProps={{
                    textContentType: "emailAddress",
                    keyboardType: "email-address",
                    returnKeyType: "next",
                    placeholder: STRINGS.login.enter_your_email,
                    autoCapitalize: "none",
                    placeholderTextColor: COLORS.theme?.placeholderColor,
                    style: {
                      color: COLORS.theme?.interface["900"]
                    },
                    viewStyle: [styles.textFieldStyle]
                  }}
                />
                <AppFormSubmit
                  buttonStyle={[styles.resetPassword]}
                  text={STRINGS.login.password_request}
                  isDisable={shouldShowProgressBar}
                  buttonType={BUTTON_TYPES.NORMAL}
                  textType={TEXT_TYPE.BOLD}
                  shouldShowProgressBar={shouldShowProgressBar}
                  textStyle={[
                    styles.resetPasswordButtonText,
                    { color: COLORS.theme?.secondaryBackground }
                  ]}
                />
              </AppForm>
            </View>
          </ScrollView>
        </Screen>
      </KeyboardAvoidingView>
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
  appLabel: {
    padding: SPACE._2xl,
    textAlign: "center",
    fontSize: FONT_SIZE.sm
  },
  formContainer: {
    marginHorizontal: SPACE.lg,
    marginBottom: SPACE.lg
  },
  keyboardAvoidingView: {
    flex: 1
  },
  textFieldStyle: {
    borderWidth: 1,
    borderColor: COLORS.theme?.borderColor
  },
  resetPasswordButtonText: {
    fontSize: FONT_SIZE.base
  },
  scrollViewContent: {
    flexGrow: 1,
    flexDirection: "column"
  },
  resetPassword: { marginTop: SPACE.lg }
});
