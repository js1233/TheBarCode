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
import Envelope from "assets/images/envelope.svg";
import Mobile from "assets/images/mobile.svg";
import MultilineSpannableText from "ui/components/atoms/multiline_spannable_text/MultilineSpannableText";

type Props = {
  verify: (verificationCode: string) => void;
  shouldShowProgressBar: boolean;
  resendCode: () => void;
  isOpenForEmail: boolean;
  data: string;
};

const validationSchema = Yup.object().shape({
  code: Yup.string().required(Strings.verify.verification_validation)
});

let initialValues: FormikValues = {
  code: ""
};

export const VerifyView: FC<Props> = ({
  verify,
  shouldShowProgressBar,
  resendCode,
  isOpenForEmail,
  data
}) => {
  const onSubmit = (_value: FormikValues) => {
    verify(_value.code);
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
              {isOpenForEmail ? (
                <Envelope width={40} height={40} />
              ) : (
                <Mobile stroke={COLORS.theme?.primaryColor} />
              )}
              <AppLabel
                text={
                  isOpenForEmail
                    ? Strings.verify.verify_email
                    : Strings.verify.verify_mobile
                }
                style={styles.largeText}
                textType={TEXT_TYPE.BOLD}
              />

              <MultilineSpannableText
                text={[Strings.verify.activation_code, data]}
                appLabelProps={[
                  {
                    style: {
                      color: COLORS.theme?.interface["900"],
                      textAlign: "center"
                    }
                  },
                  {
                    style: {
                      color: COLORS.theme?.primaryColor,
                      textAlign: "center"
                    }
                  }
                ]}
                containerStyle={{
                  marginTop: SPACE.sm,
                  flexDirection: "row"
                }}
              />

              <AppForm
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}>
                <AppFormField
                  fieldTestID="code"
                  validationLabelTestID={"codeValidationLabel"}
                  name="code"
                  labelProps={{
                    text: STRINGS.verify.code,
                    style: styles.nextField
                  }}
                  fieldInputProps={{
                    keyboardType: "numeric",
                    returnKeyType: "done",
                    placeholder: STRINGS.verify.enter_activation_code,
                    autoCapitalize: "none",
                    placeholderTextColor: COLORS?.theme?.placeholderColor,
                    style: {
                      color: COLORS.theme?.interface["900"]
                    },
                    viewStyle: [styles.textFieldStyle]
                  }}
                />

                <AppFormSubmit
                  text={STRINGS.verify.activate_account}
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
                text={Strings.verify.resend_code}
                style={styles.bottomText}
                textType={TEXT_TYPE.SEMI_BOLD}
                onPress={resendCode}
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
    paddingVertical: SPACE._2xl + SPACE._2xs,
    paddingHorizontal: SPACE.lg
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.theme?.interface["100"]
  },
  bottomText: {
    color: COLORS.theme?.primaryColor,
    marginTop: SPACE._2xl
  },

  formContainer: {
    marginBottom: SPACE.lg,
    justifyContent: "center",
    alignItems: "center"
  },
  largeText: {
    color: COLORS.theme?.interface["900"],
    marginTop: SPACE._2xl,
    paddingBottom: SPACE.sm
  },
  lightText: { paddingBottom: SPACE._2xl },
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
  nextField: { marginTop: SPACE._2xl },
  signInContainer: { marginTop: SPACE._3xl },
  logo: { alignSelf: "center", marginVertical: 60 },
  forgot: {
    marginTop: SPACE._2xl,
    alignSelf: "center",
    color: COLORS.theme?.primaryColor
  }
});
