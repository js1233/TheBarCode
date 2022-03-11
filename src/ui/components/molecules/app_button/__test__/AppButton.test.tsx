import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import "react-native";
import { ReactTestInstance } from "react-test-renderer";
import { AppButton } from "ui/components/molecules/app_button/AppButton";
import LeftIcon from "assets/images/left.svg";
import RightIcon from "assets/images/right.svg";

test("snapshot testing", () => {
  const rendered = render(<AppButton text="Submit" />).toJSON();
  expect(rendered).toMatchSnapshot();
});

test("should properly perform click event", () => {
  const onPress = jest.fn();
  const { getByText } = render(
    <AppButton text="Submit" onPress={onPress} />
  );
  const button = getByText("Submit");
  fireEvent.press(button);
  expect(onPress).toBeCalledTimes(1);
});

it("renders activity indicator correctly", () => {
  let showPb = true;
  const { queryByTestId, update } = render(
    <AppButton text="Submit" shouldShowProgressBar={showPb} />
  );
  let loader = queryByTestId("loader");
  expect(loader).not.toBeNull();

  showPb = false;
  update(<AppButton text="Submit" shouldShowProgressBar={showPb} />);
  loader = queryByTestId("loader");
  expect(loader).toBeNull();
});

it("renders left icon", () => {
  const leftSvgIcon = () => {
    return <LeftIcon testID="left-icon" width={20} height={20} />;
  };
  const { queryByTestId } = render(
    <AppButton text="Submit" leftIcon={leftSvgIcon} />
  );
  const leftIconId = queryByTestId("left-icon");
  const rightIconId = queryByTestId("right-icon");
  expect(rightIconId).toBeNull();
  expect(leftIconId).not.toBeNull();
});

it("works fine even when all hell broke loose", async () => {
  const rightSvgIcon = () => {
    return <RightIcon testID="right-icon" width={20} height={20} />;
  };
  // given
  let rightIcon: ReactTestInstance | null = null,
    leftIcon: ReactTestInstance | null = null,
    loader: ReactTestInstance | null = null,
    text: ReactTestInstance | null = null;

  function queryComponents() {
    rightIcon = queryByTestId("right-icon");
    leftIcon = queryByTestId("left-icon");
    loader = queryByTestId("loader");
    text = queryByTestId("title");
  }

  function changePbStatus(_onPress: any, _update: any, _showPb: boolean) {
    showPb = _showPb;
    _update(
      <AppButton
        text="Submit"
        onPress={_onPress}
        shouldShowProgressBar={showPb}
        rightIcon={rightSvgIcon}
      />
    );
  }

  let showPb = false;
  const onPress = jest.fn((_onPress, _update) => {
    changePbStatus(_onPress, _update, true);
  });

  // when
  const { queryByTestId, getByText, update } = render(
    <AppButton
      text="Submit"
      onPress={() => {
        onPress(onPress, update);
      }}
      shouldShowProgressBar={showPb}
      rightIcon={rightSvgIcon}
    />
  );

  queryComponents();
  let button = getByText("Submit");

  // then
  expect(leftIcon).toBeNull();
  expect(rightIcon).not.toBeNull();
  expect(loader).toBeNull();
  expect(onPress).toBeCalledTimes(0);

  // when
  fireEvent.press(button);

  // when
  queryComponents();

  // then
  expect(leftIcon).toBeNull();
  expect(rightIcon).toBeNull();
  expect(text).toBeNull();
  expect(loader).not.toBeNull();
  expect(onPress).toBeCalledTimes(1);

  // when
  changePbStatus(onPress, update, false);
  queryComponents();

  // then
  expect(leftIcon).toBeNull();
  expect(rightIcon).not.toBeNull();
  expect(loader).toBeNull();
  expect(onPress).toBeCalledTimes(1);
});

test("onPress should not called in case of disable button", () => {
  const onPress = jest.fn();
  const { getByText } = render(
    <AppButton text="Submit" onPress={onPress} isDisable={true} />
  );
  const button = getByText("Submit");
  fireEvent.press(button);
  expect(onPress).toBeCalledTimes(0);
});
