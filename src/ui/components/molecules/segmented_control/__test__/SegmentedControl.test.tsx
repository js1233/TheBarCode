import React from "react";
import {
  fireEvent,
  render,
  RenderAPI
} from "@testing-library/react-native";
import {
  Choice,
  SegmentedControl
} from "ui/components/molecules/segmented_control/SegmentedControl";

describe("Segmented control tests", () => {
  let onChangeMockedFn: jest.Mock<void, [Choice, number]>;
  let getByText: RenderAPI["getByText"];
  let toJSON: RenderAPI["toJSON"];
  let update: RenderAPI["update"];

  const values: Choice[] = [
    { label: "Label 1", value: "Value 1" },
    { label: "Label 2", value: "Value 2" },
    { label: "Label 3", value: "Value 3" }
  ];

  beforeEach(() => {
    onChangeMockedFn = jest.fn();
    ({ getByText, toJSON, update } = render(
      <SegmentedControl
        values={values}
        onChange={onChangeMockedFn}
        selectedIndex={1}
      />
    ));
  });

  test("snapshot", () => {
    expect(toJSON()).toMatchSnapshot();
  });

  test("contains values provided", () => {
    expect(getByText(values[0].label)).not.toBeNull();
    expect(getByText(values[1].label)).not.toBeNull();
    expect(getByText(values[2].label)).not.toBeNull();
  });

  test("callback fires when a tab is clicked", () => {
    // when
    fireEvent.press(getByText(values[2].label));

    // then
    expect(onChangeMockedFn).toBeCalledWith(values[2], 2);
  });

  test("throw error when values length lesser than  2 is passed", (doneCallback) => {
    // given
    const emptyList: Choice[] = [];
    try {
      update(
        <SegmentedControl
          values={emptyList}
          onChange={onChangeMockedFn}
          selectedIndex={1}
        />
      );
    } catch (e: any) {
      // then
      expect(e.message).toBeDefined();
      doneCallback();
    }
  });
});
