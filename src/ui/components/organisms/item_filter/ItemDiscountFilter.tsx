import { COLORS, FONT_SIZE, SPACE } from "config";
import { DiscountFilter } from "models/DiscountFilter";
import React from "react";
import { StyleSheet, View } from "react-native";
import { AppLabel } from "ui/components/atoms/app_label/AppLabel";
import CheckBox from "react-native-check-box";
import Checked from "assets/images/checkedButton.svg";
import UnChecked from "assets/images/unChecked.svg";

type Props = {
  filter: DiscountFilter;
  onPress?: (filter: DiscountFilter) => void;
  isSelected?: boolean;
};

const ItemDiscountFilter = React.memo<Props>(({ filter, isSelected }) => {
  const getBorderRadius = () => {
    if (filter.id === 1) {
      return styles.firstItem;
    } else if (filter.id === 3) {
      return styles.lastItem;
    }
  };
  return (
    <>
      <View style={[styles.container, getBorderRadius()]}>
        <View style={[styles.rowContainer, getBorderRadius()]}>
          <View style={styles.left}>
            {filter.icon?.(undefined, 35, 35)}
            <AppLabel
              text={filter.label}
              style={{ paddingLeft: SPACE._2xs }}
            />
          </View>
          <CheckBox
            checkedImage={
              <Checked
                width={18}
                height={18}
                stroke={COLORS.theme?.primaryColor}
              />
            }
            unCheckedImage={<UnChecked width={18} height={18} />}
            isChecked={isSelected!}
            onClick={() => {}}
          />
        </View>
      </View>
      <View style={{ height: 1, backgroundColor: COLORS.white }} />
    </>
  );
});

export const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: "column",
    paddingRight: SPACE._2lg,
    paddingLeft: SPACE.sm,
    paddingTop: SPACE._2lg,
    paddingBottom: SPACE._2lg,
    backgroundColor: COLORS.theme?.interface["100"]
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 35
  },
  name: {
    fontSize: FONT_SIZE.sm
  },
  email: {
    fontSize: FONT_SIZE._3xs
  },
  left: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  firstItem: {
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10
  },
  lastItem: {
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10
  }
});

export default ItemDiscountFilter;
