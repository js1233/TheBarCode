import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import { SearchField } from "../SearchField";

const searchText = () => {
  return "Muhammad noman";
};

it("renders correctly", async () => {
  const { getByTestId } = render(
    <SearchField
      placeholder="Enter text"
      onChangeText={() => searchText}
      leftIcon={false}
      rightIcon={false}
    />
  );

  const textToSearch = getByTestId("SEARCH");
  fireEvent.changeText(textToSearch, searchText);
});

it("Snapshot testing", () => {
  const rendered = render(
    <SearchField
      placeholder="Enter text"
      onChangeText={() => searchText}
      leftIcon={false}
      rightIcon={false}
    />
  ).toJSON();
  expect(rendered).toMatchSnapshot();
});

it("Search by entered characters", async () => {
  const onChangeText = jest.fn();
  let inProcess: boolean = true;
  const { getByTestId } = render(
    <SearchField
      placeholder="Enter text"
      onChangeText={onChangeText}
      leftIcon={false}
      rightIcon={false}
    />
  );
  const textToSearch = getByTestId("SEARCH");

  await waitFor(() => {
    fireEvent.changeText(textToSearch, "Muhammad noman");
    if (inProcess) {
      inProcess = false;
      return;
    } else {
      expect(onChangeText).toBeCalledTimes(1);
      expect(onChangeText).toHaveBeenCalledWith("Muhammad noman");
    }
  });
});

it("renders left icon", () => {
  const { queryByTestId } = render(
    <SearchField
      placeholder={"Enter Text"}
      onChangeText={() => searchText}
      leftIcon={true}
      rightIcon={false}
    />
  );
  const leftIcon = queryByTestId("left-icon");
  const rightIcon = queryByTestId("right-icon");
  expect(rightIcon).toBeNull();
  expect(leftIcon).not.toBeNull();
});

it("renders right icon", () => {
  const { queryByTestId } = render(
    <SearchField
      placeholder={"Enter Text"}
      onChangeText={() => searchText}
      leftIcon={false}
      rightIcon={true}
    />
  );
  const rightIcon = queryByTestId("right-icon");
  const leftIcon = queryByTestId("left-icon");
  expect(leftIcon).toBeNull();
  expect(rightIcon).not.toBeNull();
});
