import { FONT_SIZE, COLORS, SPACE } from "config";
import { BarMenu } from "models/BarMenu";
import { Modifier, modifierTotalPrice } from "models/Modifier";
import React, { useCallback, useState } from "react";
import { View, Pressable, ScrollView } from "react-native";
import { AppLabel } from "ui/components/atoms/app_label/AppLabel";
import { Price } from "utils/Util";
import { FlatListWithPb } from "../flat_list/FlatListWithPb";
import DownArrow from "assets/images/ic_down_arrow.svg";
import UpArrow from "assets/images/ic_up_arrow.svg";
import uuid from "react-native-uuid";

type Props = {
  menuItem: BarMenu;
  currencySymbol?: string;
};

export const ItemSubMenu = React.memo<Props>(
  ({ menuItem, currencySymbol }) => {
    const [_shouldShowSubMenu, _setShouldShowSubMenu] = useState(false);

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
                color: COLORS.theme?.interface["500"],
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
                color: COLORS.theme?.interface["500"],
                flex: 0.2
              }}
            />
          </View>
        );
      },
      [currencySymbol]
    );

    return (
      <>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between"
          }}>
          <AppLabel
            text={`${menuItem.name}`}
            style={{ fontSize: FONT_SIZE._3xs }}
          />
          {(menuItem?.modifiers?.length ?? 0) > 0 && (
            <Pressable
              style={{
                paddingEnd: 10,
                paddingVertical: 5,
                position: "absolute",
                right: 0,
                top: 0
              }}
              onPress={() => _setShouldShowSubMenu(!_shouldShowSubMenu)}>
              {_shouldShowSubMenu ? (
                <UpArrow
                  width={10}
                  height={10}
                  stroke={COLORS.theme?.primaryShade["700"]}
                  style={{ bottom: 5 }}
                />
              ) : (
                <DownArrow
                  width={10}
                  height={10}
                  fill={COLORS.theme?.primaryShade["700"]}
                  style={{ bottom: 5 }}
                />
              )}
            </Pressable>
          )}
        </View>
        {(menuItem?.modifiers?.length ?? 0) > 0 && _shouldShowSubMenu && (
          <View
            style={{
              paddingStart: SPACE.md
            }}>
            <ScrollView
              horizontal={true}
              scrollEnabled={false}
              contentContainerStyle={{ flex: 1 }}>
              <FlatListWithPb
                data={menuItem.modifiers}
                renderItem={listModifierItem}
                style={{ flex: 1 }}
                scrollEnabled={false}
                listKey={String(uuid.v4())}
              />
            </ScrollView>
          </View>
        )}
        {/* </ScrollView> */}
      </>
    );
  }
);
