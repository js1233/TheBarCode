/* eslint-disable @typescript-eslint/no-unused-vars */
import { COLORS, FONT_SIZE, SPACE } from "config";
import React, { useCallback, useEffect, useRef, useState } from "react";
import uuid from "react-native-uuid";
import { Linking, Pressable, StyleSheet, View, Image } from "react-native";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import Screen from "ui/components/atoms/Screen";
import Close from "assets/images/ic_cross.svg";
import Menu from "assets/images/hamburger.svg";
import { listContentContainerStyle, shadowStyleProps } from "utils/Util";
import { MenuSegment } from "models/api_responses/GetSegmentResponseModel";
import _ from "lodash";
import { FlatListWithPb } from "ui/components/organisms/flat_list/FlatListWithPb";
import { BarMenu } from "models/BarMenu";
import { FlatList } from "react-native-gesture-handler";
import ESupportedOrderType from "models/enums/ESupportedOrderType";
import { Venue } from "models/Venue";
import ItemSegment from "ui/components/organisms/item_menu/ItemSegment";
import { AddToCartResponseModel } from "models/api_responses/AddToCartResponseModel";

type Props = {
  onRefresh: () => void;
  menuSegments: MenuSegment[] | undefined;
  isLoading: boolean;
  _venue: Venue | undefined;
  error: string | undefined;
  refreshCallback: (onComplete?: () => void) => void;
  openAllergensDialog: () => void;
  menuType: ESupportedOrderType;
  updateMenuList: (
    menu: BarMenu,
    quantity: number,
    cart_item_id: number | null
  ) => void;

  onBasicBogoClick: (
    bogo: BarMenu,
    dataBody: AddToCartResponseModel
  ) => void;
};

export type StickyList = {
  name: string;
  items: BarMenu[];
};

function MenuListView({
  onRefresh,
  menuSegments,
  isLoading,
  error,
  refreshCallback,
  openAllergensDialog,
  menuType,
  updateMenuList,
  _venue,
  onBasicBogoClick
}: Props) {
  const flatListRef = useRef<FlatList<any>>(null);
  const [stickyHeader, setStickyHeader] = useState<string>("Menu");
  const [stickListVisibility, setStickyListVisibility] =
    useState<boolean>(false);
  const [scrollToIndex, setScrollToIndex] = useState<{
    indexValue: number;
  }>({
    indexValue: 0
  });

  useEffect(() => {
    if (
      scrollToIndex.indexValue >= 0 &&
      menuSegments &&
      menuSegments?.length > 0
    ) {
      flatListRef.current?.scrollToIndex({
        index: scrollToIndex.indexValue,
        animated: true
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollToIndex]);

  //Sticky menu work
  let stickyMenuList: StickyList[] | undefined =
    _.map(menuSegments, (currentObject) => {
      return _.pick(currentObject, "name", "items");
    }) ?? undefined;

  const onStickyBarClick = () => {
    if (stickyHeader === "Menu") {
      setStickyHeader("Close");
      setStickyListVisibility(true);
    } else {
      setStickyListVisibility(false);
      setStickyHeader("Menu");
    }
  };

  //Sticky menu item
  const renderItem = useCallback(
    ({ item, index }: { item: StickyList; index: number }) => {
      return (
        <Pressable
          onPress={() => {
            setScrollToIndex(
              _.cloneDeep({
                indexValue: index
              })
            );
            setStickyListVisibility(false);
            setStickyHeader("Menu");
          }}>
          <View style={styles.stickyItem}>
            <AppLabel text={item.name} style={{ flex: 1 }} />
            <AppLabel
              text={item.items.length.toString() ?? "0"}
              textType={TEXT_TYPE.SEMI_BOLD}
            />
          </View>
        </Pressable>
      );
    },
    []
  );

  const closeStickyList = () => {
    setStickyListVisibility(false);
    setStickyHeader("Menu");
  };
  //Sticky menu work end

  const listItem = useCallback(
    ({ item }: { item: MenuSegment; index: number }) => {
      return (
        <ItemSegment
          data={item}
          menuType={menuType}
          venue={_venue}
          onBasicBogoClick={onBasicBogoClick}
        />
      );
    },
    [_venue, menuType, onBasicBogoClick]
  );

  return (
    <View style={{ flex: 1 }}>
      <Screen style={styles.container} shouldAddBottomInset={false}>
        <Pressable onPress={closeStickyList}>
          {/* <TouchableOpacity onPress={openAllergensDialog}>
            <View style={styles.allergens}>
              <AppLabel
                text={Strings.venue_details.menu.allergens}
                textType={TEXT_TYPE.SEMI_BOLD}
              />
              <Info
                width={20}
                height={20}
                fill={COLORS.theme?.primaryColor}
              />
            </View>
          </TouchableOpacity> */}
        </Pressable>
        <FlatListWithPb
          listRef={flatListRef}
          data={menuSegments}
          error={error}
          shouldShowProgressBar={isLoading}
          pullToRefreshCallback={onRefresh}
          renderItem={listItem}
          style={{
            paddingHorizontal: menuSegments?.length! > 0 ? SPACE.lg : 0,
            flex: 1
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[listContentContainerStyle]}
          listKey={(item: MenuSegment) => item?.id?.toString()}
          keyExtractor={(item) =>
            (item?.id ?? String(uuid.v4())).toString()
          }
        />

        {menuSegments && menuSegments.length > 0 && (
          <View style={styles.stickyWrapper}>
            <FlatListWithPb
              data={stickyMenuList}
              renderItem={renderItem}
              shouldShowProgressBar={false}
              isAllDataLoaded={true}
              listKey="2"
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View />}
              contentContainerStyle={[
                styles.stickyList,
                {
                  display: stickListVisibility ? "flex" : "none"
                }
              ]}
              keyExtractor={(item) => item?.name?.toString()}
            />
            <Pressable
              onPress={onStickyBarClick}
              style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1.0 }]}>
              <View
                style={[
                  styles.cartContainer,
                  styles.stickyButton,
                  {
                    marginBottom:
                      (_venue?.is_external_url &&
                        menuType ===
                          ESupportedOrderType.DINE_IN_COLLECTION &&
                        _venue.external_url !== undefined) ||
                      (_venue?.is_external_url &&
                        menuType ===
                          ESupportedOrderType.TAKEAWAY_DELIVERY &&
                        _venue?.external_url_td !== undefined)
                        ? SPACE._4xl
                        : SPACE.sm
                  }
                ]}>
                {stickyHeader === "Menu" ? (
                  <Menu stroke={COLORS.theme?.primaryColor} width={17} />
                ) : (
                  <Close
                    stroke={COLORS.theme?.interface["700"]}
                    width={17}
                  />
                )}
                <AppLabel
                  text={stickyHeader}
                  style={[styles.heading, { paddingStart: SPACE.xs }]}
                  textType={TEXT_TYPE.SEMI_BOLD}
                />
              </View>
            </Pressable>
          </View>
        )}
        <View style={styles.stickyWrapper}>
          {((_venue?.is_external_url &&
            menuType === ESupportedOrderType.DINE_IN_COLLECTION &&
            _venue.external_url !== undefined) ||
            (_venue?.is_external_url &&
              menuType === ESupportedOrderType.TAKEAWAY_DELIVERY &&
              _venue?.external_url_td !== undefined)) && (
            <Pressable
              onPress={() => {
                if (
                  menuType === ESupportedOrderType.DINE_IN_COLLECTION &&
                  _venue.external_url !== null &&
                  _venue.external_url !== undefined
                ) {
                  Linking.openURL(_venue?.external_url ?? "");
                } else if (
                  menuType === ESupportedOrderType.TAKEAWAY_DELIVERY &&
                  _venue?.external_url_td !== null &&
                  _venue?.external_url_td !== undefined
                ) {
                  Linking.openURL(_venue?.external_url_td ?? "");
                }
              }}>
              <View
                style={[
                  styles.cartContainer,
                  styles.stickyButton,
                  { marginBottom: 0 }
                ]}>
                <Image
                  source={require("assets/images/link_1.png")}
                  style={{
                    width: 17,
                    height: 17,
                    tintColor: COLORS.theme?.primaryColor
                  }}
                />
                <AppLabel
                  text={"Order Now"}
                  style={[styles.heading, { paddingStart: SPACE.xs }]}
                  textType={TEXT_TYPE.SEMI_BOLD}
                />
              </View>
            </Pressable>
          )}
        </View>
      </Screen>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  container1: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: SPACE.md,
    paddingVertical: SPACE._2xl
  },
  imageStyle: {
    backgroundColor: COLORS.theme?.interface["50"],
    borderRadius: 5,
    overflow: "hidden"
  },
  rightContainer: {
    flex: 1,
    paddingHorizontal: SPACE._2md
  },
  stickyWrapper: {
    flexDirection: "column",
    position: "absolute",
    alignSelf: "flex-end",
    justifyContent: "flex-end",
    bottom: 20,
    maxHeight: 250,
    overflow: "visible",
    ...shadowStyleProps
  },
  stickyButton: {
    alignSelf: "flex-end",
    ...shadowStyleProps,
    marginHorizontal: SPACE.xl
  },
  stickyList: {
    marginEnd: SPACE.xl,
    flex: 1
  },
  stickyItem: {
    flexDirection: "row",
    width: 200,
    backgroundColor: COLORS.theme?.primaryBackground,
    paddingVertical: SPACE.md,
    paddingHorizontal: SPACE.md
  },
  heading: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.theme?.interface["900"]
  },
  cartContainer: {
    flexDirection: "row",
    marginTop: SPACE.md,
    alignItems: "center",
    alignContent: "center",
    alignSelf: "flex-start",
    paddingHorizontal: SPACE.md,
    paddingVertical: SPACE.xs,
    backgroundColor: COLORS.theme?.primaryBackground,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: COLORS.theme?.borderColor
  },
  sectionedList: {
    borderRadius: 5,
    paddingHorizontal: SPACE.lg,
    paddingVertical: SPACE.lg
  },
  lastBody: {
    borderBottomStartRadius: 7,
    borderBottomEndRadius: 7
  },
  bodyView: {},
  allergens: {
    paddingVertical: 10,
    backgroundColor: COLORS.theme?.interface["100"],
    marginHorizontal: SPACE.lg,
    paddingHorizontal: SPACE._2md,
    borderRadius: 7,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: SPACE.lg
  }
});

export default MenuListView;
