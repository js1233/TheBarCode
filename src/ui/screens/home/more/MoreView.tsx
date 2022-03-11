import React, { FC, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import Screen from "ui/components/atoms/Screen";
import { FlatListWithPb } from "ui/components/organisms/flat_list/FlatListWithPb";
import { ItemMore } from "ui/components/organisms/item_more/ItemMore";
import Separator from "ui/components/atoms/separator/Separator";
import EMoreType, {
  moreProperties,
  MoreProperty
} from "models/enums/EMoreType";

type Props = {
  moveToRequiredScreen: (moreType: EMoreType) => void;
};

export const MoreView: FC<Props> = ({ moveToRequiredScreen }) => {
  const listItem = useCallback(
    ({ item }: { item: MoreProperty }) => {
      return (
        <ItemMore moreType={item} itemOnPress={moveToRequiredScreen} />
      );
    },
    [moveToRequiredScreen]
  );

  return (
    <Screen style={styles.container} shouldAddBottomInset={false}>
      <FlatListWithPb
        data={moreProperties}
        renderItem={listItem}
        style={{ flex: 1 }}
        ItemSeparatorComponent={() => (
          <View style={styles.separator}>
            <Separator />
          </View>
        )}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  separator: { paddingLeft: 45 }
});
