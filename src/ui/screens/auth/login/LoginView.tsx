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
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackParamList } from "routes";
import Env from "envs/env";

type Props = {
  signIn: (values: LoginFormValues) => void;
  shouldShowProgressBar: boolean;
};

type LoginFormValues = {
  email: string;
  password: string;
  remember_me: boolean;
};

type LoginNavigationProp = StackNavigationProp<
  AuthStackParamList,
  "Login"
>;

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email(Strings.login.enter_valid_email_validation)
    .required(Strings.login.email_required_validation),
  password: Yup.string()
    .required(Strings.login.pass_required_validation)
    .min(7, Strings.login.min_pass_validation)
});

let initialValues: FormikValues = {
  email: Env.CURRENT !== "PROD" ? "anis.ghazi@startrum.com" : "",
  password: Env.CURRENT !== "PROD" ? "123456789" : ""
};

export const LoginView: FC<Props> = ({
  signIn,
  shouldShowProgressBar
}) => {
  const navigation = useNavigation<LoginNavigationProp>();
  const onSubmit = (_value: FormikValues) => {
    signIn({
      email: _value.email,
      password: _value.password,
      remember_me: _value.rememberMe
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
                    placeholderTextColor: COLORS?.theme?.placeholderColor,
                    style: {
                      color: COLORS.theme?.interface["900"]
                    },
                    viewStyle: [styles.textFieldStyle]
                  }}
                />

                <AppFormSubmit
                  text={STRINGS.login.sign_in}
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

              <AppLabel
                text={Strings.login.forgot_pass}
                style={[styles.forgot]}
                textType={TEXT_TYPE.SEMI_BOLD}
                onPress={() =>
                  navigation.navigate("ForgotPassword", {
                    isOpenForForgotPassword: true
                  })
                }
              />
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
    paddingVertical: SPACE._2xl
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
