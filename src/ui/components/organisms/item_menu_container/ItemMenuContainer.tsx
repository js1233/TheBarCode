import { SPACE } from "config";
import {
  ModifierDetails,
  ModifierGroup
} from "models/api_responses/ModifierDetailsResponseModel";
import React, { FC, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { FlatListWithPb } from "../flat_list/FlatListWithPb";
import NoRecordFound from "assets/images/tbc.svg";
import ItemModifierGroupContainer from "../item_modifier_group_container/ItemModifierGroupContainer";

type Props = {
  data: ModifierDetails;
  recalculatePrice: () => void;
  shouldShowCheckButton: boolean;
};

const ItemMenuContainer: FC<Props> = ({ data, recalculatePrice }) => {
  const renderItem = useCallback(
    ({ item }: { item: ModifierGroup }) => {
      return (
        <ItemModifierGroupContainer
          modifiers={item}
          recalculatePrice={recalculatePrice}
        />
      );
    },
    [recalculatePrice]
  );

  return (
    <View style={[styles.container]}>
      {data.modifier_groups != null && (
        <FlatListWithPb
          data={data.modifier_groups}
          renderItem={renderItem}
          style={[styles.list]}
          noRecordFoundImage={
            <NoRecordFound width={"100%"} height={"44%"} />
          }
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  list: {
    flex: 1,
    marginTop: SPACE.md
  }
});

export default ItemMenuContainer;
