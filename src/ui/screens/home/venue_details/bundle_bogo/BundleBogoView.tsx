/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  Dispatch,
  FC,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useState
} from "react";
import {
  Image,
  StyleSheet,
  View,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Pressable
} from "react-native";
import Screen from "ui/components/atoms/Screen";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import { BarMenu } from "models/BarMenu";
import { COLORS, FONT_SIZE, SPACE } from "config";
import { RootState } from "stores/store";
import { useAppSelector } from "hooks/redux";
import { listContentContainerStyle, Price } from "utils/Util";
import HTMLView from "react-native-htmlview";
import Strings from "config/Strings";
import { Stepper } from "ui/components/atoms/stepper/Stepper";
import { AppButton } from "ui/components/molecules/app_button/AppButton";
import { FlatListWithPb } from "ui/components/organisms/flat_list/FlatListWithPb";

import NoRecordFound from "assets/images/tbc.svg";
import { ModifierDetails } from "models/api_responses/ModifierDetailsResponseModel";

import EProductGroupType from "models/enums/EProductGroupType";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MenuSegment } from "models/api_responses/GetSegmentResponseModel";
import ItemBundleBogoContainer from "ui/components/organisms/item_bundle_bogo_container/ItemBundleBogoContainer";
import EFunnelType from "models/enums/EFunnelType";
import useEffectWithSkipFirstTime from "hooks/useEffectWithSkipFirstTime";

type Props = {
  data?: MenuSegment[];

  menuItemStepperCallback: (
    funnel: MenuSegment,
    item: BarMenu,
    quantity: number,
    isInc: boolean
  ) => void;
  menu: BarMenu;
  modiferDetails?: ModifierDetails[];
  addToCart: (grandTotal: number) => void;
  showProgressbar: boolean;
  productType: EProductGroupType;
  addToCartLoading: boolean;
  prevQuantity: number;
  isUpdating: boolean;
  calculatePrice?: (stepperValue: number) => void;
  calculatePriceForBundle?: (stepperValue: number) => void;
  totalBill: number;
  getComment: (comment: string) => void;
  shouldDisbableStepper?: boolean;
  buttonText: string;
  calculateTotalPrice: (quantity?: number) => void;
  selectedFunnel: MutableRefObject<any>;
  stepperValue: number;
  setStepperValue: Dispatch<SetStateAction<number>>;
};

export const BundleBogoView: FC<Props> = ({
  data,
  menuItemStepperCallback,
  menu,
  addToCart,
  showProgressbar,
  addToCartLoading,
  prevQuantity,
  calculateTotalPrice,
  totalBill,
  getComment,
  shouldDisbableStepper = false,
  buttonText,
  selectedFunnel,
  stepperValue,
  setStepperValue
}) => {
  const [comments, setComments] = useState<string | null>(
    menu && menu.comment !== undefined ? menu.comment : ""
  );

  const [commentsHeight, setCommentsHeight] = useState<number>(45);

  const { regionData } = useAppSelector(
    (state: RootState) => state.general
  );

  const [counter, setCounter] = useState<number>(0);

  const safeAreaInset = useSafeAreaInsets();

  const renderItem = useCallback(
    ({ item, index }: { item: MenuSegment; index: number }) => {
      return (
        <>
          {index === 0 && data && <>{renderTopView()}</>}
          <ItemBundleBogoContainer
            data={item}
            shouldShowFreeTag={item.name === freeFunnelName ? true : false}
            menu={menu}
            isFunnelFree={
              menu?.bundle_offer_type === EFunnelType.FREE_FUNNEL &&
              menu.free_funnel_id === item.id
            }
            menuItemStepperCallback={menuItemStepperCallback}
            selectedFunnel={selectedFunnel}
          />
        </>
      );
    },
    [menu, data]
  );

  let freeFunnelName = "";

  const getFreeFunnelText = () => {
    data?.forEach((item) => {
      if (item.id === menu.free_funnel_id) {
        freeFunnelName = item.name;
      }
    });

    return freeFunnelName;
  };

  const getSubtitle = () => {
    if (menu?.bundle_offer_type === EFunnelType.DISCOUNT) {
      return menu.bundle_discount + "% OFF";
    } else if (menu?.bundle_offer_type === EFunnelType.FIXED_PRICE) {
      return Price.toString(
        menu?.establishment?.region?.currency_symbol,
        Number(menu?.price?.toFixed(2))
      );
    } else if (menu?.bundle_offer_type === EFunnelType.FREE_FUNNEL) {
      return "FREE " + getFreeFunnelText();
    } else {
      return "Free";
    }
  };

  const renderTopView = () => {
    return (
      <>
        {menu && menu.image != null && (
          <View
            style={{
              marginHorizontal: SPACE.lg
            }}>
            <Image
              style={[styles.itemImage]}
              source={
                menu.image !== null
                  ? { uri: menu.image! }
                  : require("assets/images/cart_placeholder.png")
              }
            />
          </View>
        )}
        <View style={[styles.itemNameContainer]}>
          <AppLabel
            style={[styles.itemName]}
            text={menu?.name ?? ""}
            textType={TEXT_TYPE.BOLD}
            numberOfLines={1}
          />
        </View>
        {menu && menu.description != null && (
          <View style={[styles.descriptionContainer]}>
            <HTMLView
              value={`<p>${menu?.description ?? ""}</p>`}
              stylesheet={styleDesc}
            />
          </View>
        )}
        {menu.group_type === EProductGroupType.BUNDLE && (
          <AppLabel
            text={getSubtitle()}
            style={[styles.allergensText]}
            textType={TEXT_TYPE.SEMI_BOLD}
          />
        )}
      </>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.keyboardAvoidingView}>
      <Screen
        style={[styles.container]}
        shouldAddBottomInset={false}
        contentViewBackgroundColor={COLORS.theme?.interface["50"]}
        bottomSafeAreaColor={COLORS.theme?.interface["50"]}>
        <View style={[styles.container]}>
          <FlatListWithPb<MenuSegment>
            data={data}
            renderItem={renderItem}
            style={[styles.container]}
            shouldShowProgressBar={showProgressbar}
            nestedScrollEnabled={true}
            noRecordFoundImage={
              <NoRecordFound width={"70%"} height={"15%"} />
            }
            keyExtractor={(item) => item?.id?.toString()}
            extraData={counter}
          />
        </View>
        {showProgressbar === false && (
          <View style={[styles.bottomView]}>
            <View style={[styles.spacerView]} />
            <AppLabel
              style={[styles.commentsLabel]}
              text={Strings.venue_details.menu.addComments}
              textType={TEXT_TYPE.BOLD}
            />
            <TextInput
              placeholder={Strings.venue_details.menu.commentsPlaceholder}
              style={[
                styles.textFieldStyle,
                {
                  height: commentsHeight,
                  paddingTop: 12
                }
              ]}
              placeholderTextColor={COLORS.theme?.interface[500]}
              textAlignVertical={"top"}
              value={comments ?? ""}
              multiline={true}
              numberOfLines={3}
              onFocus={() => {
                setCommentsHeight(95);
              }}
              onBlur={() => {
                setCommentsHeight(45);
              }}
              onChangeText={(value) => {
                setComments(value);
                getComment(value);
              }}
            />
            <View
              style={[
                styles.stepperContainer,
                {
                  paddingBottom:
                    Platform.OS === "ios" && safeAreaInset.bottom === 0
                      ? SPACE.lg
                      : Platform.OS === "android"
                      ? SPACE.lg
                      : 0
                }
              ]}>
              <View style={{ marginEnd: 15 }}>
                <Stepper
                  min={1}
                  initialValue={
                    prevQuantity !== undefined ? prevQuantity : 1
                  }
                  shouldDisableLeftButton={shouldDisbableStepper}
                  shouldDisableRightButton={shouldDisbableStepper}
                  onValueChange={(value) => {
                    setStepperValue(value);
                    calculateTotalPrice();
                  }}
                />
              </View>
              <AppButton
                isDisable={totalBill === 0.0 ? true : false}
                shouldShowProgressBar={addToCartLoading}
                text={
                  buttonText +
                  " - " +
                  Price.toString(regionData?.currency_symbol, totalBill)
                }
                onPress={() => addToCart(totalBill)}
                textType={TEXT_TYPE.SEMI_BOLD}
                buttonStyle={{ flex: 1 }}
              />
            </View>
          </View>
        )}
      </Screen>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  itemImage: {
    height: 200,
    width: "100%",
    alignSelf: "center",
    borderRadius: SPACE._2md,
    marginTop: SPACE.lg
  },
  itemNameContainer: {
    flex: 1,
    marginHorizontal: SPACE.xl,
    marginTop: SPACE._2md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  itemName: {
    fontSize: FONT_SIZE.sm
  },
  itemPrice: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.theme?.primaryShade[700]
  },
  p: {
    fontSize: FONT_SIZE._3xs
  },
  descriptionContainer: {
    marginHorizontal: SPACE.xl,
    marginTop: 2
  },
  allergensContainer: {
    marginLeft: SPACE.xl,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5
  },
  allergensText: {
    color: COLORS.theme?.primaryShade[700],
    marginHorizontal: SPACE.xl,
    paddingTop: SPACE._2xs,
    fontSize: FONT_SIZE.sm
  },
  spacerView: {
    backgroundColor: COLORS.theme?.interface[300],
    height: 1,
    width: "100%"
  },
  bottomView: {
    bottom: 0
  },
  commentsLabel: {
    color: COLORS.black,
    marginLeft: SPACE._2md,
    marginTop: SPACE._2md,
    fontSize: FONT_SIZE._3xs
  },
  textFieldStyle: {
    marginHorizontal: SPACE._2md,
    marginTop: SPACE._2md,
    backgroundColor: COLORS.theme?.interface[200],
    borderRadius: SPACE._2md,
    height: 90,
    color: COLORS.black,
    paddingLeft: SPACE._2md
  },
  stepperContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: SPACE._2lg,
    marginTop: SPACE._2md,
    alignItems: "center"
  },
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: "red"
  },
  allergensIcon: {
    marginTop: SPACE.sm,
    marginHorizontal: SPACE.xs,
    marginBottom: SPACE.xs
  },
  iconList: {
    marginBottom: SPACE.sm,
    backgroundColor: COLORS.white,
    borderRadius: SPACE._2md,
    paddingBottom: SPACE.xs,
    marginHorizontal: 10
  },
  iconContainer: {
    height: 55,
    width: 55,
    borderWidth: 2,
    borderColor: COLORS.theme?.primaryColor,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center"
  }
});

const styleDesc = StyleSheet.create({
  p: {
    fontSize: FONT_SIZE._2xs
  }
});
