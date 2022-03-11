import { FONT_SIZE } from "config";
import { usePreferredTheme } from "hooks";
import ProductModifier from "models/ProductModifier";
import React, { useContext } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { AppDataContext } from "repo/AppDataProvider";
import { AppLabel } from "ui/components/atoms/app_label/AppLabel";
import { Price } from "utils/Util";

interface Props {
  containerStyle?: StyleProp<ViewStyle>;
  productModifier: ProductModifier;
}

const ItemProductModifier: React.FC<Props> = ({
  containerStyle,
  productModifier
}: Props) => {
  const { themedColors } = usePreferredTheme();

  const { venue } = useContext(AppDataContext);

  return (
    <View style={[styles.container, containerStyle]}>
      <AppLabel
        style={[styles.name, { color: themedColors.interface["700"] }]}
        text={`${productModifier.quantity} x ${productModifier.name}`}
      />
      {productModifier.price !== null && (
        <AppLabel
          style={[styles.price, { color: themedColors.interface["700"] }]}
          text={Price.toString(
            venue?.region.currency_symbol,
            productModifier.price
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center" },
  name: { fontSize: FONT_SIZE._2xs, flexGrow: 1 },
  price: { fontSize: FONT_SIZE._2xs }
});

export default ItemProductModifier;
