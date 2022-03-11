import "react-native";
import { render } from "@testing-library/react-native";
import React from "react";

import { AppLabel } from "ui/components/atoms/app_label/AppLabel";

it("renders correctly", () => {
  const { getByText } = render(<AppLabel text="Hello World From Test" />);
  const textView = getByText("Hello World From Test");
  expect(textView).toBeDefined();
});
