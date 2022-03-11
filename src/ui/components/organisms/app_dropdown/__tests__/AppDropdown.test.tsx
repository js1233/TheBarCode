import renderer, { ReactTestInstance } from "react-test-renderer";
import React from "react";
import { AppDropdown } from "ui/components/organisms/app_dropdown/AppDropdown";
import {
  fireEvent,
  render,
  RenderAPI,
  waitFor
} from "@testing-library/react-native";
import { DropDownItem } from "models/DropDownItem";

let items: Array<DropDownItem> = [
  {
    value: "Male",
    text: "male"
  },
  {
    value: "Female",
    text: "female"
  },
  {
    value: "Other",
    text: "other"
  }
];

function getDropDownModal(
  getByTestId: (testID: string | RegExp) => ReactTestInstance
) {
  return getByTestId("dropdown-modal");
}

//click on dropdown to open modal
function performDropDownClick(
  getByTestId: (testID: string | RegExp) => ReactTestInstance
) {
  const dropDownClick = getByTestId("dropdown-click");
  fireEvent.press(dropDownClick);
}

function renderItem(onSelectedItem: jest.Mock<any, any>): RenderAPI {
  return render(
    <AppDropdown
      title="Select Gender"
      items={items}
      selectedItemCallback={onSelectedItem}
    />
  );
}

it("Renders snapshot as expected", () => {
  // given
  const onSelectedItem = jest.fn();
  const tree = renderer
    .create(
      <AppDropdown
        title="Select Gender"
        items={items}
        selectedItemCallback={onSelectedItem}
      />
    )
    .toJSON();

  // then
  expect(tree).toMatchSnapshot();
});

describe("check visibility of modal", () => {
  it("check modal visibility when item is not selected", async () => {
    // given
    const onSelectedItem = jest.fn();
    const { getByTestId } = renderItem(onSelectedItem);

    // then
    expect(getDropDownModal(getByTestId).props.visible).toBe(false);

    //when
    performDropDownClick(getByTestId);

    //then
    await waitFor(() => {
      expect(getDropDownModal(getByTestId).props.visible).toBe(true);
    });

    //when
    const closeModal = getByTestId("close-modal");
    fireEvent.press(closeModal);

    //then
    await waitFor(() => {
      expect(getDropDownModal(getByTestId).props.visible).toBe(false);
    });
  });

  it("check modal should invisible when item is selected", async () => {
    // given
    const onSelectedItem = jest.fn();
    const { getByTestId, queryAllByTestId } = renderItem(onSelectedItem);

    // then
    expect(getDropDownModal(getByTestId).props.visible).toBe(false);

    //when
    performDropDownClick(getByTestId);

    //then
    await waitFor(() => {
      expect(getDropDownModal(getByTestId).props.visible).toBe(true);
    });

    //when
    const dropDownItemClick = queryAllByTestId("dropdown-item-click");
    fireEvent.press(dropDownItemClick[0]); //pick first item from dropdown list

    //then
    await waitFor(() => {
      expect(getDropDownModal(getByTestId).props.visible).toBe(false);
    });
  });
});

it("check dropdown shows 3 entries", async () => {
  // given
  const onSelectedItem = jest.fn();
  const { getByTestId, queryAllByTestId } = renderItem(onSelectedItem);

  // then
  expect(getDropDownModal(getByTestId).props.visible).toBe(false);

  //when
  performDropDownClick(getByTestId);

  //then
  await waitFor(() => {
    expect(getDropDownModal(getByTestId).props.visible).toBe(true);
  });

  //then
  const dropDownItems = queryAllByTestId("dropdown-item-click");
  expect(dropDownItems.length).toBe(3);
});

it("check if dropdown shows selected item with right value", async () => {
  // given
  const onSelectedItem = jest.fn();
  const { getByTestId, queryAllByTestId } = renderItem(onSelectedItem);

  //when
  performDropDownClick(getByTestId);
  const dropDownItemClick = queryAllByTestId("dropdown-item-click");
  fireEvent.press(dropDownItemClick[0]); //pick first item from dropdown list

  //then
  await waitFor(() => {
    expect(onSelectedItem).toHaveBeenCalledWith({
      value: "Male",
      text: "male"
    });
  });

  //when
  performDropDownClick(getByTestId);
  fireEvent.press(dropDownItemClick[2]); //pick 3rd item from dropdown list

  //then
  await waitFor(() => {
    expect(onSelectedItem).toHaveBeenLastCalledWith({
      value: "Other",
      text: "other"
    });
  });

  //then
  expect(onSelectedItem).toHaveBeenCalledTimes(2);
});
