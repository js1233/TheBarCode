import {
  ImageStyle,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle
} from "react-native";
import React, { useState } from "react";
import { AppLabel } from "ui/components/atoms/app_label/AppLabel";
import { AppLog, SvgProp } from "utils/Util";
import { DropdownModal } from "ui/components/organisms/app_dropdown/DropdownModal";
import { usePreferredTheme } from "hooks";
import { DropDownItem } from "models/DropDownItem";
import ChevronDown from "assets/images/dropdown.svg";
import { TextStyle } from "react-native";
import EIntBoolean from "models/enums/EIntBoolean";
import { useCallback } from "react";
import { useEffect } from "react";
import { SPACE } from "config/Dimens";

export interface AppDropdownProps {
  title?: string;
  items: DropDownItem[] | any;
  preselectedItemString?: string | DropDownItem;
  shouldRunCallbackOnStart?: boolean;
  selectedItemCallback: (item: DropDownItem) => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  dropDownIconStyle?: StyleProp<ImageStyle>;
  dialogBgColor?: string;
  dialogCloseIconStyle?: StyleProp<ImageStyle>;
  dropDownIcon?: SvgProp;
  shouldShowCustomIcon?: boolean;
  isLocked?: EIntBoolean;
  onBlur?: () => void;
}

export const AppDropdown = React.memo<AppDropdownProps>(
  ({
    title,
    preselectedItemString,
    items,
    selectedItemCallback,
    dialogBgColor,
    dropDownIconStyle,
    dialogCloseIconStyle,
    style,
    textStyle,
    dropDownIcon,
    shouldShowCustomIcon = false,
    isLocked = EIntBoolean.FALSE,
    shouldRunCallbackOnStart = true,
    onBlur
  }) => {
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [selectedItemText, setSelectedItemText] = useState<
      string | undefined
    >(title);

    useEffect(() => {
      setSelectedItemText(title);
    }, [title]);

    const { themedColors } = usePreferredTheme();

    function openModal() {
      AppLog.log(() => "show modal");
      setModalVisible(true);
    }

    function closeModal() {
      AppLog.log(() => "close modal");
      setModalVisible(false);
    }

    const [selectedItemPosition, setSelectedItemPosition] =
      useState<number>(-1);

    const selectedItem = useCallback(
      (item: DropDownItem | any) => {
        AppLog.log(() => "selectedItem " + item.value);
        setModalVisible(false);
        setSelectedItemText(item.value);
        selectedItemCallback(item);
        setSelectedItemPosition(
          items.findIndex(
            (optionItem: any) => optionItem.value === item.value
          )
        );
      },
      [selectedItemCallback, items]
    );

    // show pre-selected item's text
    useEffect(() => {
      if (selectedItemPosition === -1) {
        let _selectedItemIndex = items.findIndex(
          (item: any) =>
            item.value?.toLowerCase() ===
            preselectedItemString?.toString()?.toLowerCase()
        );

        if (_selectedItemIndex !== -1) {
          selectedItem(items[_selectedItemIndex]);
        }
      }
    }, [
      items,
      selectedItem,
      preselectedItemString,
      shouldRunCallbackOnStart,
      selectedItemPosition
    ]);

    return (
      <View
        style={[
          styles.root,
          {
            backgroundColor: themedColors.secondaryBackground
          },
          style
        ]}>
        <DropdownModal
          isVisible={modalVisible}
          items={items}
          closeModal={() => {
            closeModal();
          }}
          selectedItemCallback={selectedItem}
          dropDownBgColor={dialogBgColor}
          dialogCloseIconStyle={dialogCloseIconStyle}
          selectedItemPosition={selectedItemPosition}
          isLocked={isLocked}
        />

        <Pressable
          testID="dropdown-click"
          onPress={() => {
            onBlur?.();
            !isLocked && openModal();
          }}>
          <View style={[styles.wrapper]}>
            <AppLabel
              text={selectedItemText}
              style={[
                styles.text,
                {
                  color:
                    selectedItemText === title
                      ? themedColors.placeholderColor
                      : themedColors.interface["900"]
                },
                textStyle
              ]}
            />
            {!shouldShowCustomIcon ? (
              <ChevronDown
                width={15}
                height={15}
                fill={themedColors.primaryBackground}
                style={[styles.dropdownIcon, dropDownIconStyle]}
              />
            ) : (
              dropDownIcon?.(themedColors.interface[900])
            )}
          </View>
        </Pressable>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  root: {
    borderRadius: 5,
    justifyContent: "center"
  },
  wrapper: {
    paddingVertical: 10,
    paddingHorizontal: SPACE.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 44
  },
  dropdownIcon: {
    width: 12,
    aspectRatio: 12 / 12,
    resizeMode: "contain"
  },
  text: { includeFontPadding: false }
});
