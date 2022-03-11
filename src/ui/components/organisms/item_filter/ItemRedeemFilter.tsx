import { COLORS, FONT_SIZE, SPACE } from "config";
import React from "react";
import { StyleSheet, View } from "react-native";
import { AppLabel } from "ui/components/atoms/app_label/AppLabel";
import { RedeemFilter } from "models/RedeemFilter";

type Props = {
  filter: RedeemFilter;
  onPress?: (filter: RedeemFilter) => void;
  isSelected?: boolean;
};

const ItemRedeemFilter = React.memo<Props>(({ filter, isSelected }) => {
  const getBorderRadius = () => {
    if (filter.id === "All") {
      return styles.firstItem;
    } else if (filter.id === "Limited") {
      return styles.lastItem;
    }
  };
  return (
    <>
      <View style={[styles.container, getBorderRadius()]}>
        <View style={[styles.rowContainer, getBorderRadius()]}>
          <View style={styles.left}>
            {filter.icon?.(undefined, 25, 25)}
            <AppLabel
              text={filter.label}
              style={{ paddingLeft: SPACE._2md }}
            />
          </View>
          <View style={styles.radioOuterCicle}>
            <View style={isSelected ? styles.radioInnerCircle : null} />
          </View>
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
    padding: SPACE._2lg,
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
  radioOuterCicle: {
    width: 20,
    height: 20,
    borderRadius: 20,
    borderColor: COLORS.theme?.borderColor,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white
  },
  radioInnerCircle: {
    width: 10,
    height: 10,
    borderRadius: 8,
    backgroundColor: COLORS.theme?.primaryColor
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

export default ItemRedeemFilter;
