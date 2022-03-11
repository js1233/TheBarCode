import React, { FC, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import RadioButtonActive from "assets/images/radio-btn-active.svg";
import RadioButtonInActive from "assets/images/radio-btn-inactive.svg";
import { ModifierGroup } from "models/api_responses/ModifierDetailsResponseModel";
import { COLORS, FONT_SIZE, SPACE } from "config";
import { AppLabel } from "ui/components/atoms/app_label/AppLabel";
import { Price } from "utils/Util";
import Checked from "assets/images/checkbox-btn.svg";
import UnChecked from "assets/images/unChecked.svg";
import { Stepper } from "ui/components/atoms/stepper/Stepper";
import { useAppSelector } from "hooks/redux";
import { RootState } from "stores/store";

type Props = {
  modifiers: ModifierGroup;
  max: number;
  multiMax: number;
  validateData: (item: ModifierGroup, isSelected: boolean) => void;
  validateDataForStepperView: (item: ModifierGroup, value: number) => void;
  group: ModifierGroup;
  recalculatePrice: () => void;
};

const ItemModifierContainer: FC<Props> = ({
  modifiers,
  max,
  multiMax,
  validateData,
  validateDataForStepperView,
  group,
  recalculatePrice
}) => {
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const { regionData } = useAppSelector(
    (state: RootState) => state.general
  );

  return (
    <>
      <Pressable
        style={[styles.container]}
        onPress={() => {
          setIsSelected(!isSelected);
          validateData(modifiers, !isSelected);
          recalculatePrice();
        }}>
        <View style={[styles.leftContainer]}>
          <Pressable
            style={[styles.rightSpacing]}
            onPress={() => {
              setIsSelected(!isSelected);
              validateData(modifiers, !isSelected);
              recalculatePrice();
            }}>
            {max > 1 ? (
              modifiers.isSelected || modifiers.quantity! > 0 ? (
                <Checked />
              ) : (
                <UnChecked />
              )
            ) : modifiers.isSelected || modifiers.quantity! > 0 ? (
              <RadioButtonActive stroke={COLORS.theme?.borderColor} />
            ) : (
              <RadioButtonInActive stroke={COLORS.theme?.borderColor} />
            )}
          </Pressable>
          <AppLabel
            text={modifiers.name}
            style={{ fontSize: FONT_SIZE._2xs }}
          />
        </View>
        <View>
          <AppLabel
            text={Price.toString(
              regionData?.currency_symbol,
              modifiers.price
            )}
            style={{ fontSize: FONT_SIZE._2xs }}
          />
        </View>
      </Pressable>
      {group.multi_max! > 1 && modifiers.quantity! > 0 && group.max! > 1 && (
        <View style={[styles.stepperContainer]}>
          <Stepper
            min={0}
            max={multiMax}
            initialValue={modifiers.quantity}
            containerStyle={{ marginLeft: SPACE.xl }}
            onValueChange={(value) => {
              validateDataForStepperView(modifiers, value);
              recalculatePrice();
            }}
            shouldDisableLeftButton={group.isLeftButtonDisabled!}
            shouldDisableRightButton={group.isRightButtonDisabled!}
          />
          <AppLabel
            text={Price.toString(
              regionData?.currency_symbol,
              modifiers.price! * modifiers.quantity!
            )}
            style={{ fontSize: FONT_SIZE._2xs }}
          />
        </View>
      )}
    </>
  );
};

export default ItemModifierContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: SPACE._2md
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  rightSpacing: { marginRight: SPACE.sm },
  stepperContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: SPACE._2md
  }
});
