import { usePreferredTheme } from "hooks";
import { FormikValues, useFormikContext } from "formik";
import React, { useRef } from "react";
import {
  AppLabel,
  AppLabelProps
} from "ui/components/atoms/app_label/AppLabel";
import { StyleProp, View, ViewStyle } from "react-native";
import { CheckBoxGroup } from "ui/components/atoms/checkbox_group/CheckBoxGroup";
import { AppLog } from "utils/Util";
import EIntBoolean from "models/enums/EIntBoolean";
import { AppFormValidationLabel } from "ui/components/molecules/app_form/AppFormValidationLabel";
import { OptionsData } from "models/OptionsData";

type AppFormCheckBoxGroupProps = {
  name: string;
  labelProps?: AppLabelProps;
  style?: StyleProp<ViewStyle>;
  listData: OptionsData[];
  isLocked: EIntBoolean;
  validationLabelTestID?: string;
};

export const AppFormCheckBoxGroup: React.FC<AppFormCheckBoxGroupProps> = ({
  listData,
  labelProps,
  name,
  style,
  isLocked = EIntBoolean.FALSE,
  validationLabelTestID
}) => {
  const theme = usePreferredTheme();
  const {
    setFieldValue,
    initialValues,
    setFieldTouched,
    touched,
    errors
  } = useFormikContext<FormikValues>();
  let result: React.MutableRefObject<OptionsData[]> = useRef([]);

  /*AppLog.logForcefullyForComplexMessages(
      () =>
    "AppFormCheckboxGroup => initialValues " +
      JSON.stringify(initialValues[name]) +
      " field name is : " +
      name
  );*/

  return (
    <View style={style}>
      {labelProps && (
        <AppLabel
          numberOfLines={0}
          style={[{ color: theme.themedColors.interface["900"] }]}
          {...labelProps}
        />
      )}

      <CheckBoxGroup
        listData={listData}
        preSelected={initialValues[name]}
        onChange={(checked: boolean, text?: string) => {
          AppLog.log(
            () =>
              "Checkbox check changed : " +
              checked +
              " and text is : " +
              text
          );
          let findElement = listData?.filter(
            ({ value }) => value === text
          );
          if (findElement !== undefined) {
            if (checked) {
              result.current.push(findElement[0]);
            } else {
              result.current = result.current.filter(
                ({ value }) => value !== text
              );
            }
            setFieldTouched(name, true);
            setFieldValue(name, result.current, true);
          }
        }}
        isLocked={isLocked}
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
