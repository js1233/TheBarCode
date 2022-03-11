import { COLORS, SPACE } from "config";
import { width } from "config/Dimens";
import Strings from "config/Strings";
import Preference from "models/Preference";
import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import Screen from "ui/components/atoms/Screen";
import { AppButton } from "ui/components/molecules/app_button/AppButton";
import ItemPreference from "ui/components/organisms/item_preference/ItemPreference";
import MultiSelectList from "ui/components/organisms/multi_select_list/MultiSelectList";

type Props = {
  preferences: Preference[] | undefined;
  selectedIds: number[];
  isLoading: boolean;
  error: string | undefined;
  onSelectionChange: (selectedIds: number[]) => void;
  onButtonPressed: () => void;
  shouldShowProgressBar: boolean;
};

const PreferencesView = React.memo<Props>(
  ({
    preferences,
    selectedIds,
    isLoading,
    error,
    onSelectionChange,
    onButtonPressed,
    shouldShowProgressBar
  }) => {
    const itemView = useCallback((isSelected, item) => {
      return <ItemPreference preference={item} isSelected={isSelected} />;
    }, []);

    return (
      <Screen
        style={styles.container}
        bottomSafeAreaColor={COLORS.theme?.secondaryBackground}>
        <View style={{ flex: 0.9 }}>
          <MultiSelectList<Preference>
            itemContainerStyle={styles.itemContainerStyle}
            itemView={itemView}
            selectedIds={selectedIds}
            onSelectionChange={onSelectionChange}
            data={preferences}
            shouldShowProgressBar={isLoading}
            error={error}
            numColumns={3}
            containerStyle={styles.list}
            ItemSeparatorComponent={() => (
              <View style={styles.separator} />
            )}
          />

          <View style={styles.bottomView}>
            <AppButton
              text={Strings.preferences.action_done}
              onPress={onButtonPressed}
              shouldShowProgressBar={shouldShowProgressBar}
            />
          </View>
        </View>
      </Screen>
    );
  }
);
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  list: { paddingVertical: SPACE.lg, paddingStart: SPACE.lg },
  separator: { height: SPACE.lg },
  itemContainerStyle: {
    width: (width - 4 * SPACE.lg) / 3,
    marginEnd: SPACE.lg
  },
  button: { marginTop: SPACE.lg, marginEnd: SPACE.lg },
  bottomView: {
    paddingTop: SPACE._2md,
    paddingHorizontal: SPACE.lg,
    borderTopColor: COLORS.theme?.borderColor,
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderWidth: 1
    // flex: 0.1
  }
});

export default PreferencesView;
