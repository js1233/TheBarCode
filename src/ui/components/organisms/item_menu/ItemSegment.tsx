import { COLORS, FONT_SIZE, SPACE } from "config";
import React, { FC, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import { BarMenu } from "models/BarMenu";
import { MenuSegment } from "models/api_responses/GetSegmentResponseModel";
import { FlatListWithPb } from "ui/components/organisms/flat_list/FlatListWithPb";
import ItemMenu from "ui/components/organisms/item_menu/ItemMenu";
import ChevronDownIcon from "assets/images/chevron-down.svg";
import ChevronUpIcon from "assets/images/chevron-up.svg";
import ESupportedOrderType from "models/enums/ESupportedOrderType";
import { Venue } from "models/Venue";
import uuid from "react-native-uuid";
import { AddToCartResponseModel } from "models/api_responses/AddToCartResponseModel";

type Props = {
  data: MenuSegment;
  menuType: ESupportedOrderType;
  venue: Venue | undefined;
  onBasicBogoClick: (
    bogo: BarMenu,
    dataBody: AddToCartResponseModel
  ) => void;
};

const ItemSegment: FC<Props> = ({
  data,
  menuType,
  venue,
  onBasicBogoClick
}) => {
  const [isSelected, setSelected] = useState<boolean>(true);

  return (
    <Pressable>
      <View style={styles.root}>
        <Pressable onPress={() => setSelected((prev) => !prev)}>
          <View style={styles.chevronContainer}>
            <AppLabel
              text={data?.name}
              textType={TEXT_TYPE.SEMI_BOLD}
              style={styles.chevronLabel}
            />

            {isSelected ? (
              <ChevronDownIcon stroke={COLORS.theme?.primaryColor} />
            ) : (
              <ChevronUpIcon stroke={COLORS.theme?.interface["500"]} />
            )}
          </View>
        </Pressable>

        {isSelected && (
          <>
            {data.description && (
              <AppLabel
                text={data.description}
                numberOfLines={0}
                style={styles.segmentDesc}
              />
            )}
            <FlatListWithPb
              data={data.items}
              keyExtractor={(item) =>
                (item?.id ?? String(uuid.v4())).toString()
              }
              renderItem={({
                item,
                index
              }: {
                item: BarMenu;
                index: number;
              }) => (
                <ItemMenu
                  menu={item}
                  menuType={menuType}
                  _venue={venue!}
                  onBasicBogoClick={onBasicBogoClick}
                  containerStyle={
                    data?.items?.length - 1 === index
                      ? styles.lastBody
                      : null
                  }
                />
              )}
            />
          </>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  root: {
    marginBottom: SPACE.md,
    backgroundColor: COLORS.theme?.interface["100"],
    borderRadius: 7
  },
  container: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: SPACE.md,
    paddingBottom: SPACE.lg
  },
  chevronContainer: {
    flex: 1,
    paddingVertical: SPACE.md,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: SPACE.md
  },
  chevronLabel: {
    textTransform: "uppercase",
    color: COLORS.theme?.interface["700"],
    fontSize: FONT_SIZE._3xs
  },
  imageStyle: {
    width: 55,
    height: 55,
    borderRadius: 8,
    resizeMode: "cover"
  },
  rightContainer: {
    flex: 1,
    paddingHorizontal: SPACE._2md
  },
  heading: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.theme?.interface["900"]
  },
  cartContainer: {
    flexDirection: "row",
    marginTop: SPACE.sm,
    alignItems: "center",
    alignContent: "center",
    alignSelf: "flex-start",
    paddingHorizontal: SPACE.md,
    paddingVertical: SPACE._2xs,
    backgroundColor: COLORS.theme?.primaryBackground,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: COLORS.theme?.borderColor
  },
  lastBody: {
    borderBottomStartRadius: 7,
    borderBottomEndRadius: 7
  },
  segmentDesc: {
    paddingBottom: SPACE.lg,
    paddingHorizontal: SPACE.md,
    fontSize: FONT_SIZE.xs
  }
});

export default ItemSegment;
