import React, { useCallback, useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import { COLORS, FONT_SIZE, SPACE } from "config";
import { BarMenu, barMenuTotalPrice, isBundleBogo } from "models/BarMenu";
import { FlatListWithPb } from "ui/components/organisms/flat_list/FlatListWithPb";
import DownArrow from "assets/images/ic_down_arrow.svg";
import UpArrow from "assets/images/ic_up_arrow.svg";
import { AppLog, Price, TAG } from "utils/Util";
import { Modifier, modifierTotalPrice } from "models/Modifier";
import EProductGroupType from "models/enums/EProductGroupType";
import { ItemSubMenu } from "./ItemSubMenu";
import { ItemBundleModifierWrapper } from "./ItemBundleModifierWrapper";

type Props = {
  menuItem: BarMenu;
  currencySymbol?: string;
};

const ItemOrderScreenDetails = React.memo<Props>(
  ({ menuItem, currencySymbol }) => {
    const [shouldShowSubMenu, setShouldShowSubMenu] = useState(false);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const listItem = useCallback(
      ({ item }: { item: BarMenu }) => {
        return (
          <ItemSubMenu menuItem={item} currencySymbol={currencySymbol} />
        );
      },
      [currencySymbol]
    );

    const listItemBundleModifier = useCallback(
      ({ item }: { item: BarMenu }) => {
        return (
          <ItemBundleModifierWrapper
            menuItem={item}
            currencySymbol={currencySymbol}
          />
        );
      },
      [currencySymbol]
    );

    const listModifierItem = useCallback(
      ({ item }: { item: Modifier }) => {
        return (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between"
            }}>
            <AppLabel
              text={`${item.quantity} x ${item.name}`}
              ellipsizeMode="tail"
              style={{
                fontSize: FONT_SIZE._3xs,
                color: COLORS.theme?.interface["700"],
                paddingEnd: SPACE.md,
                flex: 0.8
              }}
            />
            <AppLabel
              text={Price.toString(
                currencySymbol,
                modifierTotalPrice(item)
              )}
              style={{
                fontSize: FONT_SIZE._3xs,
                color: COLORS.theme?.interface["700"],
                flex: 0.2
              }}
            />
          </View>
        );
      },
      [currencySymbol]
    );

    AppLog.log(
      () =>
        "ItemOrderScreenDetails: " + JSON.stringify(menuItem?.modifiers),
      TAG.Order_Summary
    );

    return (
      <View style={styles.mainContainer}>
        <View style={styles.container}>
          <Image
            source={
              menuItem?.image
                ? { uri: menuItem.image! }
                : require("assets/images/cart_placeholder.png")
            }
            style={[
              styles.image,
              !menuItem?.image && {
                borderWidth: 1,
                borderColor: COLORS.theme?.interface[300]
              }
            ]}
          />
          <View style={styles.titleAndPriceContainer}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
              <AppLabel
                text={menuItem.name}
                style={{ paddingEnd: SPACE.xl }}
              />
              {((menuItem?.modifiers?.length ?? 0) > 0 ||
                (menuItem?.sub_menus?.length ?? 0) > 0 ||
                (menuItem?.items?.length ?? 0) > 0) && (
                <Pressable
                  style={{
                    padding: 10,
                    position: "absolute",
                    right: 0
                  }}
                  onPress={() => setShouldShowSubMenu(!shouldShowSubMenu)}>
                  {shouldShowSubMenu ? (
                    <UpArrow
                      width={10}
                      height={10}
                      stroke={COLORS.theme?.primaryShade["700"]}
                    />
                  ) : (
                    <DownArrow
                      width={10}
                      height={10}
                      fill={COLORS.theme?.primaryShade["700"]}
                    />
                  )}
                </Pressable>
              )}
            </View>

            {shouldShowSubMenu &&
              isBundleBogo(menuItem) &&
              (menuItem?.items?.length ?? 0) > 0 && (
                <FlatListWithPb
                  data={menuItem.items}
                  renderItem={listItemBundleModifier}
                  keyExtractor={(item: BarMenu) => item.id.toString()}
                  style={{ marginLeft: SPACE._2md }}
                />
              )}

            {shouldShowSubMenu &&
              (menuItem?.modifiers?.length ?? 0) > 0 && (
                <FlatListWithPb
                  data={menuItem.modifiers}
                  renderItem={listModifierItem}
                  keyExtractor={(item: Modifier) => item.id.toString()}
                  style={{ marginLeft: SPACE._2md }}
                />
              )}

            {/* Maybe some menus are not needed anymore , since bundle bogo come in funnel */}
            {/* {shouldShowSubMenu &&
              (menuItem?.sub_menus?.length ?? 0) > 0 && (
                <FlatListWithPb
                  data={menuItem.sub_menus}
                  renderItem={listItem}
                  keyExtractor={(item: BarMenu) => item.id.toString()}
                  style={{ marginLeft: SPACE._2md }}
                />
              )} */}

            <View style={styles.quantityAndPrice}>
              <AppLabel
                text={`${menuItem.quantity} x ${currencySymbol} ${(
                  menuItem.total / menuItem.quantity
                ).toFixed(2)}`}
                style={styles.quantity}
              />
              <AppLabel
                text={Price.toString(
                  currencySymbol,
                  barMenuTotalPrice(menuItem)
                )}
                textType={TEXT_TYPE.SEMI_BOLD}
                style={styles.price}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  mainContainer: { backgroundColor: COLORS.theme?.interface["100"] },
  container: { flexDirection: "row" },
  image: { width: 50, height: 50, borderRadius: 8 },
  titleAndPriceContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    flex: 1,
    paddingLeft: SPACE._2md
  },
  quantityAndPrice: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  quantity: {
    fontSize: FONT_SIZE._2xs,
    color: COLORS.theme?.interface["900"]
  },
  price: {
    fontSize: FONT_SIZE._2xs,
    color: COLORS.theme?.interface["900"]
  }
});

export default ItemOrderScreenDetails;
