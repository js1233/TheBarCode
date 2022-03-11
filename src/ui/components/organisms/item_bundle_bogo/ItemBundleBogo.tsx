import { COLORS, FONT_SIZE, SPACE } from "config";
import React, { FC, MutableRefObject, useCallback, useState } from "react";
import { StyleSheet, View, Image, Pressable } from "react-native";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";

import { Stepper } from "ui/components/atoms/stepper/Stepper";
import { BarMenu, supportedOrderTypes } from "models/BarMenu";

import InfoCircle from "assets/images/ic_info_circle.svg";
import RightArrow from "assets/images/ic_right_arrow.svg";
import { FlatListWithPb } from "../flat_list/FlatListWithPb";
import { UpdateModifier } from "models/UpdateModifier";
import AllergensInfoDialog from "../app_dialogs/AllergensInfoDialog";
import { Modifier } from "models/Modifier";
import uuid from "react-native-uuid";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { HomeStackParamList } from "routes/HomeStack";
import { MenuSegment } from "models/api_responses/GetSegmentResponseModel";
import EScreen from "models/enums/EScreen";
import { Price } from "utils/Util";
import EFunnelType from "models/enums/EFunnelType";

type Props = {
  data: BarMenu;
  menuSegment: MenuSegment;
  shouldShowPrice?: boolean;
  selectedFunnel: MutableRefObject<any>;
  stepperCallback: (values: number, isInc: boolean) => void;
};

type HomeNavigationProps = StackNavigationProp<
  HomeStackParamList,
  "BundleBogo"
>;

const ItemBundleBogo: FC<Props> = ({
  data,
  stepperCallback,
  selectedFunnel,
  shouldShowPrice,
  menuSegment
}) => {
  const homeNavigation = useNavigation<HomeNavigationProps>();

  const getPrice = useCallback(() => {
    let total: number = 0;
    total = (!data?.quantity ? 1 : data.quantity) * data.price;

    return Price.toString(
      data?.establishment?.region?.currency_symbol,
      Number(total.toFixed(2))
    );
  }, [data]);

  const calculateModifiersPrice = useCallback(
    (item: Modifier[] | []) => {
      let total = 0;

      item.forEach((_item) => {
        total += Number(_item.quantity!) * Number(_item.price!);
      });

      return Price.toString(
        data?.establishment?.region?.currency_symbol,
        total!
      );
    },
    [data]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: [] | [Modifier]; index: number }) => {
      const onClick = () => {
        selectedFunnel.current = { id: menuSegment.id, menuId: data.id };

        homeNavigation.navigate("MenuDetail", {
          menu: { ...data, quantity: 1 },
          menuType: supportedOrderTypes(data),
          productType: data.group_type,
          isUpdating: (item?.length ?? 0) > 0 ? true : false,
          establishment_id: data.establishment_id,
          supportedType: data.menu_type,
          isOpenFrom: EScreen.BUNDLE_BOGO,
          selectedModifiers: data.modifiers_acc_quan![index],
          selectedModifierIndex: index,
          shouldShowPriceInButton: shouldShowPrice
        });
      };

      return (
        <View style={styles.updateModifierContainer}>
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center"
            }}
            onPress={onClick}>
            <View style={{ flex: 1 }}>
              <AppLabel
                text={"Customize Order"}
                style={styles.updateModifier}
                textType={TEXT_TYPE.SEMI_BOLD}
              />
            </View>
            {(menuSegment.bundle_offer_type === EFunnelType.DISCOUNT ||
              shouldShowPrice) && (
              <AppLabel
                style={styles.updateModifier}
                text={
                  item?.length > 0 ? calculateModifiersPrice(item) : " "
                }
                textType={TEXT_TYPE.SEMI_BOLD}
              />
            )}
            <RightArrow
              fill={COLORS.theme?.interface[500]}
              width={10}
              height={10}
            />
          </Pressable>
        </View>
      );
    },
    [
      calculateModifiersPrice,
      data,
      homeNavigation,
      menuSegment,
      selectedFunnel,
      shouldShowPrice
    ]
  );

  const [allergensInfoDialogVisible, setAllergensInfoDialogVisible] =
    useState(false);

  return (
    <Pressable>
      <>
        <View style={styles.separator} />
        <View style={[styles.container]}>
          <Image
            source={
              data?.image !== null
                ? { uri: data?.image! }
                : require("assets/images/cart_placeholder.png")
            }
            style={[
              styles.productImage,
              { borderColor: COLORS.theme?.interface[300] }
            ]}
          />
          <View style={[styles.middleView]}>
            <AppLabel
              style={[styles.productName]}
              text={data?.name}
              textType={TEXT_TYPE.SEMI_BOLD}
            />
            {shouldShowPrice && data?.price > 0 && (
              <View style={styles.quantityPriceContainerOuter}>
                <View style={styles.quantityPriceContainer}>
                  <AppLabel
                    style={[styles.productName]}
                    text={(data?.quantity ?? 0) + " x "}
                  />

                  <AppLabel
                    style={[styles.productName]}
                    text={Price.toString(
                      data?.establishment?.region?.currency_symbol,
                      data.price ?? 0
                    )}
                  />
                </View>
                <AppLabel
                  style={[styles.productName]}
                  textType={TEXT_TYPE.SEMI_BOLD}
                  text={data?.quantity > 0 ? getPrice() : ""}
                />
              </View>
            )}
            <View style={[styles.productPriceContainer]}>
              <Stepper
                min={0}
                containerStyle={{ marginTop: 2, marginHorizontal: 0 }}
                shouldStepperUpdateCount={false}
                initialValue={data?.quantity ?? 0}
                shouldDisableRightButton={false}
                shouldDisableLeftButton={
                  menuSegment.already_selected_quantity ===
                  menuSegment.quantity
                }
                onValueChange={stepperCallback}
              />
              {data?.is_allergen && (
                <Pressable
                  style={{ padding: 5 }}
                  onPress={() => setAllergensInfoDialogVisible(true)}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center"
                    }}>
                    <AppLabel
                      style={{
                        marginRight: SPACE._2xs,
                        fontSize: FONT_SIZE._3xs,
                        color: COLORS.theme?.primaryShade["700"]
                      }}
                      text={"Allergens Info"}
                    />
                    <InfoCircle
                      width={18}
                      height={18}
                      fill={COLORS.theme?.primaryShade["700"]}
                    />
                  </View>
                </Pressable>
              )}
            </View>

            {data?.have_modifiers &&
              (data.modifiers_acc_quan?.length ?? 0) > 0 && (
                <FlatListWithPb<UpdateModifier>
                  data={data.modifiers_acc_quan!}
                  renderItem={renderItem}
                  style={[styles.list]}
                  nestedScrollEnabled={true}
                  keyExtractor={(item) =>
                    item?.id?.toString() ?? String(uuid.v4())
                  }
                />
              )}
          </View>
        </View>
        <AllergensInfoDialog
          isVisible={allergensInfoDialogVisible}
          hideSelf={() => setAllergensInfoDialogVisible(false)}
          allergensIcons={data?.allergen_icons}
          message={data?.allergen_description}
        />
      </>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: SPACE.md
  },
  productImage: {
    height: 50,
    width: 50,
    borderRadius: 8
  },
  middleView: {
    flex: 1,
    marginStart: SPACE._2md
  },
  productName: {
    fontSize: FONT_SIZE._2xs,
    color: COLORS.theme?.interface[900]
  },
  plusContainer: {
    height: 28,
    width: 28,
    borderRadius: 14,
    backgroundColor: COLORS.theme?.primaryColor,
    marginHorizontal: 3,
    alignItems: "center",
    justifyContent: "center"
  },

  productPriceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: SPACE.md
  },
  productUnitPrice: {
    marginLeft: 3,
    marginTop: 5
  },
  quantityPriceContainer: {
    flexDirection: "row"
  },
  quantityPriceContainerOuter: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: SPACE.md,
    alignItems: "center"
  },
  updateModifierContainer: {
    flexDirection: "row",
    justifyContent: "space-between",

    backgroundColor: COLORS.theme?.interface[200],
    padding: SPACE.xs,
    marginTop: SPACE.md,
    borderRadius: 3,
    alignItems: "center"
  },
  updateModifier: {
    fontSize: FONT_SIZE._2xs,
    color: COLORS.theme?.interface[900],
    paddingLeft: SPACE._2xs
  },
  separator: {
    backgroundColor: COLORS.white,
    height: 0.9,
    marginTop: SPACE.md,
    marginHorizontal: SPACE.md
  },
  list: {
    flex: 1
  }
});

export default ItemBundleBogo;
