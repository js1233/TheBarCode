import { fireEvent, render } from "@testing-library/react-native";
import RightIcon from "assets/images/right.svg";
import React from "react";
import {
  AppImageBackground,
  CONTAINER_TYPES
} from "ui/components/atoms/image_background/AppImageBackground";

const rightSvgIcon = () => {
  return <RightIcon testID="icon" width={20} height={20} />;
};

test("snapshot testing", () => {
  const rendered = render(
    <AppImageBackground containerShape={CONTAINER_TYPES.CIRCLE} />
  ).toJSON();
  expect(rendered).toMatchSnapshot();
});

it("renders icon correctly", () => {
  const { queryByTestId } = render(
    <AppImageBackground
      containerShape={CONTAINER_TYPES.CIRCLE}
      icon={rightSvgIcon}
    />
  );
  let icon = queryByTestId("icon");
  expect(icon).not.toBeNull();
});

it("should properly perform click event", () => {
  const onPress = jest.fn();
  const { getByTestId } = render(
    <AppImageBackground
      containerShape={CONTAINER_TYPES.CIRCLE}
      onPress={onPress}
      icon={rightSvgIcon}
    />
  );
  const imageButton = getByTestId("image-container");
  fireEvent.press(imageButton);
  expect(onPress).toBeCalledTimes(1);
});
