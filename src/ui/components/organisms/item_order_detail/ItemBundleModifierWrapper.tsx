import { FONT_SIZE, COLORS, SPACE } from "config";
import { BarMenu } from "models/BarMenu";
import { Modifier } from "models/Modifier";
import React, { useCallback, useState } from "react";
import { View, Pressable, ScrollView } from "react-native";
import { AppLabel } from "ui/components/atoms/app_label/AppLabel";
import { FlatListWithPb } from "../flat_list/FlatListWithPb";
import DownArrow from "assets/images/ic_down_arrow.svg";
import UpArrow from "assets/images/ic_up_arrow.svg";
import uuid from "react-native-uuid";
import { ItemBundleSubModifier } from "./ItemBundleSubModifier";

type Props = {
  menuItem: BarMenu;
  currencySymbol?: string;
};

export const ItemBundleModifierWrapper = React.memo<Props>(
  ({ menuItem, currencySymbol }) => {
    const [_shouldShowSubMenu, _setShouldShowSubMenu] = useState(false);

    const listModifierWrapperItem = useCallback(
      ({ item, index }: { item: Modifier[]; index: number }) => {
        return (
          <ItemBundleSubModifier
            item={item}
            index={index}
            currencySymbol={currencySymbol}
          />
        );
      },
      [currencySymbol]
    );

    return (
      <ScrollView>
        <>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between"
            }}>
            <AppLabel
              text={`${menuItem.name} (${menuItem.quantity}x)`}
              style={{ fontSize: FONT_SIZE._3xs }}
            />
            {(menuItem?.modifier_details?.length ?? 0) > 0 && (
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
          {(menuItem?.modifier_details?.length ?? 0) > 0 &&
            _shouldShowSubMenu && (
              <View
                style={{
                  paddingStart: SPACE.md
                }}>
                <ScrollView
                  horizontal={true}
                  scrollEnabled={false}
                  contentContainerStyle={{ flex: 1 }}>
                  <FlatListWithPb
                    data={menuItem.modifier_details}
                    renderItem={listModifierWrapperItem}
                    style={{ flex: 1 }}
                    scrollEnabled={false}
                    keyExtractor={(item) =>
                      item?.id?.toString() ?? String(uuid.v4())
                    }
                    listKey={String(uuid.v4())}
                  />
                </ScrollView>
              </View>
            )}
        </>
      </ScrollView>
    );
  }
);
