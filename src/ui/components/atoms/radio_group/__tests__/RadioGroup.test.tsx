import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { DIRECTION_TYPE, RadioGroup } from "../RadioGroup";

test("check label match to the provided", () => {
  const { getByTestId } = render(
    <RadioGroup
      values={[
        { text: "male", value: "Male" },
        { text: "female", value: "Female" },
        { text: "others", value: "Others" }
      ]}
      direction={DIRECTION_TYPE.HORIZONTAL}
    />
  );
  const radioButton = getByTestId("RADIO_GROUP");
  expect(radioButton).toBeDefined();
});

test("check radio button on Press", () => {
  const onPress = jest.fn();
  const { getByText } = render(
    <RadioGroup
      values={[
        { text: "male", value: "Male" },
        { text: "female", value: "Female" },
        { text: "others", value: "Others" }
      ]}
      direction={DIRECTION_TYPE.HORIZONTAL}
      byDefaultSelected={0}
      onChange={onPress}
    />
  );
  const radioButton = getByText("Male");
  fireEvent.press(radioButton);
  expect(onPress).toBeCalledTimes(1);
  expect(onPress).toBeCalledWith({ text: "male", value: "Male" }, 0);
});

test("check radio button label on Press", () => {
  const onPress = jest.fn();
  const { getByText } = render(
    <RadioGroup
      values={[
        { text: "male", value: "Male" },
        { text: "female", value: "Female" },
        { text: "others", value: "Others" }
      ]}
      direction={DIRECTION_TYPE.HORIZONTAL}
      byDefaultSelected={1}
      onChange={onPress}
    />
  );
  expect(onPress).toBeCalledTimes(1);
  const radioButton = getByText("Female");
  fireEvent.press(radioButton);
  expect(onPress).toBeCalledTimes(1);
  expect(onPress).toBeCalledWith({ text: "female", value: "Female" }, 1);
});

it("Snapshot testing", () => {
  const rendered = render(
    <RadioGroup
      values={[
        { text: "male", value: "Male" },
        { text: "female", value: "Female" },
        { text: "others", value: "Others" }
      ]}
      direction={DIRECTION_TYPE.HORIZONTAL}
    />
  ).toJSON();
  expect(rendered).toMatchSnapshot();
});
