import {
  RouteProp,
  useNavigation,
  useRoute
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAppDispatch, useAppSelector } from "hooks/redux";
import useEffectWithSkipFirstTime from "hooks/useEffectWithSkipFirstTime";
import ESearchType from "models/enums/ESearchType";
import SearchParams from "models/SearchParams";
import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import { HomeStackParamList } from "routes/HomeStack";
import { SearchStackParamList } from "routes/SearchStack";
import { setSelectedSearchTab } from "stores/generalSlice";
import { RootState } from "stores/store";
import { ViewType } from "ui/components/organisms/search_filter/SearchFilter";
import { AppLog, TAG } from "utils/Util";
import SearchView from "./SearchView";

type SearchScreenProps = RouteProp<HomeStackParamList, "Search">;
type SearchNavigationProp = StackNavigationProp<SearchStackParamList>;

type Props = {};

const SearchController: React.FC = ({}: Props) => {
  const navigation = useNavigation<SearchNavigationProp>();
  const route = useRoute<SearchScreenProps>();
  let viewType: MutableRefObject<ViewType> = useRef(ViewType.LIST);
  const dispatch = useAppDispatch();
  const [_searchParams, setSearchParams] = useState<SearchParams>(
    route.params.searchParams
  );
  const [_searchType, setSearchType] = useState<ESearchType>(
    ESearchType.VENUE
  );
  const { selectedSearchTab } = useAppSelector(
    (state: RootState) => state.general
  );

  const onTabSelected = useCallback((searchType: ESearchType) => {
    AppLog.log(
      () => "searchType: " + JSON.stringify(searchType),
      TAG.SEARCH
    );
    dispatch(setSelectedSearchTab(searchType));
    setSearchType(searchType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearchParamsChange = useCallback(
    (searchParams: SearchParams) => {
      AppLog.log(
        () => "onSearchParamsChange: " + JSON.stringify(searchParams),
        TAG.SEARCH
      );
      setSearchParams({ ...searchParams });
    },
    []
  );

  const getspecificScreenToNavigate = useCallback(
    (searchType: ESearchType) => {
      switch (searchType) {
        case ESearchType.VENUE:
          navigation.replace("VenueSearch", {
            type: searchType,
            searchParams: _searchParams
          });
          break;
        case ESearchType.OAPA:
          navigation.replace("VenueSearch", {
            type: searchType,
            searchParams: _searchParams
          });
          break;
        case ESearchType.OFFER:
          navigation.replace("VenueSearch", {
            type: searchType,
            searchParams: _searchParams
          });
          break;
        case ESearchType.TAKE_AWAY_DELIVERY:
          navigation.replace("MenuSearch", {
            type: searchType,
            searchParams: _searchParams
          });
          break;
        case ESearchType.EVENTS:
          navigation.replace("Events", {
            type: searchType,
            searchParams: _searchParams
          });
          break;
        default:
          break;
      }
    },
    [navigation, _searchParams]
  );
  useEffect(() => {
    if (viewType.current === ViewType.MAP) {
      navigation.navigate("Map", {
        type: _searchType,
        searchParams: _searchParams
      });

      AppLog.log(
        () =>
          "getspecificScreenToNavigate if: " + JSON.stringify(_searchType),
        TAG.SEARCH
      );
    } else {
      AppLog.log(
        () =>
          "getspecificScreenToNavigate _searchType: " +
          JSON.stringify(_searchType),
        TAG.SEARCH
      );

      AppLog.log(
        () =>
          "getspecificScreenToNavigate _searchParams: " +
          JSON.stringify(_searchParams),
        TAG.SEARCH
      );
      getspecificScreenToNavigate(_searchType);
    }
  }, [
    _searchType,
    navigation,
    _searchParams,
    getspecificScreenToNavigate
  ]);

  const openListingOrMapScreen = useCallback(
    (type: ViewType) => {
      viewType.current = type;
      if (type === ViewType.MAP) {
        navigation.navigate("Map", {
          type: _searchType,
          searchParams: _searchParams
        });
      } else {
        getspecificScreenToNavigate(_searchType);
      }
    },
    [_searchParams, _searchType, getspecificScreenToNavigate, navigation]
  );

  useEffect(() => {
    dispatch(setSelectedSearchTab(ESearchType.VENUE));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffectWithSkipFirstTime(() => {
    setSearchType(selectedSearchTab);
  }, [selectedSearchTab]);

  return (
    <SearchView
      searchParams={{ ..._searchParams }}
      searchType={_searchType}
      onTabSelected={onTabSelected}
      onSearchParamsChange={onSearchParamsChange}
      selectedIds={[_searchType]}
      openListingOrMapScreen={openListingOrMapScreen}
    />
  );
};

export default SearchController;
