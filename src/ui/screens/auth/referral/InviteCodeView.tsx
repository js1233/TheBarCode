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
import Referral from "assets/images/referral.svg";
import MultilineSpannableText from "ui/components/atoms/multiline_spannable_text/MultilineSpannableText";

type Props = {
  submitCode: (verificationCode: string) => void;
  shouldShowProgressBar: boolean;
  skip: () => void;
};

const validationSchema = Yup.object().shape({
  code: Yup.string()
    .optional()
    .max(7, Strings.inviteCode.referral_code_validation)
});

let initialValues: FormikValues = {
  code: ""
};

export const InviteCodeView: FC<Props> = ({
  submitCode,
  shouldShowProgressBar,
  skip
}) => {
  const onSubmit = (_value: FormikValues) => {
    submitCode(_value.code);
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
              <Referral stroke={COLORS.theme?.primaryColor} />

              <AppLabel
                text={Strings.inviteCode.enter_referral_code}
                style={styles.largeText}
                textType={TEXT_TYPE.BOLD}
              />

              <MultilineSpannableText
                text={[Strings.inviteCode.promoText]}
                appLabelProps={[
                  {
                    style: {
                      color: COLORS.theme?.interface["900"],
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
                    text: STRINGS.inviteCode.title,
                    style: styles.nextField
                  }}
                  fieldInputProps={{
                    keyboardType: "default",
                    returnKeyType: "done",
                    placeholder: STRINGS.inviteCode.enter_referral_code,
                    autoCapitalize: "none",
                    placeholderTextColor: COLORS?.theme?.placeholderColor,
                    style: {
                      color: COLORS.theme?.interface["900"]
                    },
                    viewStyle: [styles.textFieldStyle]
                  }}
                />

                <AppFormSubmit
                  text={STRINGS.inviteCode.btnText}
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
                text={Strings.inviteCode.skip}
                style={styles.bottomText}
                textType={TEXT_TYPE.SEMI_BOLD}
                onPress={skip}
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
    color: COLORS.theme?.interface["500"],
    marginTop: SPACE._2xl
  },

  formContainer: {
    marginBottom: SPACE.lg,

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
