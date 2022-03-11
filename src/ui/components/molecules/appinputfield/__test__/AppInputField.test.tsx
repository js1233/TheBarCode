import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { AppInputField } from "ui/components/molecules/appinputfield/AppInputField";

test("snapshot testing", () => {
  const rendered = render(<AppInputField />).toJSON();
  expect(rendered).toMatchSnapshot();
});

describe("AppInputField", () => {
  //fireEvent.changeText(getByTestId("InputField"), "Hello world");

  const inputText = "Hello World";
  let getByTestId: any;

  beforeEach(() => {
    ({ getByTestId } = render(
      <AppInputField valueToShowAtStart={inputText} />
    ));
  });

  it("test the on change text", function () {
    fireEvent.changeText(getByTestId("InputField"), inputText);
  });

  it("test the value of input field", function () {
    expect(getByTestId("InputField").props.value).toEqual(inputText);
  });

  it("clears the input text", function () {
    fireEvent.changeText(getByTestId("InputField"), "");
    expect(getByTestId("InputField").props.value).toEqual("");
  });
});
