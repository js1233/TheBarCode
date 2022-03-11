import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import AppForm from "ui/components/molecules/app_form/AppForm";
import * as Yup from "yup";
import AppFormField from "ui/components/molecules/app_form/AppFormField";
import { StyleSheet, View } from "react-native";
import { FormikValues } from "formik";
import AppFormFormSubmit from "ui/components/molecules/app_form/AppFormSubmit";
import { BUTTON_TYPES } from "ui/components/molecules/app_button/AppButton";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required("Enter an email address")
    .email("Enter a valid email address"),
  password: Yup.string()
    .required("Enter your password")
    .min(8, "Password should be atleast 8 chars")
});

const TestingFormView = ({
  initialValues = { email: "", password: "" },
  onSubmit = (_values: FormikValues) => {}
}) => {
  return (
    <AppForm
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}>
      <View style={styles.container}>
        <AppFormField
          fieldTestID="emailField"
          validationLabelTestID={"emailValidationLabel"}
          name="email"
          labelProps={{ text: "EMAIL" }}
          fieldInputProps={{
            textContentType: "emailAddress",
            keyboardType: "email-address",
            placeholder: "Enter your email address",
            autoCapitalize: "none"
          }}
        />
        <View style={styles.spacer} />
        <AppFormField
          fieldTestID="passwordField"
          validationLabelTestID="passwordValidationLabel"
          name="password"
          labelProps={{ text: "PASSWORD" }}
          fieldInputProps={{
            textContentType: "password",
            placeholder: "Enter your password",
            secureTextEntry: true
          }}
        />
        <View style={styles.spacer} />
        <AppFormFormSubmit
          testID={"formSubmit"}
          text={"Submit"}
          buttonType={BUTTON_TYPES.NORMAL}
        />
      </View>
    </AppForm>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16.0
  },
  spacer: {
    padding: 8
  }
});

describe("rendering...", () => {
  const handleSubmit = jest.fn();
  const wrapper = render(
    <TestingFormView
      initialValues={{ email: "", password: "" }}
      onSubmit={handleSubmit}
    />
  );

  it("renders correctly", () => {
    const snapshot = wrapper.toJSON();
    expect(snapshot).toMatchSnapshot();
  });
});

describe("validation testing", () => {
  const handleSubmit = jest.fn();
  it("should fail validation", async () => {
    const { getByTestId, getByText } = render(
      <TestingFormView
        initialValues={{ email: "", password: "" }}
        onSubmit={handleSubmit}
      />
    );

    const emailField = await getByTestId("emailField");
    const passwordField = await getByTestId("passwordField");

    const submitButton = await getByText("Submit");

    fireEvent.changeText(emailField, "test @.coa");
    fireEvent.changeText(passwordField, "");

    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(getByTestId("emailValidationLabel")).toBeDefined();
      expect(getByTestId("passwordValidationLabel")).toBeDefined();
      expect(handleSubmit).not.toHaveBeenCalled();
    });
  });

  it("should pass validations", async () => {
    const { getByTestId, getByText } = render(
      <TestingFormView
        initialValues={{ email: "", password: "" }}
        onSubmit={handleSubmit}
      />
    );

    fireEvent.changeText(getByTestId("emailField"), "test@test.com");
    fireEvent.changeText(getByTestId("passwordField"), "12345678");

    fireEvent.press(getByText("Submit"));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenLastCalledWith(
        { email: "test@test.com", password: "12345678" },
        expect.anything()
      );
    });
  });
});
