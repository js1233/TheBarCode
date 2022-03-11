import { render } from "@testing-library/react-native";
import React from "react";
import { LoadMore } from "ui/components/atoms/app_load_more/LoadMore";

test("snapshot testing", () => {
  const rendered = render(<LoadMore />).toJSON();
  expect(rendered).toMatchSnapshot();
});
