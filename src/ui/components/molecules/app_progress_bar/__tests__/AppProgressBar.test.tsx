import renderer from "react-test-renderer";
import React from "react";
import { AppProgressBar } from "../AppProgressBar";
import { render } from "@testing-library/react-native";

it("Renders snapshot as expected", () => {
  // given
  const tree = renderer
    .create(<AppProgressBar progressPercentage={25} />)
    .toJSON();

  // then
  expect(tree).toMatchSnapshot();
});

it("component throw error", () => {
  // given
  const percentage = 25;
  const { getByText } = render(
    <AppProgressBar progressPercentage={percentage} />
  );
  const bottomView = getByText(percentage.toString() + "%");

  //then
  expect(bottomView).toBeDefined();
});

describe("check bottom view visibility", () => {
  it("test bottom view is visible", () => {
    // given
    const { queryByTestId } = render(
      <AppProgressBar progressPercentage={25} />
    );
    const bottomView = queryByTestId("bottom-view");

    //then
    expect(bottomView).toBeDefined();
  });

  it("test bottom view is Invisible", () => {
    // given
    const { queryByTestId } = render(
      <AppProgressBar
        progressPercentage={25}
        shouldShowBottomText={false}
      />
    );
    const bottomView = queryByTestId("bottom-view");

    //then
    expect(bottomView).toBe(null);
  });
});

it("throw error when wrong percentage is provided", () => {
  // given
  const percentage = 101;
  try {
    render(<AppProgressBar progressPercentage={percentage} />);

    expect(percentage).toBe(null);
  } catch (e: any) {
    //then
    expect(e).toBeDefined();
  }
});
