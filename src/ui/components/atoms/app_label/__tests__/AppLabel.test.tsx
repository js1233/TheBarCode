import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { AppLabel } from "ui/components/atoms/app_label/AppLabel";

test("check label match to the provided", () => {
  const { getByText } = render(<AppLabel text="Test" />);
  const appLabel = getByText("Test");
  expect(appLabel).toBeDefined();
});

test("check app label on Press", () => {
  const onPress = jest.fn();
  const { getByText } = render(<AppLabel text="Test" onPress={onPress} />);
  const appLabel = getByText("Test");
  fireEvent.press(appLabel);
  expect(onPress).toBeCalledTimes(1);
});
