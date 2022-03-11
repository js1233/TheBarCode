import { SPACE } from "config";
import { FormikValues, useFormikContext } from "formik";
import usePreferredTheme from "hooks/theme/usePreferredTheme";
import { DropDownItem } from "models/DropDownItem";
import {
  getDaysFromMonth,
  getMonthNumberFromMonthName,
  months,
  yearsList
} from "models/enums/EGender";
import EIntBoolean from "models/enums/EIntBoolean";
import moment from "moment";
import React, { useState } from "react";
import {
  Dimensions,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle
} from "react-native";
import {
  AppLabel,
  AppLabelProps,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import { AppFormValidationLabel } from "ui/components/molecules/app_form/AppFormValidationLabel";
import {
  AppDropdown,
  AppDropdownProps
} from "ui/components/organisms/app_dropdown/AppDropdown";
import { SvgProp } from "utils/Util";

type Props = {
  labelProps?: AppLabelProps;
  name: string;
  appDropDownProps?: AppDropdownProps;
  validationLabelTestID?: string;
  style?: StyleProp<ViewStyle>;
  dropDownIcon?: SvgProp;
  shouldShowCustomIcon?: boolean;
  isLocked?: EIntBoolean;
  selectedItem?: (item: DropDownItem) => void;
  callback: (date: string) => void;
};

export const DateOfBirthDropDown: React.FC<Props> = ({
  isLocked = EIntBoolean.FALSE,
  selectedItem,
  callback,
  name
}) => {
  const theme = usePreferredTheme();
  const { errors, touched, setFieldValue } =
    useFormikContext<FormikValues>();
  const [month, setMonth] = useState<string>("Jan");
  const [year, setYear] = useState<string>("");
  const [day, setDay] = useState<string>("");

  const getDate = (
    y: string = "YYYY",
    m: string = "MM",
    d: string = "DD"
  ) => {
    if (m === "Jan") {
      m = "MM";
    }
    if (d === "") {
      d = "DD";
    }
    if (d !== "" && "DD") {
      d = d.length === 1 ? "0" + d : d;
    }
    if (y === "") {
      y = "YYYY";
    }
    return y + "-" + getMonthNumberFromMonthName(m) + "-" + d;
  };
  return (
    <View style={styles.container}>
      <AppLabel
        text={"Date Of Birth"}
        textType={TEXT_TYPE.BOLD}
        numberOfLines={0}
        style={[
          styles.label,
          { color: theme.themedColors.interface["900"] }
        ]}
      />
      <View style={styles.dateOfBirthContainer}>
        <AppDropdown
          title={"Year"}
          items={yearsList}
          isLocked={isLocked}
          selectedItemCallback={(item) => {
            setFieldValue(
              name,
              moment(
                getDate(item.value, month, day),
                "YYYY-MM-DD"
              ).toDate()
            );
            selectedItem?.(item);
            setYear(item.value);
            callback(getDate(item.value, month, day));
          }}
          style={[
            styles.dropDown,
            {
              borderColor: theme.themedColors.primaryColor,
              backgroundColor: theme.themedColors.primaryBackground
            },
            styles.dropdownWidthShort
          ]}
          textStyle={{
            color: theme.themedColors.interface["900"]
          }}
        />

        <AppDropdown
          title={"Month"}
          items={months}
          isLocked={isLocked}
          selectedItemCallback={(item) => {
            setFieldValue(
              name,
              moment(getDate(year, item.value, day), "YYYY-MM-DD").toDate()
            );
            selectedItem?.(item);
            setMonth(item.value);
            callback(getDate(year, item.value, day));
          }}
          style={[
            styles.dropDown,
            {
              borderColor: theme.themedColors.primaryColor,
              backgroundColor: theme.themedColors.primaryBackground
            },
            styles.dropdownWidthLong
          ]}
          textStyle={{
            color: theme.themedColors.interface["900"]
          }}
        />

        <AppDropdown
          title={"Day"}
          items={getDaysFromMonth(month)}
          isLocked={isLocked}
          selectedItemCallback={(item) => {
            selectedItem?.(item);
            setDay(item.value);
            setFieldValue(
              name,
              moment(
                getDate(year, month, item.value),
                "YYYY-MM-DD"
              ).toDate()
            );
            callback(getDate(year, month, item.text));
          }}
          style={[
            styles.dropDown,
            {
              borderColor: theme.themedColors.primaryColor,
              backgroundColor: theme.themedColors.primaryBackground
            },
            styles.dropdownWidthShort
          ]}
          textStyle={{
            color: theme.themedColors.interface["900"]
          }}
        />
      </View>

      {errors[name] && touched[name] && (
        <AppFormValidationLabel
          errorString={errors[name] as string}
          shouldVisible={true}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    paddingBottom: SPACE._2md
  },
  dropDown: {
    borderWidth: 1
  },
  dateOfBirthContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly"
    // alignSelf: "flex-start"
  },
  dropdownWidthLong: {
    width: Dimensions.get("screen").width / 3.6,
    marginLeft: SPACE._2xs,
    marginRight: SPACE.xs
  },
  dropdownWidthShort: {
    width: Dimensions.get("screen").width / 3.6
  },
  container: {
    marginTop: SPACE._2xl
  }
});
