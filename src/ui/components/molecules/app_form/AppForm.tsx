import { Formik, FormikValues } from "formik";
import React from "react";

export interface AppFormProps {
  children?: React.ReactNode;
  initialValues: FormikValues;
  onSubmit: (values: FormikValues) => void;
  validateOnMount?: boolean;
  validationSchema: FormikValues;
}

type Props = AppFormProps;

const AppForm: React.FC<Props> = ({
  initialValues,
  onSubmit,
  validationSchema,
  validateOnMount,
  children
}) => {
  /*  AppLog.logForcefullyForComplexMessages(
      () =>
    "AppForm => initialValues " + JSON.stringify(initialValues)
  );*/

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validateOnMount={validateOnMount}
      validationSchema={validationSchema}>
      {() => <>{children}</>}
    </Formik>
  );
};

export default AppForm;
