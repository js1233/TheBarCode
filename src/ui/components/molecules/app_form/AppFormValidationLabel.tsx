import React from "react";
import { StyleSheet } from "react-native";
import { FONT_SIZE } from "config";
import { AppLabel } from "ui/components/atoms/app_label/AppLabel";
import { usePreferredTheme } from "hooks";

export interface AppFormValidationLabelProps {
  errorString?: string;
  shouldVisible?: boolean;
  numberOfLines?: number;
  validationLabelTestID?: string;
}

type Props = AppFormValidationLabelProps;

export const AppFormValidationLabel = React.memo<Props>(
  ({
    errorString,
    shouldVisible,
    numberOfLines,
    validationLabelTestID
  }) => {
    const { themedColors } = usePreferredTheme();
    if (!shouldVisible || errorString === undefined) {
      return null;
    }
    return (
      <AppLabel
        testID={validationLabelTestID}
        text={errorString}
        style={[styles.error, { color: themedColors.error }]}
        numberOfLines={numberOfLines}
      />
    );
  }
);

const styles = StyleSheet.create({
  error: {
    fontSize: FONT_SIZE.xs,
    marginTop: 6,
    alignSelf: "flex-start"
  }
});
