import { COLORS, FONT_SIZE, SPACE } from "config";
import { ModifierGroup } from "models/api_responses/ModifierDetailsResponseModel";
import React, { FC, useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import { FlatListWithPb } from "../flat_list/FlatListWithPb";
import NoRecordFound from "assets/images/tbc.svg";
import ItemModifierContainer from "../item_modifier_container/ItemModifierContainer";
import Separator, { Type } from "ui/components/atoms/separator/Separator";
import uuid from "react-native-uuid";

type Props = {
  modifiers: ModifierGroup;
  recalculatePrice: () => void;
};

const ItemModifierGroupContainer: FC<Props> = ({
  modifiers,
  recalculatePrice
}) => {
  const [finalData, setFinalData] = useState<ModifierGroup[] | undefined>(
    []
  );
  const [counter, setCounter] = useState<number>(0);

  useEffect(() => {
    modifiers.modifiers?.map((item) => {
      validateDataForStepperView(
        item,
        item.quantity !== undefined ? item.quantity! : 0
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateData = useCallback(
    (item: ModifierGroup, isSelected: boolean) => {
      let selectedQuantity = fetchModifierQuantity(modifiers);
      if (modifiers.max! === 1) {
        if (item.isSelected) {
          if (modifiers.max! === 1) {
            if (modifiers.min! === 0) {
              item.isSelected = false;
              item.quantity = 0;
            }
          }
        } else {
          modifiers.modifiers!.forEach((modifier) => {
            if (modifier.id === item.id) {
              item.isSelected = true;
              item.quantity = 1;
            } else {
              modifier.isSelected = false;
              modifier.quantity = 0;
            }
          });
        }
      } else {
        if (isSelected) {
          if (modifiers.max! <= 1 || selectedQuantity < modifiers.max!) {
            item.isSelected = true;
            item.quantity = 1;
            selectedQuantity = fetchModifierQuantity(modifiers);
            if (selectedQuantity < modifiers.max!) {
              modifiers.isLeftButtonDisabled = false;
            } else {
              modifiers.isLeftButtonDisabled = true;
            }

            if (selectedQuantity === 1 && modifiers.min! > 0) {
              modifiers.isRightButtonDisabled = true;
            } else {
              modifiers.isRightButtonDisabled = false;
            }
            // modifiers.isLeftButtonDisabled = false;
            // modifiers.isRightButtonDisabled = false;
            finalData!.push(item);
            setFinalData(finalData);
            recalculatePrice();
            if (fetchSelectedModifierCount(modifiers)! > 1) {
              validateDataForStepperView(item, 1);
            }
          }
        } else {
          if (fetchSelectedModifierCount(modifiers)! > modifiers.min!) {
            item.isSelected = false;
            item.quantity = 0;
            setFinalData(
              finalData?.filter((data) => {
                return data.modifier_id !== item.modifier_id;
              })
            );
            recalculatePrice();
            validateDataForStepperView(item, 0);
          }
        }
      }
      increamentCounter();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const fetchSelectedModifierCount = (group: ModifierGroup) => {
    return group.modifiers?.filter((data) => {
      return data.isSelected !== undefined && data.isSelected !== false;
    }).length;
  };

  const fetchModifierQuantity = (group: ModifierGroup) => {
    let total = 0;
    group.modifiers?.map((data) => {
      total += data.isSelected ? data.quantity! : 0;
    });
    group.selectedModifiersQuantity = total;
    return total;
  };

  const validateDataForStepperView = useCallback(
    (item: ModifierGroup, value: number) => {
      let preservedQuantity = item.quantity;
      if (
        value > 0 ||
        fetchSelectedModifierCount(modifiers)! > modifiers.min!
      ) {
        item.quantity = value;
      }

      let selectedQuantity = fetchModifierQuantity(modifiers);
      if (selectedQuantity > modifiers.max!) {
        item.quantity = preservedQuantity;
      }

      item.isSelected = item.quantity! > 0;
      if (selectedQuantity < modifiers.max!) {
        modifiers.isLeftButtonDisabled = false;
      } else {
        modifiers.isLeftButtonDisabled = true;
      }

      if (selectedQuantity === 1 && modifiers.min! > 0) {
        modifiers.isRightButtonDisabled = true;
      } else {
        modifiers.isRightButtonDisabled = false;
      }

      recalculatePrice();
      increamentCounter();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const increamentCounter = () => {
    setCounter((prev) => prev + 1);
  };

  const renderItem = useCallback(
    ({ item }: { item: ModifierGroup }) => {
      return (
        <>
          <View>
            <Separator
              type={Type.HORIZONTAL}
              color={COLORS.white}
              thickness={0.5}
            />
          </View>
          <ItemModifierContainer
            modifiers={item}
            max={modifiers.max!}
            multiMax={modifiers.multi_max!}
            validateData={validateData}
            validateDataForStepperView={validateDataForStepperView}
            group={modifiers}
            recalculatePrice={recalculatePrice}
          />
        </>
      );
    },

    [modifiers, recalculatePrice, validateData, validateDataForStepperView]
  );
  return (
    <View style={[styles.container]}>
      <View style={[styles.topNameContainer]}>
        <View style={[styles.leftContainerView]}>
          <AppLabel
            style={[styles.name]}
            text={modifiers.name}
            numberOfLines={2}
            textType={TEXT_TYPE.SEMI_BOLD}
          />
          {modifiers.max! > 1 && (
            <AppLabel
              style={[styles.minCount]}
              text={`Choose upto ${modifiers.max}`}
              textType={TEXT_TYPE.SEMI_BOLD}
            />
          )}
        </View>
        {modifiers.min! > 0 && (
          <View style={[styles.rightContainerView]}>
            <View style={[styles.requiredContainer]}>
              <AppLabel
                style={[styles.requiredText]}
                textType={TEXT_TYPE.BOLD}
                text={"REQUIRED"}
              />
            </View>
          </View>
        )}
      </View>
      <FlatListWithPb
        data={modifiers.modifiers}
        renderItem={renderItem}
        style={[styles.list]}
        noRecordFoundImage={<NoRecordFound width={"70%"} height={"15%"} />}
        keyExtractor={(item) => item?.id?.toString() ?? String(uuid.v4())}
        extraData={counter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.theme?.interface[200],
    marginHorizontal: SPACE.lg,
    borderRadius: SPACE._2md,
    overflow: "hidden",
    marginBottom: SPACE.md
  },
  list: {
    marginHorizontal: SPACE.lg
  },
  topNameContainer: {
    flex: 1,
    backgroundColor: COLORS.theme?.interface[200],
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10
  },
  name: {
    color: COLORS.black,
    fontSize: FONT_SIZE._2xs,
    alignSelf: "flex-start"
  },
  minCount: {
    fontSize: FONT_SIZE._3xs,
    color: COLORS.theme?.primaryShade[600],
    alignSelf: "flex-start"
  },
  leftContainerView: {
    marginLeft: SPACE.md,
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },
  rightContainerView: {
    alignItems: "center",
    marginRight: SPACE._2md
  },
  requiredContainer: {
    paddingVertical: SPACE.xs,
    paddingHorizontal: SPACE._2md,
    backgroundColor: COLORS.theme?.primaryShade[700],
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  requiredText: {
    fontSize: FONT_SIZE._3xs,
    color: COLORS.white
  }
});

export default ItemModifierGroupContainer;
