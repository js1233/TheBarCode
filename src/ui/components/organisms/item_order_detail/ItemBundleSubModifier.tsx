import { FONT_SIZE, COLORS, SPACE } from "config";
import { Modifier, modifierTotalPrice } from "models/Modifier";
import React, { useCallback, useState } from "react";
import { View, Pressable, ScrollView } from "react-native";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import { Price } from "utils/Util";
import { FlatListWithPb } from "../flat_list/FlatListWithPb";
import DownArrow from "assets/images/ic_down_arrow.svg";
import UpArrow from "assets/images/ic_up_arrow.svg";
import uuid from "react-native-uuid";

type Props = {
  item: Modifier[];
  index: number;
  currencySymbol?: string;
};

export const ItemBundleSubModifier = React.memo<Props>(
  ({ item, currencySymbol, index }) => {
    const [_shouldShowSubMenu, _setShouldShowSubMenu] = useState(false);

    const listModifierItem = useCallback(
      // eslint-disable-next-line @typescript-eslint/no-shadow
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
      <ScrollView>
        <>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between"
            }}>
            <AppLabel
              text={`Modifier ${index + 1}`}
              style={{ fontSize: FONT_SIZE._3xs }}
              textType={TEXT_TYPE.SEMI_BOLD}
            />
            {(item?.length ?? 0) > 0 && (
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
                    stroke={COLORS.black}
                    style={{ bottom: 5 }}
                  />
                ) : (
                  <DownArrow
                    width={10}
                    height={10}
                    fill={COLORS.black}
                    style={{ bottom: 5 }}
                  />
                )}
              </Pressable>
            )}
          </View>
          {(item?.length ?? 0) > 0 && _shouldShowSubMenu && (
            <View
              style={{
                paddingStart: SPACE.md
              }}>
              <ScrollView
                horizontal={true}
                scrollEnabled={false}
                contentContainerStyle={{ flex: 1 }}>
                <FlatListWithPb
                  data={item}
                  renderItem={listModifierItem}
                  style={{ flex: 1 }}
                  scrollEnabled={false}
                  keyExtractor={(_item) =>
                    _item?.id?.toString() ?? String(uuid.v4())
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
