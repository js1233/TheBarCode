import { COLORS, FONT_SIZE, SPACE } from "config";
import Colors from "config/Colors";
import React from "react";
import { StyleSheet, View } from "react-native";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import Screen from "ui/components/atoms/Screen";
import SectionedList from "ui/components/organisms/sectioned_list/SectionedList";
import { useAppSelector } from "hooks/redux";
import { RootState } from "stores/store";
import ChevronDownIcon from "assets/images/chevron-down.svg";
import ChevronUpIcon from "assets/images/chevron-up.svg";
import { BodyModel, HeaderModel, faqsData } from "./FaqsData";

export const FaqsView = () => {
  const { regionData } = useAppSelector(
    (state: RootState) => state.general
  );

  return (
    <Screen style={{ flex: 1 }} requiresSafeArea={false}>
      <SectionedList
        list={faqsData(regionData)}
        selectedIndexProp={0}
        style={styles.list}
        stickyHeaderEnabled={false}
        bodyView={(bodyItem: BodyModel) => (
          <>
            <View style={styles.bodyView}>
              <AppLabel
                text={bodyItem.answer}
                style={styles.containerText}
                textType={TEXT_TYPE.NORMAL}
                numberOfLines={10}
              />
            </View>
          </>
        )}
        headerView={(header: HeaderModel, isSelected: boolean) => (
          <View
            style={
              isSelected === true
                ? styles.selectedHeaderItem
                : styles.headerItem
            }>
            <AppLabel
              text={header.question}
              style={styles.textStyle}
              textType={TEXT_TYPE.SEMI_BOLD}
              numberOfLines={0}
            />
            {isSelected === true ? (
              <ChevronUpIcon
                width={24}
                height={24}
                testID={"right-icon"}
                style={styles.iconStyle}
                fill={COLORS.theme?.primaryShade["700"]}
              />
            ) : (
              <ChevronDownIcon
                width={24}
                height={24}
                style={styles.iconStyle}
                testID={"right-icon"}
                fill={COLORS.theme?.interface["500"]}
              />
            )}
          </View>
        )}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  containerHeading: {
    marginTop: SPACE._2md,
    marginLeft: SPACE.md
  },
  containerText: {
    marginLeft: SPACE.lg,
    marginRight: SPACE.md,
    paddingBottom: SPACE._2md,
    alignItems: "flex-start"
  },
  list: {
    paddingTop: SPACE._2xl
  },
  bodyView: {
    backgroundColor: Colors.colors.theme?.interface[200],
    borderBottomStartRadius: 8,
    borderBottomEndRadius: 8,
    marginLeft: SPACE.lg,
    marginRight: SPACE.lg
  },
  textStyle: {
    marginLeft: SPACE.md,
    marginTop: SPACE._2md,
    marginBottom: SPACE._2md,
    color: Colors.colors.theme?.interface[700],
    fontSize: FONT_SIZE._2xs,
    flex: 1
  },
  headerItem: {
    flexDirection: "row",
    backgroundColor: Colors.colors.theme?.interface[200],
    borderRadius: 8,
    marginLeft: SPACE.lg,
    marginRight: SPACE.lg,
    justifyContent: "space-between"
  },
  selectedHeaderItem: {
    flexDirection: "row",
    backgroundColor: Colors.colors.theme?.interface[200],
    borderTopStartRadius: 8,
    borderTopEndRadius: 8,
    marginLeft: SPACE.lg,
    marginRight: SPACE.lg,
    justifyContent: "space-between"
  },
  iconStyle: {
    marginTop: SPACE._2md,
    marginBottom: SPACE._2md,
    marginRight: SPACE.lg,
    fontSize: FONT_SIZE._2xs
  }
});
