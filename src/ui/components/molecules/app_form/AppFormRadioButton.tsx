import { OptionsData } from "models/OptionsData";
import React from "react";
import { StyleSheet, View } from "react-native";
import {
  AppLabel,
  AppLabelProps
} from "ui/components/atoms/app_label/AppLabel";
import { SPACE } from "config";
import usePreferredTheme from "hooks/theme/usePreferredTheme";
import {
  DIRECTION_TYPE,
  RadioGroup
} from "ui/components/atoms/radio_group/RadioGroup";
import { FormikValues, useFormikContext } from "formik";
import EIntBoolean from "models/enums/EIntBoolean";
import { AppFormValidationLabel } from "ui/components/molecules/app_form/AppFormValidationLabel";

type Props = {
  name: string;
  labelProps?: AppLabelProps;
  radioData: OptionsData[];
  direction: DIRECTION_TYPE;
  isLocked?: EIntBoolean;
  validationLabelTestID?: string;
};

export const AppFormRadioButton: React.FC<Props> = ({
  name,
  labelProps,
  radioData,
  direction,
  isLocked = EIntBoolean.FALSE,
  validationLabelTestID
}) => {
  const theme = usePreferredTheme();

  const {
    setFieldValue,
    initialValues,
    touched,
    setFieldTouched,
    errors
  } = useFormikContext<FormikValues>();

  return (
    <View>
      {labelProps && (
        <AppLabel
          numberOfLines={0}
          style={[
            styles.value,
            { color: theme.themedColors.interface["900"] }
          ]}
          {...labelProps}
        />
      )}
      <RadioGroup
        values={radioData!}
        direction={direction}
        itemsInRow={3}
        isLocked={isLocked}
        onChange={(value: OptionsData, _: number) => {
          if (value !== undefined) {
            setFieldValue(name, value.value, true);
            setFieldTouched(name, true);
          }
        }}
        byDefaultSelected={radioData.findIndex(
          (item) =>
            item.value.toLowerCase() ===
            initialValues[name]?.toString().toLowerCase()
        )}
      />

      {errors[name] && touched[name] && (
        <AppFormValidationLabel
          validationLabelTestID={validationLabelTestID}
          errorString={errors[name] as string}
          shouldVisible={true}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  value: {
    paddingBottom: SPACE.xs
  }
});
