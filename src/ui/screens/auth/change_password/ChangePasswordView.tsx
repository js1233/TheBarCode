import * as Yup from "yup";
import Strings from "config/Strings";
import { FormikValues } from "formik";
import React, { FC } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View
} from "react-native";
import Screen from "ui/components/atoms/Screen";
import { ScrollView } from "react-native-gesture-handler";
import AppForm from "ui/components/molecules/app_form/AppForm";
import AppFormField from "ui/components/molecules/app_form/AppFormField";
import { COLORS, FONT_SIZE, SPACE, STRINGS } from "config";
import { AppFormSubmit } from "ui/components/molecules/app_form/AppFormSubmit";
import { BUTTON_TYPES } from "ui/components/molecules/app_button/AppButton";
import { TEXT_TYPE } from "ui/components/atoms/app_label/AppLabel";

type Props = {
  changePassword: (values: ChangePasswordFormValues) => void;
  shouldShowProgressBar: boolean;
};

type ChangePasswordFormValues = {
  password: string;
  password_confirmation: string;
};

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .required(Strings.changePassword.new_password_validation)
    .min(6, Strings.login.min_pass_validation),
  password_confirmation: Yup.string()
    .required(Strings.changePassword.confirm_password_validation)
    .oneOf([Yup.ref("password"), null], "Passwords must match")
});

let initialValues: FormikValues = {
  password: "",
  password_confirmation: ""
};

export const ChangePasswordView: FC<Props> = ({
  changePassword,
  shouldShowProgressBar
}) => {
  const onSubmit = (_value: FormikValues) => {
    changePassword({
      password: _value.password,
      password_confirmation: _value.password_confirmation
    });
  };

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
              <AppForm
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}>
                <AppFormField
                  name="password"
                  labelProps={{
                    text: STRINGS.changePassword.label_password
                  }}
                  secureTextEntry={true}
                  fieldInputProps={{
                    textContentType: "password",
                    keyboardType: "default",
                    returnKeyType: "next",
                    placeholder:
                      Strings.changePassword.placeholder_new_password,
                    autoCapitalize: "none",
                    placeholderTextColor: COLORS.theme?.placeholderColor,
                    style: {
                      color: COLORS.theme?.interface["900"]
                    },
                    viewStyle: [styles.textFieldStyle]
                  }}
                />
                <AppFormField
                  name="password_confirmation"
                  labelProps={{
                    text: STRINGS.changePassword.label_confirm_password,
                    style: styles.nextField
                  }}
                  secureTextEntry={true}
                  fieldInputProps={{
                    textContentType: "password",
                    keyboardType: "default",
                    returnKeyType: "done",
                    placeholder:
                      STRINGS.changePassword.placeholder_confirm_password,
                    autoCapitalize: "none",
                    placeholderTextColor: COLORS?.theme?.placeholderColor,
                    style: {
                      color: COLORS.theme?.interface["900"]
                    },
                    viewStyle: [styles.textFieldStyle]
                  }}
                />
                <AppFormSubmit
                  text={STRINGS.changePassword.label_submit}
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
    paddingVertical: SPACE._2xl,
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
    borderWidth: 1,
    borderColor: COLORS.theme?.borderColor
  },
  signInButtonText: {
    fontSize: FONT_SIZE.sm
  },
  scrollViewContent: {
    flexGrow: 1,
    flexDirection: "column"
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
