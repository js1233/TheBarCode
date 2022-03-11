import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import AllFilters from "assets/images/all_filters.svg";
import LeftFilters from "assets/images/left_filters.svg";
import LocationMarkerBlack from "assets/images/location_marker_black.svg";
import Menu from "assets/images/menu.svg";
import { COLORS, SPACE, STRINGS } from "config";
import EOfferRedemptionFilter from "models/enums/EOfferRedemptionFilter";
import EPreferencesScreenUseCase from "models/enums/EPreferencesScreenUseCase";
import SearchParams from "models/SearchParams";
import React, { useRef, useState } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { HomeStackParamList } from "routes/HomeStack";
import ClickableIcon from "ui/components/atoms/clickable_icon/ClickableIcon";
import { SearchField } from "ui/components/atoms/search_field/SearchField";
import Separator, { Type } from "ui/components/atoms/separator/Separator";

export enum ViewType {
  LIST,
  MAP
}

type SearchNavigationProp = StackNavigationProp<
  HomeStackParamList,
  "Search"
>;

type Props = {
  containerStyle?: StyleProp<ViewStyle>;
  searchParams?: SearchParams;
  onViewTypeChanged?: (viewType: ViewType) => void;
  onSearchFilterChanged?: (searchParams: SearchParams) => void;
};

const SearchFilter: React.FC<Props> = ({
  containerStyle,
  searchParams,
  onSearchFilterChanged,
  onViewTypeChanged
}: Props) => {
  const navigation = useNavigation<SearchNavigationProp>();

  const _searchParams = useRef<SearchParams>(
    searchParams ?? {
      keyword: "",
      preferenceIds: [],
      standardOfferIds: [],
      isDelivery: false,
      redemptionFilter: EOfferRedemptionFilter.ALL
    }
  );
  const [_viewType, setViewType] = useState<ViewType>(ViewType.LIST);

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.filterContainer}>
        <ClickableIcon
          containerStyle={[
            styles.filterIconStartContainer,
            (_searchParams.current.standardOfferIds?.length ?? 0) > 0
              ? { backgroundColor: COLORS.white }
              : null
          ]}
          icon={() => <AllFilters />}
          onPress={() => {
            navigation.navigate("Filter", {
              offersId: _searchParams.current.standardOfferIds!,
              redeemFilter: [_searchParams.current.redemptionFilter!],
              onFiltersSelected: (
                selectedOfferFilterIds: number[],
                selectedRedeemFilter: string[]
              ) => {
                _searchParams.current.standardOfferIds =
                  selectedOfferFilterIds;
                _searchParams.current.redemptionFilter =
                  selectedRedeemFilter[0] as EOfferRedemptionFilter;
                onSearchFilterChanged?.(_searchParams.current);
              }
            });
          }}
        />
        <Separator
          type={Type.VERTICAL}
          color={COLORS.theme?.interface["300"]}
          thickness={1}
        />
        <ClickableIcon
          containerStyle={styles.filterIconEndContainer}
          icon={() => <LeftFilters />}
          onPress={() => {
            navigation.navigate("Preferences", {
              useCase: EPreferencesScreenUseCase.FILTER,
              selectedIds: _searchParams.current.preferenceIds,
              onPreferencesSelected: (preferenceIds: number[]) => {
                _searchParams.current.preferenceIds = preferenceIds;
                onSearchFilterChanged?.(_searchParams.current);
              }
            });
          }}
        />
      </View>
      <SearchField
        style={styles.keywordContainer}
        placeholder={STRINGS.search.hint_keyword}
        leftIcon={true}
        onChangeText={(textToSearch?: string) => {
          _searchParams.current.keyword = textToSearch ?? "";
          onSearchFilterChanged?.(_searchParams.current);
        }}
      />
      <View style={[styles.typeContainer]}>
        <ClickableIcon
          containerStyle={[
            styles.filterIconStartContainer,
            _viewType === ViewType.LIST
              ? { backgroundColor: COLORS.white }
              : null
          ]}
          onPress={() => {
            setViewType(ViewType.LIST);
            onViewTypeChanged?.(ViewType.LIST);
          }}
          icon={() => (
            <Menu
              stroke={_viewType === ViewType.LIST ? "#171717" : "#737373"}
            />
          )}
        />
        <Separator
          type={Type.VERTICAL}
          color={COLORS.theme?.interface["300"]}
          thickness={1}
        />
        <ClickableIcon
          containerStyle={[
            styles.filterIconEndContainer,
            _viewType === ViewType.MAP
              ? { backgroundColor: COLORS.white }
              : null
          ]}
          onPress={() => {
            setViewType(ViewType.MAP);
            onViewTypeChanged?.(ViewType.MAP);
          }}
          icon={() => (
            <LocationMarkerBlack
              stroke={_viewType === ViewType.MAP ? "#171717" : "#737373"}
            />
          )}
        />
      </View>
    </View>
  );
};

export default SearchFilter;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACE.sm,
    paddingVertical: SPACE._2xs
  },
  filterContainer: {
    flexDirection: "row",
    height: 36,
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: COLORS.theme?.interface["200"],
    borderRadius: 100,
    borderWidth: 1,
    borderColor: COLORS.theme?.interface["300"]
  },
  filterIconStartContainer: {
    paddingStart: SPACE.xs,
    paddingEnd: SPACE._2xs,
    height: 36,
    justifyContent: "center"
  },
  filterIconEndContainer: {
    paddingStart: SPACE._2xs,
    paddingEnd: SPACE.xs,
    height: 36,
    justifyContent: "center"
  },
  keywordContainer: {
    height: 36,
    borderRadius: 32,
    backgroundColor: COLORS.theme?.interface["200"],
    flexGrow: 1,
    marginHorizontal: SPACE.sm
  },
  typeContainer: {
    flexDirection: "row",
    height: 36,
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: COLORS.theme?.interface["200"],
    borderRadius: 100,
    borderWidth: 1,
    borderColor: COLORS.theme?.interface["300"]
  }
});
