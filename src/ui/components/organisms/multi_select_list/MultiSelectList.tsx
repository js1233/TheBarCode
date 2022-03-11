import React, { useCallback, useEffect, useState } from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import {
  FlatListWithPb,
  FlatListWithPbProps
} from "ui/components/organisms/flat_list/FlatListWithPb";
import { AppLog, TAG } from "utils/Util";

type SelectableObject = {
  id: number;
};

export enum SELECTION_TYPE {
  SINGLE = "single",
  MULTIPLE = "multiple"
}

export interface Props<T extends SelectableObject>
  extends Omit<FlatListWithPbProps<T>, "renderItem"> {
  selectedIds?: [any];
  itemView: (isSelected: boolean, item: T) => React.ReactElement;
  onSelectionChange: (selectedIds: any) => void;
  containerStyle?: StyleProp<ViewStyle>;
  itemContainerStyle?: StyleProp<ViewStyle>;
  selectionType?: SELECTION_TYPE;
}

const MultiSelectList = <T extends SelectableObject>({
  selectedIds,
  itemView,
  onSelectionChange,
  containerStyle,
  itemContainerStyle,
  selectionType = SELECTION_TYPE.MULTIPLE,
  ...rest
}: Props<T>) => {
  const [_selectedIds, setSelectedIds] = useState<any[]>(
    selectedIds ?? []
  );

  useEffect(() => {
    if (selectedIds) {
      setSelectedIds(selectedIds);
    }
  }, [selectedIds]);

  const renderPressableItem = useCallback(
    ({ item }: { item: T }) => {
      const isSelected = _selectedIds?.includes?.(item?.id);
      return (
        <Pressable
          style={itemContainerStyle}
          onPress={() => {
            setSelectedIds((prevState: any) => {
              let newList: any;
              if (isSelected) {
                AppLog.log(() => "isSelected", TAG.SEARCH);
                if (selectionType === SELECTION_TYPE.SINGLE) {
                  newList = [...prevState];
                } else {
                  newList = [
                    ...prevState.filter((_item: any) => _item !== item.id)
                  ];
                }
              } else {
                AppLog.log(
                  () =>
                    "isNotSelected, prevState: " +
                    JSON.stringify(prevState),
                  TAG.SEARCH
                );
                let myList = [...prevState];
                if (selectionType === SELECTION_TYPE.SINGLE) {
                  myList = [];
                }
                myList.push(item.id);
                onSelectionChange?.(myList);
                return myList;
              }
              onSelectionChange?.(newList);
              return newList;
            });
          }}>
          {itemView(isSelected, item)}
        </Pressable>
      );
    },
    [
      onSelectionChange,
      _selectedIds,
      itemView,
      itemContainerStyle,
      selectionType
    ]
  );

  return (
    <FlatListWithPb<T>
      {...rest}
      contentContainerStyle={containerStyle}
      keyExtractor={(item) => item.id?.toString()}
      renderItem={renderPressableItem}
      extraData={_selectedIds}
    />
  );
};

export default MultiSelectList;
