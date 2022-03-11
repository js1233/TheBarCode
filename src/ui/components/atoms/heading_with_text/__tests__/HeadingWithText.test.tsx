import { render } from "@testing-library/react-native";
import React from "react";
import { HeadingWithText } from "ui/components/atoms/heading_with_text/HeadingWithText";

test("check render properly", () => {
  const { getByTestId } = render(
    <HeadingWithText
      headingText={"Lorem Ipsum"}
      text={
        "Lipsum as it is sometimes known, is dummy text used in laying out print."
      }
    />
  );
  const headingWithText = getByTestId("HEADING_WITH_TEXT");
  expect(headingWithText).toBeDefined();
});

test("Snapshot testing", () => {
  const rendered = render(
    <HeadingWithText
      headingText={"Lorem Ipsum"}
      text={
        "Lipsum as it is sometimes known, is dummy text used in laying out print."
      }
    />
  ).toJSON();
  expect(rendered).toMatchSnapshot();
});
