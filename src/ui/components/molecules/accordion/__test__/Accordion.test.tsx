import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { AppLabel } from "ui/components/atoms/app_label/AppLabel";
import Accordion from "ui/components/molecules/accordion/Accordion";

test("snapshot testing", () => {
  const header = () => {
    return (
      <TouchableOpacity testID="header-click">
        <AppLabel text={"Sub Title"} />
      </TouchableOpacity>
    );
  };

  const body = () => {
    return <AppLabel text={"Sub Title"} />;
  };
  const rendered = render(
    <Accordion header={header} expandableItem={body} isExpanded={false} />
  ).toJSON();
  expect(rendered).toMatchSnapshot();
});

it("renders header correctly", () => {
  const onPress = jest.fn();
  const header = () => {
    return (
      <TouchableOpacity onPress={onPress} testID="header-click">
        <AppLabel text={"Sub Title"} />
      </TouchableOpacity>
    );
  };

  const body = () => {
    return <AppLabel text={"Sub Title"} />;
  };
  const { queryAllByTestId } = render(
    <Accordion header={header} expandableItem={body} isExpanded={false} />
  );
  const headerView = queryAllByTestId("accordion-header");
  let bodyView = queryAllByTestId("accordion-body");
  expect(headerView).not.toBeNull();
  expect(bodyView).not.toBeNull();
});

it("accordion body should not null when click event occured", () => {
  const onPress = jest.fn();
  const header = () => {
    return (
      <TouchableOpacity onPress={onPress} testID="header-click">
        <AppLabel text={"Sub Title"} />
      </TouchableOpacity>
    );
  };

  const body = () => {
    return <AppLabel text={"Sub Title"} />;
  };
  const { queryByTestId } = render(
    <Accordion header={header} expandableItem={body} isExpanded={true} />
  );
  let bodyView = queryByTestId("accordion-body");

  const button = queryByTestId("header-click");
  if (button) {
    fireEvent.press(button);
  }
  expect(onPress).toBeCalledTimes(1);
  expect(bodyView).not.toBeNull();
});
