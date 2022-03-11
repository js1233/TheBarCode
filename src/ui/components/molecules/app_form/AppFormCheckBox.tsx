import { FormikValues, useFormikContext } from "formik";
import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { AppFormValidationLabel } from "ui/components/molecules/app_form/AppFormValidationLabel";
import CheckboxWithText from "ui/components/atoms/CheckboxWithText";

type Props = {
  fieldName: string;
  style?: StyleProp<ViewStyle>;
  text: string;
  validationLabelTestID?: string;
};

const AppFormCheckBox: React.FC<Props> = ({
  text,
  fieldName,
  style,
  validationLabelTestID
}) => {
  const {
    setFieldValue,
    initialValues,
    setFieldTouched,
    touched,
    errors
  } = useFormikContext<FormikValues>();

  return (
    <View style={style}>
      <CheckboxWithText
        text={text}
        preSelected={initialValues[fieldName]}
        onChange={(checked: boolean) => {
          setFieldTouched(fieldName, true);
          setFieldValue(fieldName, checked, true);
        }}
      />

      {errors[fieldName] && touched[fieldName] && (
        <AppFormValidationLabel
          validationLabelTestID={validationLabelTestID}
          errorString={errors[fieldName] as string}
          shouldVisible={true}
        />
      )}
    </View>
  );
};

export default AppFormCheckBox;
