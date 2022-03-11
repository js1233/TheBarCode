import { COLORS, FONT_SIZE, SPACE } from "config";

import React, { FC, MutableRefObject, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import { FlatListWithPb } from "../flat_list/FlatListWithPb";
import NoRecordFound from "assets/images/tbc.svg";
import { MenuSegment } from "models/api_responses/GetSegmentResponseModel";
import { BarMenu } from "models/BarMenu";
import ItemBundleBogo from "ui/components/organisms/item_bundle_bogo/ItemBundleBogo";
import EFunnelType from "models/enums/EFunnelType";
import EProductGroupType from "models/enums/EProductGroupType";

type Props = {
  data: MenuSegment;
  menuItemStepperCallback: (
    funnel: MenuSegment,
    item: BarMenu,
    quantity: number,
    isInc: boolean
  ) => void;
  menu: BarMenu;
  shouldShowFreeTag?: boolean;
  isFunnelFree?: boolean;
  selectedFunnel: MutableRefObject<any>;
};

const ItemBundleBogoContainer: FC<Props> = ({
  data,
  shouldShowFreeTag,
  isFunnelFree,
  menu,
  menuItemStepperCallback,
  selectedFunnel
}) => {
  //   const [isSelected, setIsSelected] = useState<boolean>(data.isSelected);

  const renderItem = useCallback(
    ({ item }: { item: BarMenu }) => {
      return (
        <ItemBundleBogo
          data={item}
          menuSegment={data}
          shouldShowPrice={
            menu.bundle_offer_type !== EFunnelType.FIXED_PRICE &&
            !isFunnelFree
          }
          stepperCallback={(values, isInc) => {
            menuItemStepperCallback(data, item, values, isInc);
          }}
          selectedFunnel={selectedFunnel}
        />
      );
    },
    [data, isFunnelFree, menu, menuItemStepperCallback, selectedFunnel]
  );

  const getItemText = () => {
    return data?.quantity! > 1 ? "items" : "item";
  };

  return (
    <View style={[styles.container]}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: SPACE.md
        }}>
        <View style={{ flex: 1 }}>
          {menu.group_type === EProductGroupType.BUNDLE ? (
            <>
              {data.name && (
                <AppLabel
                  text={data.name}
                  style={styles.title}
                  textType={TEXT_TYPE.SEMI_BOLD}
                />
              )}
              <AppLabel
                text={`Select any ${data.quantity} ${getItemText()}`}
                style={styles.subTitle}
              />
            </>
          ) : (
            <AppLabel
              text={`Select any ${data.quantity} ${getItemText()}`}
              style={[styles.title, { color: COLORS.theme?.primaryColor }]}
              textType={TEXT_TYPE.SEMI_BOLD}
            />
          )}
          {/* <View style={styles.separator} /> */}
        </View>
        {shouldShowFreeTag && (
          <View style={styles.freeContainer}>
            <AppLabel
              text={"FREE"}
              style={styles.free}
              textType={TEXT_TYPE.SEMI_BOLD}
            />
          </View>
        )}
      </View>
      {data?.items?.length > 0 && (
        <FlatListWithPb<BarMenu>
          data={data.items}
          renderItem={renderItem}
          style={[styles.list]}
          nestedScrollEnabled={true}
          noRecordFoundImage={
            <NoRecordFound width={"70%"} height={"15%"} />
          }
          keyExtractor={(item) => item?.id?.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: SPACE.lg,
    backgroundColor: COLORS.theme?.interface[100],
    marginHorizontal: SPACE.lg,
    borderRadius: 5,
    paddingTop: SPACE.md
  },

  title: {
    fontSize: FONT_SIZE._2xs,
    color: COLORS.theme?.interface[900]
  },
  subTitle: {
    fontSize: FONT_SIZE._3xs,
    color: COLORS.theme?.primaryShade[700]
  },
  list: {
    flex: 1
  },
  separator: {
    backgroundColor: COLORS.white,
    height: 2,
    marginTop: SPACE.md,
    width: "100%"
  },
  freeContainer: {
    backgroundColor: COLORS.theme?.primaryShade[700],
    borderRadius: 15,
    height: 30,
    paddingHorizontal: SPACE._2lg,
    alignItems: "center",
    justifyContent: "center"
  },
  free: { color: COLORS.white, fontSize: FONT_SIZE._3xs }
});

export default ItemBundleBogoContainer;
