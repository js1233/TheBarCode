import { render } from "@testing-library/react-native";
import React from "react";
import "react-native";
import { Text, TouchableOpacity } from "react-native";
import { FlatListWithPb } from "ui/components/organisms/flat_list/FlatListWithPb";

type mock = {
  id: string;
  name: string;
};

const mockList: mock[] = [
  {
    id: "id1",
    name: "name1"
  },
  {
    id: "id2",
    name: "name2"
  },
  {
    id: "id3",
    name: "name3"
  }
];

const keyExtractor = (item: mock) => item.id.toString();

const listItem = ({ item }: { item: mock }) => (
  <TouchableOpacity testID={`item-${item.id}`}>
    <Text>{item.name}</Text>
  </TouchableOpacity>
);

test("snapshot", () => {
  const rendered = render(
    <FlatListWithPb<mock>
      keyExtractor={keyExtractor}
      shouldShowProgressBar={true}
      renderItem={listItem}
      data={mockList}
      style={{
        flexGrow: 1,
        flexBasis: 0
      }}
    />
  ).toJSON();
  expect(rendered).toMatchSnapshot();
});

test("should contain provided list element", () => {
  const { queryByTestId } = render(
    <FlatListWithPb<mock>
      keyExtractor={keyExtractor}
      shouldShowProgressBar={true}
      renderItem={listItem}
      data={mockList}
      style={{
        flexGrow: 1,
        flexBasis: 0
      }}
    />
  );
  expect(queryByTestId(`item-${mockList[0].id}`)).not.toBeNull();
  expect(queryByTestId(`item-${mockList[1].id}`)).not.toBeNull();
  expect(queryByTestId(`item-${mockList[2].id}`)).not.toBeNull();
  expect(queryByTestId("item-id0")).toBeNull();
});

test("show progress bar before loading the list", async () => {
  const { queryByTestId } = render(
    <FlatListWithPb<mock>
      keyExtractor={keyExtractor}
      shouldShowProgressBar={true}
      renderItem={listItem}
      data={undefined}
      style={{
        flexGrow: 1,
        flexBasis: 0
      }}
    />
  );
  const loader = queryByTestId("initial-loader");
  expect(loader).not.toBeNull();
});

test("hide progress bar after loading the list", async () => {
  const { queryByTestId } = render(
    <FlatListWithPb<mock>
      keyExtractor={keyExtractor}
      shouldShowProgressBar={false}
      renderItem={listItem}
      data={mockList}
      style={{
        flexGrow: 1,
        flexBasis: 0
      }}
    />
  );
  const loader = queryByTestId("initial-loader");
  expect(loader).toBeNull();
});

test("show error view", async () => {
  const { queryAllByTestId } = render(
    <FlatListWithPb<mock>
      error="Something went wrong"
      keyExtractor={keyExtractor}
      shouldShowProgressBar={false}
      renderItem={listItem}
      data={mockList}
      style={{
        flexGrow: 1,
        flexBasis: 0
      }}
    />
  );
  const error = queryAllByTestId("error");
  expect(error).not.toBeNull();
});
