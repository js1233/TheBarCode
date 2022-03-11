import { SPACE } from "config";
import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import { ConnectWithFacebook } from "ui/components/organisms/connect_with_facebook/ConnectWithFacebook";

type Props = {};

export const ConnectWithFacebookView: FC<Props> = () => {
  return (
    <View style={styles.container}>
      <ConnectWithFacebook />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: SPACE.lg
  }
});
