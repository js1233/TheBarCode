import { COLORS, FONT_SIZE, SPACE } from "config";
import React from "react";
import { StyleSheet } from "react-native";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import { isOrderPending } from "models/enums/EOrderStatus";
import { Order } from "models/Order";

export const OrderHeader = React.memo(
  ({
    item,
    setSharedDataRef: sharedDataRef
  }: {
    item: Order;
    setSharedDataRef: React.MutableRefObject<string>;
  }) => {
    function skipIfTagIsSameAsPrevious(label: string, tag: string) {
      if (sharedDataRef.current === tag) {
        return undefined;
      }
      sharedDataRef.current = tag;
      return label;
    }
    const getLabel = () => {
      let tag = "2";
      if (isOrderPending(item)) {
        tag = "1";
        return skipIfTagIsSameAsPrevious("Ongoing Orders", tag);
      } else {
        return skipIfTagIsSameAsPrevious("Completed / Rejected", tag);
      }
    };

    let label = getLabel();
    if (label === undefined) {
      return null;
    }

    return (
      <AppLabel
        text={label}
        textType={TEXT_TYPE.BOLD}
        style={[styles.header, { color: COLORS.theme?.interface[900] }]}
      />
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    fontSize: FONT_SIZE._2xs,
    marginTop: SPACE._2xl
  }
});
