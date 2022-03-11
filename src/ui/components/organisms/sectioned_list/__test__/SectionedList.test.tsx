import React from "react";
import {
  fireEvent,
  render,
  RenderAPI
} from "@testing-library/react-native";
import SectionedList, {
  BaseItem,
  Section
} from "ui/components/organisms/sectioned_list/SectionedList";
import { Text } from "react-native";

describe("Sectioned List tests", () => {
  let queryByText: RenderAPI["queryByText"];
  let toJSON: RenderAPI["toJSON"];

  type HeaderModel = BaseItem & { name: string };
  type BodyModel = BaseItem & { name: string };

  const data: Section<HeaderModel, BodyModel>[] = [
    {
      header: {
        name: "Heading 1",
        key: function () {
          return this.name;
        }
      },
      data: [
        {
          name: "Body 1",
          key: function () {
            return this.name;
          }
        },
        {
          name: "Body 2",
          key: function () {
            return this.name;
          }
        },
        {
          name: "Body 3",
          key: function () {
            return this.name;
          }
        }
      ]
    },
    {
      header: {
        name: "Heading 2",
        key: function () {
          return this.name;
        }
      },
      data: [
        {
          name: "Body 4",
          key: function () {
            return this.name;
          }
        },
        {
          name: "Body 5",
          key: function () {
            return this.name;
          }
        }
      ]
    },
    {
      header: {
        name: "Heading 3",
        key: function () {
          return this.name;
        }
      },
      data: [
        {
          name: "Body 6",
          key: function () {
            return this.name;
          }
        },
        {
          name: "Body 7",
          key: function () {
            return this.name;
          }
        }
      ]
    }
  ];

  beforeEach(() => {
    ({ queryByText, toJSON } = render(
      <SectionedList
        list={data}
        selectedIndexProp={{ indexValue: 1 }}
        bodyView={(bodyItem: BodyModel) => <Text>{bodyItem.name}</Text>}
        headerView={(header: HeaderModel, _: boolean) => (
          <Text>{header.name}</Text>
        )}
      />
    ));
  });

  test("snapshot", () => {
    expect(toJSON()).toMatchSnapshot();
  });

  test("contains provided headers", () => {
    expect(queryByText(data[0].header.name)).toBeDefined();
    expect(queryByText(data[1].header.name)).toBeDefined();
    expect(queryByText(data[2].header.name)).toBeDefined();
  });

  test("show all body view for selected section", () => {
    expect(queryByText(data[1].data[0].key())).toBeDefined();
    expect(queryByText(data[1].data[1].key())).toBeDefined();
  });

  // test("do not show body for unselected view", () => {
  //   expect(queryByText(data[0].data[0].key())).toBeNull();
  //   expect(queryByText(data[0].data[1].key())).toBeNull();
  // });

  test("change body views when different heading is pressed", () => {
    expect(queryByText(data[1].data[0].key())).toBeDefined();
    expect(queryByText(data[2].data[0].key())).toBeNull();

    // when
    fireEvent.press(queryByText(data[2].header.name)!);

    // then
    expect(queryByText(data[1].data[0].key())).toBeNull();
    expect(queryByText(data[2].data[0].key())).toBeDefined();
  });
});
