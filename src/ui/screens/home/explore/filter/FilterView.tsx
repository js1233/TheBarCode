import Strings from "config/Strings";
import { DiscountFilter } from "models/DiscountFilter";

import { RedeemFilter } from "models/RedeemFilter";
import React, { FC, useCallback } from "react";
import { StyleSheet } from "react-native";

import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import Screen from "ui/components/atoms/Screen";
import ItemRedeemFilter from "ui/components/organisms/item_filter/ItemRedeemFilter";
import MultiSelectList, {
  SELECTION_TYPE
} from "ui/components/organisms/multi_select_list/MultiSelectList";
import ItemDiscountFilter from "ui/components/organisms/item_filter/ItemDiscountFilter";

import { COLORS, FONT_SIZE, SPACE } from "config";

type Props = {
  redeemTypes: RedeemFilter[];
  discountTypes: DiscountFilter[];
  selectedOfferIds: number[];
  offerRedeemtionFilter: string[];
  onOfferSelectionChange: (selectedIds: number[]) => void;
  onRedeemtionSelectionChange: (offerRedeemtionFilter: string[]) => void;
};

export const FilterView: FC<Props> = ({
  redeemTypes,
  discountTypes,
  selectedOfferIds,
  offerRedeemtionFilter,
  onOfferSelectionChange,
  onRedeemtionSelectionChange
}) => {
  const renderDiscountItem = useCallback((isSelected, item) => {
    return <ItemDiscountFilter filter={item} isSelected={isSelected} />;
  }, []);
  const renderRedeemItem = useCallback((isSelected, item) => {
    return <ItemRedeemFilter filter={item} isSelected={isSelected} />;
  }, []);
  return (
    <>
      <Screen style={styles.container}>
        <AppLabel
          text={Strings.filter.member_discount}
          style={styles.memberDiscount}
          textType={TEXT_TYPE.BOLD}
        />
        <MultiSelectList<DiscountFilter>
          bounces={false}
          itemView={renderDiscountItem}
          selectedIds={selectedOfferIds}
          onSelectionChange={onOfferSelectionChange}
          data={discountTypes}
          keyExtractor={(item) => item.id.toString()}
          containerStyle={styles.list}
          itemContainerStyle={styles.itemContainerStyle}
        />
        <AppLabel
          text={Strings.filter.redeeming_types}
          style={styles.memberDiscount}
          textType={TEXT_TYPE.BOLD}
        />
        <MultiSelectList<RedeemFilter>
          bounces={false}
          itemView={renderRedeemItem}
          selectedIds={offerRedeemtionFilter}
          onSelectionChange={onRedeemtionSelectionChange}
          data={redeemTypes}
          selectionType={SELECTION_TYPE.SINGLE}
          keyExtractor={(item) => item.value.toString()}
          containerStyle={styles.list}
          itemContainerStyle={styles.itemContainerStyle}
        />
      </Screen>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACE.lg,
    backgroundColor: COLORS.white
  },
  scrollViewContent: {
    flexGrow: 1,
    flexDirection: "column"
  },
  memberDiscount: {
    fontSize: FONT_SIZE.lg,
    paddingTop: SPACE._2xl
  },
  list: { height: "auto", marginTop: SPACE.sm },
  itemContainerStyle: {
    width: "100%"
  }
});
