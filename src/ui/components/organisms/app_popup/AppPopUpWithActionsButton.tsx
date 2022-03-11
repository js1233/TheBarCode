import { FONT_SIZE, SPACE } from "config";
import { usePreferredTheme } from "hooks";
import React, { FC } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  AppLabel,
  AppLabelProps,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import { shadowStyleProps } from "utils/Util";

export type Action = {
  title: string;
  style?: AppLabelProps;
  onPress: () => void;
};

type Props = {
  isVisible: boolean;
  title?: string;
  message?: string;

  titleStyle?: AppLabelProps;
  messageStyle?: AppLabelProps;

  actions?: Action[];
  customActionButtons?: React.ReactElement;
};

const AppPopUpWithActionsButton: FC<Props> = ({
  isVisible,
  title,
  message = "App Would Like to Access the Camera",
  actions,
  titleStyle,
  messageStyle,
  customActionButtons
}) => {
  const theme = usePreferredTheme();

  if (!isVisible) {
    return null;
  }

  return (
    <Modal
      testID="popup-modal"
      visible={isVisible}
      animationType="fade"
      transparent={true}>
      <View style={styles.root}>
        <View
          style={[
            styles.content,
            { backgroundColor: theme.themedColors.primaryBackground }
          ]}>
          <View style={styles.textContainer}>
            {title && (
              <AppLabel
                style={[
                  styles.titleStyle,
                  { color: theme.themedColors.interface["900"] }
                ]}
                textType={TEXT_TYPE.BOLD}
                text={title}
                numberOfLines={0}
                {...titleStyle}
              />
            )}
            {title && message && <View style={styles.spacer} />}
            {message && (
              <AppLabel
                style={[
                  styles.messageStyle,
                  { color: theme.themedColors.interface["900"] }
                ]}
                text={message}
                numberOfLines={0}
                {...messageStyle}
              />
            )}
          </View>
          <View>
            {customActionButtons}
            {!customActionButtons &&
              actions?.map((action, idx) => {
                return (
                  <View key={idx}>
                    <View
                      style={[
                        styles.separator,
                        {
                          backgroundColor: theme.themedColors.borderColor
                        }
                      ]}
                    />
                    <TouchableOpacity
                      style={styles.actionContainer}
                      onPress={action.onPress}>
                      <AppLabel
                        style={[
                          styles.actionStyle,
                          { color: theme.themedColors.interface["900"] }
                        ]}
                        text={action.title}
                        numberOfLines={0}
                        {...action.style}
                      />
                    </TouchableOpacity>
                  </View>
                );
              })}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(90,94,94,0.6)"
  },
  actionContainer: {
    padding: SPACE.md
  },
  actionStyle: {
    fontSize: FONT_SIZE.lg,
    textAlign: "center"
  },
  content: {
    width: "100%",
    maxWidth: 300,
    borderRadius: 12,
    overflow: "hidden",
    ...shadowStyleProps
  },
  textContainer: {
    padding: SPACE.lg
  },
  titleStyle: {
    fontSize: FONT_SIZE.base,
    textAlign: "center"
  },
  messageStyle: {
    fontSize: FONT_SIZE.base,
    textAlign: "center"
  },
  separator: {
    height: 0.5
  },
  spacer: {
    padding: SPACE.xs
  }
});

export default AppPopUpWithActionsButton;
