import React from "react";
import { useFormikContext } from "formik";
import {
  AppButton,
  AppButtonProps
} from "ui/components/molecules/app_button/AppButton";
import { AppLog, TAG } from "utils/Util";

interface Props extends AppButtonProps {}

export const AppFormSubmit = React.memo<Props>(({ ...rest }) => {
  const { handleSubmit, isValid, submitForm, errors, values } =
    useFormikContext();
  return (
    <AppButton
      onPress={() => {
        AppLog.log(() => "Values: " + JSON.stringify(values), TAG.VENUE);
        AppLog.log(() => "Errors: " + JSON.stringify(errors), TAG.VENUE);
        if (isValid) {
          handleSubmit();
        } else {
          submitForm().then().catch();
        }
      }}
      {...rest}
    />
  );
});

export default AppFormSubmit;
