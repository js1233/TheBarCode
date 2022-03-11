import { SPACE } from "config";
import { usePreferredTheme } from "hooks";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacityProps,
  View
} from "react-native";
import { WebView } from "react-native-webview";

export interface WebViewProps extends TouchableOpacityProps {
  url: string;
  urlType: URL_TYPES;
  shouldPlayVideo: boolean;
}

export enum URL_TYPES {
  LINK = "link",
  EMBEDDED = "embedded"
}

export const WebViewComponent = React.memo<WebViewProps>(
  ({ url, urlType, shouldPlayVideo }) => {
    const head = `<style>body{margin:0}</style><meta name="viewport" content="width=device-width, height=100%, initial-scale=1">`;
    const html = `<!DOCTYPE html><html><head>${head}</head><body>${url}</body></html>`;
    const theme = usePreferredTheme();
    function loadingIndicatorView() {
      return (
        <View style={style.webViewContainer}>
          <ActivityIndicator
            color={theme.themedColors.primaryColor}
            size="small"
          />
        </View>
      );
    }
    return (
      <View
        style={[
          style.container,
          // urlType === URL_TYPES.LINK ? { height: 350 } : {},
          { backgroundColor: theme.themedColors.secondaryBackground }
        ]}>
        {shouldPlayVideo && (
          <WebView
            originWhitelist={["*"]}
            bounces={false}
            mediaPlaybackRequiresUserAction={true}
            dataDetectorTypes="link"
            scrollEnabled={false}
            coverScreen={false}
            renderLoading={loadingIndicatorView}
            automaticallyAdjustContentInsets={true}
            startInLoadingState={true}
            useWebKit
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowsFullscreenVideo={true}
            scalesPageToFit={true}
            source={
              urlType === URL_TYPES.LINK
                ? { uri: url }
                : {
                    html:
                      `<style type="text/css">iframe{max-width: 100%; max-height: fit-content;}</style>` +
                      html
                  }
            }
            style={[
              style.webViewContainer,
              { backgroundColor: theme.themedColors.secondaryBackground }
            ]}
          />
        )}
      </View>
    );
  }
);

const style = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: 150,
    marginTop: SPACE.md
  },
  webViewContainer: {
    flex: 1,
    width: "100%",
    height: 140
  }
});
