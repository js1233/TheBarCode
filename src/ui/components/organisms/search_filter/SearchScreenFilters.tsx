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
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle
} from "react-native";
import { HomeStackParamList } from "routes/HomeStack";
import ClickableIcon from "ui/components/atoms/clickable_icon/ClickableIcon";
import { SearchField } from "ui/components/atoms/search_field/SearchField";
import Cross from "assets/images/ic_cross.svg";
import { AppLog, TAG } from "utils/Util";
import { AppLabel } from "ui/components/atoms/app_label/AppLabel";
import { useAppDispatch, useAppSelector } from "hooks/redux";
import { RootState } from "stores/store";
import ESearchType from "models/enums/ESearchType";
import { setSelectedSearchTab } from "stores/generalSlice";

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

const SearchScreenFilters: React.FC<Props> = ({
  containerStyle,
  searchParams,
  onSearchFilterChanged,
  onViewTypeChanged
}: Props) => {
  const navigation = useNavigation<SearchNavigationProp>();
  const [shouldHideFilters, setShouldHideFilters] = useState(false);
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
  const { standardOfferIds, redeemType, preferenceIds } = useAppSelector(
    (state: RootState) => state.general
  );
  const dispatch = useAppDispatch();

  return (
    <View style={[styles.container, containerStyle]}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center"
        }}>
        {!shouldHideFilters && (
          <Pressable
            onPress={() => {
              dispatch(setSelectedSearchTab(ESearchType.VENUE));
              navigation.goBack();
            }}
            style={styles.leftHeader}>
            <Cross
              fill={COLORS.theme?.interface[500]}
              width={20}
              height={20}
            />
          </Pressable>
        )}
        <SearchField
          style={styles.keywordContainer}
          placeholder={STRINGS.search.hint_keyword}
          leftIcon={true}
          onChangeText={(textToSearch?: string) => {
            AppLog.log(
              () => "onChangeText: " + JSON.stringify(textToSearch),
              TAG.SEARCH
            );

            AppLog.log(
              () =>
                "_searchParams.current.keyword: " +
                JSON.stringify(_searchParams.current.keyword),
              TAG.SEARCH
            );

            if (textToSearch !== _searchParams.current.keyword) {
              _searchParams.current.keyword = textToSearch ?? "";
              onSearchFilterChanged?.(_searchParams.current);
            }
          }}
          OnClickedSearchField={() => {
            AppLog.log(() => "setShouldHideFilters: ", TAG.SEARCH);
            setShouldHideFilters(true);
          }}
          rightIcon={shouldHideFilters}
        />
        {shouldHideFilters && (
          <Pressable onPress={() => setShouldHideFilters(false)}>
            <AppLabel text="Cancel" style={{ marginEnd: SPACE.xs }} />
          </Pressable>
        )}
        {!shouldHideFilters && (
          <View style={{ flexDirection: "row" }}>
            <ClickableIcon
              containerStyle={[styles.filterContainerView]}
              icon={() => <AllFilters />}
              onPress={() => {
                navigation.navigate("Filter", {
                  offersId: standardOfferIds,
                  redeemFilter: [redeemType],
                  onFiltersSelected: (
                    selectedOfferFilterIds: number[],
                    selectedRedeemFilter: string[]
                  ) => {
                    // dispatch(setStandardOfferIds(selectedOfferFilterIds));
                    _searchParams.current.standardOfferIds =
                      selectedOfferFilterIds;
                    _searchParams.current.redemptionFilter =
                      selectedRedeemFilter[0] as EOfferRedemptionFilter;
                    onSearchFilterChanged?.(_searchParams.current);
                  }
                });
              }}
            />

            <ClickableIcon
              containerStyle={styles.filterContainerView}
              icon={() => <LeftFilters />}
              onPress={() => {
                navigation.navigate("Preferences", {
                  useCase: EPreferencesScreenUseCase.FILTER,
                  selectedIds: preferenceIds,
                  onPreferencesSelected: (
                    onSelectedPreferenceIds: number[]
                  ) => {
                    _searchParams.current.preferenceIds =
                      onSelectedPreferenceIds;
                    onSearchFilterChanged?.(_searchParams.current);
                  }
                });
              }}
            />

            <ClickableIcon
              containerStyle={[styles.filterContainerView]}
              onPress={() => {
                setViewType(ViewType.LIST);
                onViewTypeChanged?.(ViewType.LIST);
              }}
              icon={() => (
                <Menu
                  stroke={
                    _viewType === ViewType.LIST
                      ? COLORS.theme?.primaryColor
                      : "#737373"
                  }
                />
              )}
            />

            <ClickableIcon
              containerStyle={[styles.filterContainerView]}
              onPress={() => {
                setViewType(ViewType.MAP);
                onViewTypeChanged?.(ViewType.MAP);
              }}
              icon={() => (
                <LocationMarkerBlack
                  stroke={
                    _viewType === ViewType.MAP
                      ? COLORS.theme?.primaryColor
                      : "#737373"
                  }
                />
              )}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default SearchScreenFilters;

const styles = StyleSheet.create({
  container: {
    // flexDirection: "row",
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
    borderColor: COLORS.theme?.interface["300"],
    // width: "100%",
    justifyContent: "space-between",
    // width: "100%",
    marginRight: SPACE.sm,
    marginLeft: SPACE.sm,
    marginTop: SPACE._2xs
  },
  filterIconStartContainer: {
    // // paddingStart: SPACE.xs,
    // // paddingEnd: SPACE._2xs,
    // height: 36,
    // justifyContent: "center"
  },
  filterIconEndContainer: {
    // // paddingStart: SPACE._2xs,
    // // paddingEnd: SPACE.xs,
    // height: 36,
    // justifyContent: "center"
  },
  keywordContainer: {
    height: 36,
    borderRadius: 32,
    backgroundColor: COLORS.theme?.interface["200"],
    flexGrow: 1,
    marginRight: SPACE.sm
  },
  typeContainer: {
    flexDirection: "row",
    height: 36,
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: COLORS.theme?.interface["200"],
    borderRadius: 100,
    borderWidth: 1,
    borderColor: COLORS.theme?.interface["300"],
    width: "45%"
    // marginLeft: SPACE.md
  },
  filtersContainer: {
    width: "25%",
    height: 40,
    alignItems: "center",
    justifyContent: "center"
  },
  leftHeader: {
    borderRadius: 20,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center"
  },
  filterContainerView: {
    backgroundColor: COLORS.theme?.interface["200"],
    borderRadius: 5,
    marginRight: SPACE.xs,
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center"
  }
});
