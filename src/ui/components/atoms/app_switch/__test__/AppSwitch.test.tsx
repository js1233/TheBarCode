import renderer from "react-test-renderer";
import { AppSwitch } from "ui/components/atoms/app_switch/AppSwitch";
import React from "react";
import { fireEvent, render } from "@testing-library/react-native";

it("Renders snapshot as expected", () => {
  // given
  const onValueChangeCallback = jest.fn();
  const tree = renderer
    .create(
      <AppSwitch
        defaultValue={true}
        onValueChange={onValueChangeCallback}
      />
    )
    .toJSON();

  // then
  expect(tree).toMatchSnapshot();
});

describe("test if callbacks works as expected", () => {
  it("check switch on when initial value of switch is false", () => {
    // given
    const onValueChangeCallback = jest.fn();
    const { getByTestId } = render(
      <AppSwitch
        defaultValue={false}
        onValueChange={onValueChangeCallback}
      />
    );

    // when
    const appSwitch = getByTestId("app-switch");
    fireEvent(appSwitch, "onToggle");

    // then
    expect(onValueChangeCallback).toHaveBeenCalledTimes(2);
    expect(onValueChangeCallback).toHaveBeenLastCalledWith(true);
  });

  it("works fine with given initial value", () => {
    // given
    let currentValue: boolean | undefined;
    const onValueChangeCallback = jest.fn((_value: boolean) => {
      currentValue = _value;
    });

    // when
    const { getByTestId } = render(
      <AppSwitch
        defaultValue={true}
        onValueChange={onValueChangeCallback}
      />
    );
    const appSwitch = getByTestId("app-switch");

    // then
    expect(currentValue).toBe(true);

    // when
    fireEvent(appSwitch, "onToggle");

    // then
    expect(currentValue).toBe(false);
  });
});
