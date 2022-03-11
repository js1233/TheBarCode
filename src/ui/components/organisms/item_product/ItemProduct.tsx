import React, { useCallback, useContext, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle
} from "react-native";
import { usePreferredTheme } from "hooks";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import Product, { haveSubItems } from "models/Product";
import RightArrow from "assets/images/ic_right_arrow.svg";
import DownArrow from "assets/images/ic_down_arrow.svg";
import { FONT_SIZE, SPACE } from "config";
import { AppDataContext } from "repo/AppDataProvider";
import { Price } from "utils/Util";
import EProductGroupType from "models/enums/EProductGroupType";
import ProductModifier from "models/ProductModifier";
import ItemProductModifier from "ui/components/organisms/item_modifier/ItemProductModifier";

interface Props {
  containerStyle?: StyleProp<ViewStyle>;
  product: Product;
}

const ItemProduct: React.FC<Props> = ({
  containerStyle,
  product
}: Props) => {
  const { themedColors } = usePreferredTheme();

  const { venue } = useContext(AppDataContext);

  const [isExpanded, setExpanded] = useState<boolean>(false);

  const expandableImage = useCallback(() => {
    return haveSubItems(product) ? (
      isExpanded ? (
        <DownArrow
          width={10}
          height={10}
          fill={themedColors.interface["900"]}
          style={styles.arrow}
        />
      ) : (
        <RightArrow
          width={10}
          height={10}
          fill={themedColors.interface["900"]}
          style={styles.arrow}
        />
      )
    ) : null;
  }, [isExpanded, product, themedColors]);

  const onNamePressed = useCallback(
    () => setExpanded(!isExpanded),
    [isExpanded, setExpanded]
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <Pressable style={styles.nameContainer} onPress={onNamePressed}>
        {expandableImage()}
        <AppLabel
          style={[styles.name]}
          text={`${product.quantity ? `${product.quantity} x ` : ""}${
            product.name
          }`}
          textType={TEXT_TYPE.BOLD}
        />
        {product.price && (
          <AppLabel
            style={styles.price}
            text={Price.toString(
              venue?.region.currency_symbol,
              product.total_item_price
            )}
            textType={TEXT_TYPE.BOLD}
          />
        )}
      </Pressable>
      {product.group_type !== EProductGroupType.SINGLE &&
        product.sub_menus &&
        isExpanded && (
          <FlatList<Product>
            style={[styles.sublist, styles.subMenu]}
            data={product.sub_menus}
            renderItem={({ item }) => <ItemProduct product={item} />}
            ItemSeparatorComponent={() => (
              <View style={styles.itemSeparator} />
            )}
          />
        )}
      {product.modifiers && isExpanded && (
        <FlatList<ProductModifier>
          style={styles.sublist}
          data={product.modifiers}
          renderItem={({ item }) => (
            <ItemProductModifier productModifier={item} />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  nameContainer: { flexDirection: "row", alignItems: "center" },
  name: { fontSize: FONT_SIZE._2xs, flexGrow: 1 },
  arrow: { marginEnd: SPACE._2xs },
  price: { fontSize: FONT_SIZE._2xs },
  sublist: { marginStart: SPACE.md },
  itemSeparator: { height: SPACE._2md },
  subMenu: { marginTop: SPACE._2xs }
});

export default ItemProduct;
