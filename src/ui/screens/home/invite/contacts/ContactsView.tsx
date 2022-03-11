import { Contact } from "models/Contact";
import React, { FC, useCallback } from "react";
import { StyleSheet } from "react-native";
import Screen from "ui/components/atoms/Screen";
import ItemContact from "ui/components/organisms/item_contact/ItemContact";
import MultiSelectList from "ui/components/organisms/multi_select_list/MultiSelectList";

type Props = {
  data: Contact[];
  onSelectionChange: (selectedIds: number[]) => void;
  selectedIds: number[];
  isLoading: boolean;
};

export const ContactsView: FC<Props> = ({
  data,
  onSelectionChange,
  selectedIds,
  isLoading
}) => {
  const renderItem = useCallback((isSelected, item) => {
    return <ItemContact contact={item} isSelected={isSelected} />;
  }, []);

  return (
    <Screen style={styles.container} shouldAddBottomInset={false}>
      <MultiSelectList<Contact>
        shouldShowProgressBar={isLoading}
        selectedIds={selectedIds}
        itemView={renderItem}
        onSelectionChange={onSelectionChange}
        data={data}
        noRecordFoundText="No Contacts Found"
        keyExtractor={(item) => item.id.toString()}
        containerStyle={styles.list}
        itemContainerStyle={styles.itemContainerStyle}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  list: { height: "100%" },
  itemContainerStyle: {
    width: "100%"
  }
});
