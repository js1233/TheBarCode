import { COLORS, FONT_SIZE, SPACE } from "config";
import React, { FC } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Screen from "ui/components/atoms/Screen";
import Cygnis from "assets/images/cygnis.svg";
import { AppLabel } from "ui/components/atoms/app_label/AppLabel";

type Props = {};

export const HomeView: FC<Props> = ({}) => {
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
            <Cygnis
              fill={"#199473"}
              width="240"
              height="240"
              style={styles.logo}
            />

            <AppLabel
              text="My colors is app primary color. But you know my styles are inline also am not define in strings file.  Lets Start having some fun. "
              numberOfLines={0}
              style={{
                fontSize: FONT_SIZE.sm,
                color: COLORS.theme?.primaryColor,
                alignSelf: "center",
                paddingHorizontal: SPACE._2xl
              }}
            />

            <AppLabel
              text="Fixed Me"
              style={{
                fontSize: FONT_SIZE._3xl,
                color: COLORS.theme?.primaryShade["800"],
                alignSelf: "center",
                fontStyle: "italic",
                paddingVertical: SPACE.md
              }}
            />
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
    flex: 1
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
  signInButtonText: {
    fontSize: FONT_SIZE.lg
  },
  scrollViewContent: {
    flexGrow: 1,
    flexDirection: "column"
  },
  nextField: { marginTop: SPACE.lg },
  signInContainer: { marginTop: SPACE._3xl },
  logo: { alignSelf: "center", marginVertical: 60 }
});
