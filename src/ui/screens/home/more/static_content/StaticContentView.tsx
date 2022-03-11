import React, { FC } from "react";
import Screen from "ui/components/atoms/Screen";
import WebView from "react-native-webview";

type Props = {
  uri: string;
};

export const StaticContentView: FC<Props> = ({ uri }) => {
  return (
    <Screen style={{ flex: 1 }} requiresSafeArea={false}>
      <WebView
        originWhitelist={["*"]}
        source={{
          uri: uri
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </Screen>
  );
};
