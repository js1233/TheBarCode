import { COLORS, FONT_SIZE, SPACE } from "config";
import { usePreferredTheme } from "hooks";
import { OrderStatusItem } from "models/OrderStatusItem";
import React, { FC, useRef } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import BottomSheet from "reanimated-bottom-sheet";
import { AppLabel } from "ui/components/atoms/app_label/AppLabel";
import Separator from "ui/components/atoms/separator/Separator";

type Props = {
  isVisible: Boolean;
  onItemClicked: (item: OrderStatusItem) => void;
  items: OrderStatusItem[];
  onClosed?: (isClose: boolean) => void;
};

const AppBottomSheet: FC<Props> = ({
  isVisible,
  onItemClicked,
  items,
  onClosed
}) => {
  const { themedColors } = usePreferredTheme();
  const orderStatusRef = useRef<any>();

  const renderContent = () => (
    <View
      style={[
        styles.sheetContainer,
        {
          backgroundColor: themedColors.secondaryBackground
        }
      ]}>
      {items.map((status) => {
        return (
          <>
            <TouchableOpacity
              style={[styles.option]}
              onPress={() => onItemClicked(status)}>
              <AppLabel style={[styles.optionText]} text={status.value!} />
            </TouchableOpacity>
            <Separator color={COLORS.black} />
            <View style={[styles.statusOptionBottomHeight]} />
          </>
        );
      })}
    </View>
  );

  const snapPoints =
    items.length === 1
      ? [60, 0]
      : items.length === 2
      ? [110, 0]
      : items.length === 3
      ? [150, 160, 0]
      : [210, 150, 0, 0];

  return (
    <>
      {isVisible && (
        <BottomSheet
          ref={orderStatusRef}
          snapPoints={snapPoints}
          borderRadius={10}
          renderContent={renderContent}
          onCloseEnd={() => onClosed?.(true)}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    padding: 16,
    height: "100%"
  },
  option: {
    height: 40,
    justifyContent: "center",
    alignItems: "center"
  },
  optionText: {
    color: COLORS.blue2,
    fontSize: FONT_SIZE.lg,
    marginBottom: SPACE.sm,
    textTransform: "capitalize"
  },
  statusOptionBottomHeight: {
    height: 10
  }
});

export default AppBottomSheet;
