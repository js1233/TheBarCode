import {
  RouteProp,
  useNavigation,
  useRoute
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { COLORS, FONT_SIZE, SPACE } from "config";
import Cross from "assets/images/ic_cross.svg";
import Strings from "config/Strings";
import React, {
  FC,
  MutableRefObject,
  useCallback,
  useLayoutEffect,
  useRef
} from "react";
import { Pressable, StyleSheet } from "react-native";
import { HomeStackParamList } from "routes/HomeStack";
import HeaderTitle from "ui/components/headers/header_title/HeaderTitle";
import { AppLog, shadowStyleProps, TAG } from "utils/Util";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import { FilterView } from "./FilterView";
import { DiscountFilter } from "models/DiscountFilter";
import { Color, NumberProp } from "react-native-svg";
import { RedeemFilter } from "models/RedeemFilter";
import Discount10 from "assets/images/10Discount.svg";
import Discount15 from "assets/images/15Discount.svg";
import Discount25 from "assets/images/25Discount.svg";
import RedeemAll from "assets/images/redeemAll.svg";
import RedeemInfinity from "assets/images/redeemInfinity.svg";
import RedeemLimited from "assets/images/redeemLimited.svg";
import { useAppDispatch, useAppSelector } from "hooks/redux";
import { setRedeemType, setStandardOfferIds } from "stores/generalSlice";
import { RootState } from "stores/store";

type FilterNavigationProp = StackNavigationProp<
  HomeStackParamList,
  "Filter"
>;

type FilterRouteProp = RouteProp<HomeStackParamList, "Filter">;

type Props = {};

export const redeemTypes: RedeemFilter[] = [
  {
    id: "All",
    value: "All",
    label: "All",
    icon: (color?: Color, width?: NumberProp, height?: NumberProp) => (
      <RedeemAll fill={color} width={width} height={height} />
    )
  },
  {
    id: "Unlimited",
    value: "Unlimited",
    label: "Unlimited",
    icon: (color?: Color, width?: NumberProp, height?: NumberProp) => (
      <RedeemInfinity fill={color} width={width} height={height} />
    )
  },
  {
    id: "Standard",
    value: "Standard",
    label: "Standard",
    icon: (color?: Color, width?: NumberProp, height?: NumberProp) => (
      <RedeemLimited fill={color} width={width} height={height} />
    )
  }
];

const FilterController: FC<Props> = ({}) => {
  const route = useRoute<FilterRouteProp>();
  const navigation = useNavigation<FilterNavigationProp>();
  const { standardOfferIds, redeemType } = useAppSelector(
    (state: RootState) => state.general
  );
  let _selectedOfferIds: MutableRefObject<number[]> = useRef(
    standardOfferIds ?? []
  );
  let offerRedeemtionFilter: MutableRefObject<string[]> = useRef(
    [redeemType] ?? ["All"]
  );
  const dispatch = useAppDispatch();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        borderBottomColor: COLORS.theme?.borderColor,
        borderBottomWidth: 1,
        ...shadowStyleProps
      },
      headerTitleAlign: "center",
      headerTitle: () => <HeaderTitle text={Strings.filter.title} />,
      headerLeft: () => (
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.leftHeader}>
          <Cross fill={COLORS.theme?.interface[500]} />
        </Pressable>
      ),
      headerRight: () => (
        <>
          <AppLabel
            textType={TEXT_TYPE.SEMI_BOLD}
            text="Done"
            style={styles.rightHeader}
            onPress={() => {
              dispatch(setStandardOfferIds(_selectedOfferIds.current));
              dispatch(setRedeemType(offerRedeemtionFilter.current[0]));
              route.params.onFiltersSelected(
                _selectedOfferIds.current,
                offerRedeemtionFilter.current
              );
              navigation.goBack();
            }}
          />
        </>
      )
    });
  }, [navigation, route.params, dispatch]);

  const discountTypes: DiscountFilter[] = [
    {
      id: 1,
      value: "10% Discount",
      label: "10% Discount",
      icon: (color?: Color, width?: NumberProp, height?: NumberProp) => (
        <Discount10 fill={color} width={width} height={height} />
      )
    },
    {
      id: 2,
      value: "15% Discount",
      label: "15% Discount",
      icon: (color?: Color, width?: NumberProp, height?: NumberProp) => (
        <Discount15 fill={color} width={width} height={height} />
      )
    },
    {
      id: 3,
      value: "25% Discount",
      label: "25% Discount",
      icon: (color?: Color, width?: NumberProp, height?: NumberProp) => (
        <Discount25 fill={color} width={width} height={height} />
      )
    }
  ];

  const onOfferSelectionChange = useCallback((selectedIds: number[]) => {
    _selectedOfferIds.current = selectedIds;
    AppLog.log(
      () => "onOfferSelectionChange: " + JSON.stringify(selectedIds),
      TAG.COMPONENT
    );
  }, []);

  const onRedeemtionSelectionChange = useCallback(
    (_offerRedeemtionFilter: string[]) => {
      offerRedeemtionFilter.current = _offerRedeemtionFilter;
      AppLog.log(
        () =>
          "onRedeemtionSelectionChange: " + offerRedeemtionFilter.current,
        TAG.COMPONENT
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <FilterView
      redeemTypes={redeemTypes}
      discountTypes={discountTypes}
      selectedOfferIds={_selectedOfferIds.current}
      offerRedeemtionFilter={offerRedeemtionFilter.current}
      onOfferSelectionChange={onOfferSelectionChange}
      onRedeemtionSelectionChange={onRedeemtionSelectionChange}
    />
  );
};

export default FilterController;

const styles = StyleSheet.create({
  leftHeader: {
    marginLeft: SPACE.lg
  },
  rightHeader: {
    marginRight: SPACE.lg,
    fontSize: FONT_SIZE.lg,
    color: COLORS.theme?.primaryColor
  }
});
