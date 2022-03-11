import Selector from "assets/images/selector.svg";
import { COLORS, FONT_SIZE, SPACE } from "config";
import { usePreferredTheme } from "hooks";
import EOrderStatus, { getDropdownItems } from "models/enums/EOrderStatus";
import React, { useRef } from "react";
import { StyleSheet, View } from "react-native";
import { AppDropdown } from "ui/components/organisms/app_dropdown/AppDropdown";
import { AppLog } from "utils/Util";

interface Props {
  onFilterChange: (status?: EOrderStatus) => void;
}

const OrderFilter: React.FC<Props> = ({ onFilterChange }) => {
  const { themedColors } = usePreferredTheme();

  const selectedItem = useRef<EOrderStatus | undefined>();

  const onStatusChange = (item: any) => {
    AppLog.log(() => "in onGenderChange()..." + JSON.stringify(item));
    selectedItem.current = item.text;
    onFilterChange(item.text);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: themedColors.primaryBackground }
      ]}>
      <AppDropdown
        style={[
          styles.dropDown,
          { backgroundColor: themedColors.secondaryBackground }
        ]}
        textStyle={[
          styles.genderText,
          { color: themedColors.interface["900"] }
        ]}
        shouldShowCustomIcon={true}
        dropDownIcon={() => (
          <Selector fill={COLORS.black} width={20} height={20} />
        )}
        items={getDropdownItems()}
        selectedItemCallback={(item) => {
          onStatusChange(item);
        }}
        shouldRunCallbackOnStart={false}
        placeHolderText={{
          text: null,
          value: "Filter Orders by status"
        }}
        customTextContainerStyle={styles.dropdownTextContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "yellow",
    paddingHorizontal: SPACE.lg,
    paddingTop: SPACE.md,
    paddingBottom: SPACE.sm
  },
  search: {
    borderTopStartRadius: 21,
    borderBottomStartRadius: 21,
    borderTopEndRadius: 0,
    borderBottomEndRadius: 0,
    height: 42,
    flex: 3,
    borderEndWidth: StyleSheet.hairlineWidth
  },
  dropDown: {
    borderRadius: 20,
    height: 42,
    flex: 2,
    paddingLeft: SPACE.lg
  },
  searchText: { fontSize: FONT_SIZE._2xs },
  genderText: {
    fontSize: FONT_SIZE._2xs
  },
  separator: {
    backgroundColor: COLORS.white,
    width: 0.5
  },
  dropdownTextContainer: {
    alignItems: "flex-start"
  }
});

export default OrderFilter;
