import { View, StyleSheet } from "react-native";
import React, { useCallback } from "react";
import { FlatListWithPb } from "ui/components/organisms/flat_list/FlatListWithPb";
import Screen from "ui/components/atoms/Screen";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import { SPACE } from "config";
import Colors from "config/Colors";
import { data, RedemptionRules } from "./RedemptionData";
import { useAppSelector } from "hooks/redux";
import { RootState } from "stores/store";

export const RedemptionRulesView = () => {
  const { regionData } = useAppSelector(
    (state: RootState) => state.general
  );
  const listItem = useCallback(({ item }: { item: RedemptionRules }) => {
    return (
      <View style={styles.render}>
        <AppLabel text={"\u2022"} style={styles.bulletPoint} />

        <AppLabel
          text={item.rule}
          numberOfLines={10}
          style={styles.rule}
          textType={TEXT_TYPE.NORMAL}
        />
      </View>
    );
  }, []);
  return (
    <Screen style={{ flex: 1 }} requiresSafeArea={false}>
      <FlatListWithPb
        data={data(regionData)}
        renderItem={listItem}
        contentContainerStyle={styles.list}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  rule: {
    marginTop: SPACE._2xl,
    marginLeft: SPACE.lg,
    marginRight: SPACE.lg,
    color: Colors?.colors.theme?.interface[900],
    justifyContent: "center",
    paddingRight: SPACE.sm
  },
  list: {
    paddingBottom: SPACE.sm
  },
  bulletPoint: {
    marginTop: SPACE._2xl,
    marginLeft: SPACE.lg
  },
  render: {
    flexDirection: "row",
    marginLeft: SPACE.lg,
    marginRight: SPACE.lg
  }
});
