import { COLORS, FONT_SIZE, SPACE } from "config";
import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import Strings from "config/Strings";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackParamList } from "routes";
import { useNavigation } from "@react-navigation/native";
import EMoreType from "models/enums/EMoreType";
import MultilineSpannableText from "ui/components/atoms/multiline_spannable_text/MultilineSpannableText";

type Props = {
  style?: StyleProp<ViewStyle>;
};

type LoginNavigationProp = StackNavigationProp<
  AuthStackParamList,
  "Login"
>;

const TermsPolicyView = React.memo<Props>(({ style }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigation = useNavigation<LoginNavigationProp>();

  return (
    <View style={[style, styles.container]}>
      <MultilineSpannableText
        text={[
          Strings.signUp.terms,
          Strings.signUp.terms_of_use,
          " and ",
          Strings.signUp.privacy_policy
        ]}
        containerStyle={{
          flexDirection: "row"
        }}
        rootTextStyle={styles.rootText}
        appLabelProps={[
          {
            style: [
              styles.textStyle,
              { color: COLORS.theme?.interface["900"] }
            ]
          },
          {
            style: [styles.textStyle],
            onPress: () => navigation.navigate("StaticContent")
          },
          {
            style: [
              styles.textStyle,
              { color: COLORS.theme?.interface["900"] }
            ]
          },
          {
            style: [styles.textStyle],
            onPress: () =>
              navigation.navigate("StaticContent", {
                contentType: EMoreType.PRIVACY_POLICY
              })
          }
        ]}
      />
    </View>
  );
});
const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACE._2xl,
    paddingVertical: SPACE._2xl
  },
  rootText: {
    textAlign: "center"
  },
  textStyle: {
    color: COLORS.theme?.primaryColor,
    textAlign: "center",
    fontSize: FONT_SIZE._2xs
  }
});

export default TermsPolicyView;
