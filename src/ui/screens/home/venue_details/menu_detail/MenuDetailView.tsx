import React, { FC, useCallback, useEffect, useState } from "react";
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
import { Price } from "utils/Util";
import HTMLView from "react-native-htmlview";
import Strings from "config/Strings";
import { Stepper } from "ui/components/atoms/stepper/Stepper";
import { AppButton } from "ui/components/molecules/app_button/AppButton";
import { FlatListWithPb } from "ui/components/organisms/flat_list/FlatListWithPb";
import ItemMenuContainer from "ui/components/organisms/item_menu_container/ItemMenuContainer";
import NoRecordFound from "assets/images/tbc.svg";
import { ModifierDetails } from "models/api_responses/ModifierDetailsResponseModel";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Info from "assets/images/info_green.svg";
import AllergensInfoDialog from "ui/components/organisms/app_dialogs/AllergensInfoDialog";
import EScreen from "models/enums/EScreen";
import EFunnelType from "models/enums/EFunnelType";

type Props = {
  menu: BarMenu;
  modiferDetails: ModifierDetails[];
  addToCart: (grandTotal: number, stepperValue: number) => void;
  showProgressbar: boolean;
  addToCartLoading: boolean;
  prevQuantity: number;
  isUpdating: boolean;
  calculatePrice: (stepperValue: number) => void;
  totalBill: number;
  getComment: (comment: string) => void;
  shouldDisbableStepper?: boolean;
  buttonText: string;
  isOpenFrom: EScreen | undefined;
  shouldShowPriceInButton?: boolean;
};

export const MenuDetailView: FC<Props> = ({
  menu,
  modiferDetails,
  addToCart,
  showProgressbar,
  addToCartLoading,
  prevQuantity,
  isUpdating,
  calculatePrice,
  totalBill,
  getComment,
  shouldDisbableStepper = false,
  buttonText,
  isOpenFrom,
  shouldShowPriceInButton
}) => {
  const [comments, setComments] = useState<string | null>(
    menu && menu.comment !== undefined ? menu.comment : ""
  );

  const [commentsHeight, setCommentsHeight] = useState<number>(45);
  const [allergensInfoDialogVisible, setAllergensInfoDialogVisible] =
    useState(false);

  const { regionData } = useAppSelector(
    (state: RootState) => state.general
  );
  const [stepperValue, setStepperValue] = useState<number>(
    isUpdating ? menu && menu.quantity : 1
  );

  const safeAreaInset = useSafeAreaInsets();

  const recalculatePrice = () => {
    setStepperValue((prev) => {
      calculatePrice(prev);
      return prev;
    });
  };

  const renderItem = useCallback(
    ({ item, index }: { item: ModifierDetails; index: number }) => {
      return (
        <>
          {index === 0 && <>{renderTopView()}</>}
          <ItemMenuContainer
            data={item}
            recalculatePrice={recalculatePrice}
            shouldShowCheckButton={
              modiferDetails && modiferDetails.length >= 2
            }
          />
        </>
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [menu, modiferDetails]
  );

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
              source={{ uri: menu?.image ?? "" }}
            />
          </View>
        )}
        <View style={[styles.itemNameContainer]}>
          <AppLabel
            style={[styles.itemName, { flex: 2 }]}
            text={menu?.name ?? ""}
            textType={TEXT_TYPE.BOLD}
            numberOfLines={1}
          />
          <View style={{ flex: 0.1 }} />
          <AppLabel
            style={[styles.itemPrice]}
            textType={TEXT_TYPE.BOLD}
            text={Price.toString(
              regionData?.currency_symbol,
              menu?.price ?? 0
            )}
          />
        </View>
        {menu && menu.description != null && (
          <View style={[styles.descriptionContainer]}>
            <HTMLView value={menu?.description ?? ""} />
          </View>
        )}
        {menu.is_allergen && (
          <Pressable
            style={[styles.allergensContainer]}
            onPress={() => setAllergensInfoDialogVisible(true)}>
            <AppLabel
              text={Strings.venue_details.menu.allergens_info}
              style={[styles.allergensText]}
            />
            <Info />
          </Pressable>
        )}
      </>
    );
  };

  const getButtonText = () => {
    if (
      isOpenFrom === EScreen.BUNDLE_BOGO &&
      (menu.bundle_offer_type !== EFunnelType.DISCOUNT ||
        !shouldShowPriceInButton)
    ) {
      return buttonText;
    } else {
      return (
        buttonText +
        " - " +
        Price.toString(regionData?.currency_symbol, totalBill)
      );
    }
  };

  useEffect(() => {
    calculatePrice(isUpdating ? menu?.quantity ?? 0 : stepperValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.keyboardAvoidingView}>
      <Screen
        style={[styles.container]}
        shouldAddBottomInset={false}
        bottomSafeAreaColor={COLORS.theme?.secondaryBackground}>
        <View style={[styles.container]}>
          {modiferDetails === undefined ||
          (modiferDetails && modiferDetails.length > 0) ? (
            <FlatListWithPb
              data={modiferDetails}
              renderItem={renderItem}
              shouldShowProgressBar={showProgressbar}
              nestedScrollEnabled={true}
              noRecordFoundImage={
                <NoRecordFound width={"70%"} height={"15%"} />
              }
              keyExtractor={(item) => item.id.toString()}
            />
          ) : (
            renderTopView()
          )}
        </View>
        {showProgressbar === false && (
          <View style={[styles.bottomView]}>
            <View style={[styles.spacerView]} />

            {isOpenFrom !== EScreen.BUNDLE_BOGO && (
              <>
                <AppLabel
                  style={[styles.commentsLabel]}
                  text={Strings.venue_details.menu.addComments}
                  textType={TEXT_TYPE.BOLD}
                />
                <TextInput
                  placeholder={
                    Strings.venue_details.menu.commentsPlaceholder
                  }
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
              </>
            )}
            <View
              style={[
                styles.stepperContainer,
                {
                  paddingBottom:
                    Platform.OS === "ios" && safeAreaInset.bottom === 0
                      ? SPACE.lg
                      : Platform.OS === "android"
                      ? SPACE.lg
                      : 0,
                  flexDirection: "row"
                }
              ]}>
              {isOpenFrom !== EScreen.BUNDLE_BOGO && (
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
                      calculatePrice(value);
                    }}
                  />
                </View>
              )}
              <AppButton
                shouldShowProgressBar={addToCartLoading}
                text={getButtonText()}
                onPress={() => addToCart(totalBill, stepperValue)}
                textType={TEXT_TYPE.SEMI_BOLD}
                buttonStyle={{ flex: 1 }}
              />
            </View>
          </View>
        )}
        <AllergensInfoDialog
          isVisible={allergensInfoDialogVisible}
          hideSelf={() => setAllergensInfoDialogVisible(false)}
          allergensIcons={menu?.allergen_icons}
          message={menu?.allergen_description}
        />
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
    marginTop: SPACE._2xl
  },
  itemNameContainer: {
    marginHorizontal: SPACE.xl,
    marginTop: SPACE.xl,
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
    marginRight: 3,
    fontSize: FONT_SIZE._2xs
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
    flex: 1
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
