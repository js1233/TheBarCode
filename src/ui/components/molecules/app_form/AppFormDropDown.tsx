import { DropDownItem } from "models/DropDownItem";
import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import {
  AppLabel,
  AppLabelProps,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import { COLORS, FONT_SIZE, FONTS, SPACE } from "config";
import usePreferredTheme from "hooks/theme/usePreferredTheme";
import {
  AppDropdown,
  AppDropdownProps
} from "ui/components/organisms/app_dropdown/AppDropdown";
import { FormikValues, useFormikContext } from "formik";
import { AppFormValidationLabel } from "ui/components/molecules/app_form/AppFormValidationLabel";
import { SvgProp } from "utils/Util";
import EIntBoolean from "models/enums/EIntBoolean";

type Props = {
  labelProps?: AppLabelProps;
  name: string;
  appDropDownProps: AppDropdownProps;
  validationLabelTestID?: string;
  style?: StyleProp<ViewStyle>;
  dropDownIcon?: SvgProp;
  shouldShowCustomIcon?: boolean;
  isLocked?: EIntBoolean;
  selectedItem?: (item: DropDownItem) => void;
};

export const AppFormDropDown: React.FC<Props> = ({
  labelProps,
  name,
  appDropDownProps,
  validationLabelTestID,
  isLocked = EIntBoolean.FALSE,
  style,
  selectedItem
}) => {
  const theme = usePreferredTheme();
  const { errors, touched, setFieldValue, initialValues } =
    useFormikContext<FormikValues>();

  const { title, ...appDropDownPropsCopy } = appDropDownProps;

  return (
    <View style={style}>
      {labelProps && (
        <AppLabel
          textType={TEXT_TYPE.BOLD}
          numberOfLines={0}
          {...labelProps}
          style={[
            styles.label,
            {
              color: theme.themedColors.interface["900"]
            },
            labelProps ? labelProps.style : {}
          ]}
        />
      )}

      <AppDropdown
        {...appDropDownPropsCopy}
        title={title}
        isLocked={isLocked}
        preselectedItemString={initialValues[name]}
        selectedItemCallback={(item) => {
          setFieldValue(name, item);
          selectedItem?.(item);
        }}
      />

      {errors[name] && touched[name] && (
        <AppFormValidationLabel
          validationLabelTestID={validationLabelTestID}
          errorString={errors[name] as string}
          shouldVisible={true}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: SPACE.xs,
    fontSize: FONT_SIZE.sm
  },
  input: {
    flexDirection: "row",
    justifyContent: "center",
    color: COLORS.theme?.interface["900"],
    borderStyle: "solid",
    borderRadius: 5,
    borderColor: COLORS.theme?.borderColor,
    paddingRight: SPACE.md,
    paddingLeft: SPACE.md,
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.regular,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1

    // //Its for IOS
    // shadowColor: COLORS.black,
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.1,
    //
    // // its for android
    // elevation: 2,
    // backgroundColor: "white"
  }
});
