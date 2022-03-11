import { COLORS, SPACE } from "config";
import { useAppSelector } from "hooks/redux";
import ESearchType, {
  SearchTab,
  searchTabs
} from "models/enums/ESearchType";
import SearchParams from "models/SearchParams";
import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import SearchStackNavigator from "routes/SearchStackNavigator";
import { RootState } from "stores/store";
import Screen from "ui/components/atoms/Screen";
import ItemSearchTab from "ui/components/organisms/item_search_tab/ItemSearchTab";
import MultiSelectList, {
  SELECTION_TYPE
} from "ui/components/organisms/multi_select_list/MultiSelectList";
import { ViewType } from "ui/components/organisms/search_filter/SearchFilter";
import SearchScreenFilters from "ui/components/organisms/search_filter/SearchScreenFilters";
import { shadowStyleProps } from "utils/Util";

type Props = {
  searchParams?: SearchParams;
  searchType?: ESearchType;
  onTabSelected: (searchType: ESearchType) => void;
  onSearchParamsChange: (searchParams: SearchParams) => void;
  selectedIds?: ESearchType[];
  openListingOrMapScreen?: (viewType: ViewType) => void;
};

export default React.memo<Props>(
  ({
    searchParams,
    onSearchParamsChange,
    onTabSelected,
    selectedIds,
    openListingOrMapScreen
  }) => {
    const { user } = useAppSelector((state: RootState) => state.auth);
    const tabItemView = useCallback(
      (isSelected: boolean, item: SearchTab) => (
        <ItemSearchTab isSelected={isSelected} text={item.displayText} />
      ),
      []
    );

    const getTabData = () => {
      if (user?.oapa_code !== null && user?.oapa_code !== undefined) {
        return searchTabs;
      } else {
        return searchTabs.filter((item, index) => {
          return index !== 1;
        });
      }
    };

    return (
      <Screen
        style={styles.container}
        // shouldAddBottomInset={false}
        contentViewBackgroundColor={COLORS.theme?.primaryBackground}
        bottomSafeAreaColor={COLORS.theme?.interface[50]}
        topSafeAreaAndStatusBarColor={COLORS.theme?.primaryBackground}>
        <SearchScreenFilters
          searchParams={searchParams}
          onSearchFilterChanged={onSearchParamsChange}
          onViewTypeChanged={openListingOrMapScreen}
        />
        <MultiSelectList<SearchTab>
          data={getTabData()}
          itemView={tabItemView}
          onSelectionChange={(selectedIdsOnChange: any) => {
            onTabSelected(selectedIdsOnChange[0] as ESearchType);
          }}
          selectionType={SELECTION_TYPE.SINGLE}
          selectedIds={selectedIds}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.searchTabsContainer}
          style={{ paddingRight: SPACE.md }}
        />
        <View style={styles.toolbar} />
        <SearchStackNavigator searchParams={searchParams} />
      </Screen>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    bottom: 0
  },
  searchTabsContainer: {
    paddingHorizontal: SPACE.md,
    backgroundColor: "red",
    paddingVertical: SPACE.lg
  },
  toolbar: {
    marginTop: SPACE.sm,
    borderBottomColor: COLORS.theme?.borderColor,
    borderBottomWidth: 1,
    ...shadowStyleProps,
    shadowOpacity: 0.2
  }
});
