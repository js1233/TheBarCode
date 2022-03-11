import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import React, { FC, useState } from "react";
import Screen from "ui/components/atoms/Screen";
import AppForm from "ui/components/molecules/app_form/AppForm";
import AppFormField from "ui/components/molecules/app_form/AppFormField";
import Strings from "config/Strings";
import AppFormSubmit from "ui/components/molecules/app_form/AppFormSubmit";
import { COLORS, FONT_SIZE, SPACE } from "config";
import { BUTTON_TYPES } from "ui/components/molecules/app_button/AppButton";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import { usePreferredTheme } from "hooks";
import * as Yup from "yup";
import { FormikValues } from "formik";
import { useAppSelector } from "hooks/redux";
import { RootState } from "stores/store";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Calendar from "assets/images/calendar.svg";
import moment from "moment";
import { AppFormDropDown } from "ui/components/molecules/app_form/AppFormDropDown";
import DownArrow from "assets/images/ic_down_arrow.svg";
import _ from "lodash";
import EIntBoolean from "models/enums/EIntBoolean";

type Props = {
  onSubmit: (_value: FormikValues) => void;
  shouldShowProgressBar: boolean;
  isOpenForSquareUp: boolean;
};
export const AddPaymentView: FC<Props> = ({
  onSubmit,
  isOpenForSquareUp,
  shouldShowProgressBar
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { regionData } = useAppSelector(
    (state: RootState) => state.general
  );
  let schema = {
    cardNumber: Yup.string()
      .required(Strings.AddAPayment.cardNumber_validation_label)
      .min(16),
    expiry: Yup.string().required(
      Strings.AddAPayment.expiry_validation_label
    ),
    cvc: Yup.string()
      .min(3)
      .max(4)
      .required(Strings.AddAPayment.cvc_validation_label),
    name: Yup.string().required(Strings.AddAPayment.name_validation_label),
    address: Yup.string().required(
      Strings.AddAPayment.address_validation_label
    ),
    city: Yup.string().required(Strings.AddAPayment.city_validation_label),
    country: Yup.object().required(
      Strings.AddAPayment.country_validation_label
    ),
    postalcode: Yup.string()
      .optional()
      .test(
        "postalcode",
        Strings.AddAPayment.postcode_validation,
        (): boolean => {
          return true;
        }
      )
  };

  let validationSchema;
  if (isOpenForSquareUp) {
    validationSchema = Yup.object().shape(
      _.omit(schema, "cardNumber", "expiry", "cvc")
    );
  } else {
    validationSchema = Yup.object().shape(schema);
  }

  const [isInitialPickerActive, setIsInitialPickerActive] =
    useState(false);
  const [initialDate, setInitialDate] = useState<any>();

  const addPaymentInitialValues: any = {
    cardNumber: "",
    expiry: "",
    cvc: "",
    name: "",
    address: "",
    postalcode: "",
    city: "",
    country: ""
  };

  const { themedColors } = usePreferredTheme();

  const handleConfirm = (date: any) => {
    const monthAndYear = moment(date).format("MM / YYYY");
    setInitialDate(monthAndYear);
    setIsInitialPickerActive(false);
  };

  const minExpiryDate = new Date();

  const countryList = [
    { value: "England", text: "England" },
    { value: "Scotland", text: "Scotland" },
    { value: "Wales", text: "Wales" },
    { value: "Northern Ireland", text: "Northern Ireland" }
  ];

  const [cardNumber, setCardNumber] = useState({
    text: addPaymentInitialValues.cardNumber
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}>
      <Screen style={styles.container} shouldAddBottomInset={false}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}>
          <View style={[styles.formContainer]}>
            <AppForm
              initialValues={addPaymentInitialValues}
              onSubmit={onSubmit}
              validationSchema={validationSchema}>
              {!isOpenForSquareUp && (
                <>
                  <AppFormField
                    fieldTestID="cardNumber"
                    validationLabelTestID={"cardnoValidationLabel"}
                    name="cardNumber"
                    labelProps={{
                      text: Strings.AddAPayment.card_number_label
                    }}
                    customTextChanged={(value: string) => {
                      // if (event.key) {
                      let _value = value
                        .replace(/\W/gi, "")
                        .replace(/(.{4})/g, "$1 ");

                      setCardNumber({
                        text: _value.trim()
                      });
                      //}
                    }}
                    fieldInputProps={{
                      value: cardNumber.text,
                      returnKeyType: "next",
                      placeholder:
                        Strings.AddAPayment.card_number_placeholder,
                      autoCapitalize: "none",
                      placeholderTextColor: themedColors.placeholderColor,
                      style: {
                        color: themedColors.interface["900"]
                      },
                      viewStyle: [styles.textFieldStyle],
                      keyboardType: "number-pad"
                    }}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-evenly",
                      flex: 1,
                      marginTop: SPACE.md
                    }}>
                    <Pressable
                      onTouchStart={() => {
                        Keyboard.dismiss();
                        setIsInitialPickerActive(true);
                      }}
                      style={styles.flexContainer}>
                      <AppFormField
                        fieldTestID="expiry"
                        validationLabelTestID={"expiryValidationLabel"}
                        name="expiry"
                        labelProps={{
                          text: Strings.AddAPayment.expiry_label
                        }}
                        isLocked={EIntBoolean.TRUE}
                        fieldInputProps={{
                          value: initialDate
                            ? initialDate
                            : addPaymentInitialValues.expiry,
                          returnKeyType: "next",
                          placeholder:
                            Strings.AddAPayment.expiry_label_placeholder,
                          autoCapitalize: "none",
                          placeholderTextColor:
                            themedColors.placeholderColor,
                          style: {
                            color: themedColors.interface["900"]
                          },
                          viewStyle: [styles.textFieldStyle],
                          rightIcon: () => (
                            <Calendar
                              stroke={COLORS.theme?.interface["500"]}
                            />
                          )
                        }}
                        isFieldInHorizontalContainer={true}
                      />
                    </Pressable>
                    <View
                      style={{
                        marginLeft: SPACE.lg,
                        flexGrow: 1,
                        flex: 0.5,
                        marginBottom: SPACE._2xl
                      }}>
                      <AppFormField
                        fieldTestID="cvc"
                        validationLabelTestID={"cvcValidationLabel"}
                        name="cvc"
                        labelProps={{
                          text: Strings.AddAPayment.cvc_label
                        }}
                        fieldInputProps={{
                          returnKeyType: "next",
                          placeholder:
                            Strings.AddAPayment.cvc_label_placeholder,
                          autoCapitalize: "none",
                          placeholderTextColor:
                            themedColors.placeholderColor,
                          style: {
                            color: themedColors.interface["900"]
                          },
                          viewStyle: [styles.textFieldStyle],
                          keyboardType: "number-pad"
                        }}
                        isFieldInHorizontalContainer={true}
                      />
                    </View>
                  </View>
                </>
              )}
              <AppLabel
                text={Strings.AddAPayment.billing_information}
                textType={TEXT_TYPE.BOLD}
                style={styles.headingStyle}
              />
              <AppFormField
                fieldTestID="name"
                validationLabelTestID={"nameValidationLabel"}
                name="name"
                labelProps={{
                  text: Strings.AddAPayment.name_label,
                  style: styles.nextField
                }}
                fieldInputProps={{
                  returnKeyType: "next",
                  placeholder: Strings.AddAPayment.name_placeholder_text,
                  autoCapitalize: "none",
                  placeholderTextColor: themedColors.placeholderColor,
                  style: {
                    color: themedColors.interface["900"]
                  },
                  viewStyle: [styles.textFieldStyle]
                }}
              />
              <AppFormField
                fieldTestID="address"
                validationLabelTestID={"addressValidationLabel"}
                name="address"
                labelProps={{
                  text: Strings.AddAPayment.address_label,
                  style: styles.nextField
                }}
                fieldInputProps={{
                  returnKeyType: "next",
                  placeholder: Strings.AddAPayment.address_placeholdertext,
                  autoCapitalize: "none",
                  placeholderTextColor: themedColors.placeholderColor,
                  style: {
                    color: themedColors.interface["900"]
                  },
                  viewStyle: [styles.textFieldStyle]
                }}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  flex: 1,
                  marginTop: SPACE.md
                }}>
                <View style={styles.flexContainer}>
                  <AppFormField
                    fieldTestID="postalcode"
                    validationLabelTestID={"postalcodeValidationLabel"}
                    name="postalcode"
                    labelProps={{
                      text: Strings.AddAPayment.postal_code_label
                    }}
                    fieldInputProps={{
                      returnKeyType: "next",
                      placeholder:
                        Strings.AddAPayment.postal_code_placeholder,
                      autoCapitalize: "none",
                      placeholderTextColor: themedColors.placeholderColor,
                      style: {
                        color: themedColors.interface["900"]
                      },
                      viewStyle: [styles.textFieldStyle]
                    }}
                    isFieldInHorizontalContainer={true}
                  />
                </View>
                <View
                  style={{
                    marginLeft: SPACE.lg,
                    flexGrow: 1,
                    flex: 0.5
                  }}>
                  <AppFormField
                    fieldTestID="city"
                    validationLabelTestID={"cityValidationLabel"}
                    name="city"
                    labelProps={{
                      text: Strings.AddAPayment.city_label
                    }}
                    fieldInputProps={{
                      returnKeyType: "next",
                      placeholder: Strings.AddAPayment.city_placeholder,
                      autoCapitalize: "none",
                      placeholderTextColor: themedColors.placeholderColor,
                      style: {
                        color: themedColors.interface["900"]
                      },
                      viewStyle: [styles.textFieldStyle]
                    }}
                    isFieldInHorizontalContainer={true}
                  />
                </View>
              </View>
              <AppFormDropDown
                name="country"
                validationLabelTestID={"countryValidationLabel"}
                labelProps={{
                  text: Strings.AddAPayment.country_label,
                  style: [styles.nextField]
                }}
                appDropDownProps={{
                  shouldShowCustomIcon: true,
                  title: Strings.AddAPayment.country_placeholder_text,
                  items: countryList,
                  selectedItemCallback: () => {
                    //setTitle(item.title);
                  },
                  dropDownIcon: () => (
                    <DownArrow
                      width={12}
                      height={12}
                      fill={COLORS.theme?.interface["500"]}
                    />
                  ),
                  style: [
                    styles.textFieldStyle,
                    {
                      backgroundColor: COLORS.theme?.primaryBackground,
                      borderColor: COLORS.theme?.borderColor
                    }
                  ]
                }}
              />
              <AppFormSubmit
                text={Strings.AddAPayment.onSubmitAddButton}
                buttonType={BUTTON_TYPES.NORMAL}
                textType={TEXT_TYPE.BOLD}
                shouldShowProgressBar={shouldShowProgressBar}
                textStyle={[styles.btn]}
                buttonStyle={styles.onSubmitBtn}
              />
            </AppForm>
          </View>
          <DateTimePickerModal
            isVisible={isInitialPickerActive}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={() => setIsInitialPickerActive(false)}
            minimumDate={minExpiryDate}
          />
        </ScrollView>
      </Screen>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.theme?.interface["100"]
  },
  headingStyle: {
    fontSize: FONT_SIZE.base
  },
  formContainer: {
    marginHorizontal: SPACE.lg,
    marginBottom: SPACE.lg
  },
  flexContainer: {
    flexDirection: "column",
    flexWrap: "nowrap",
    flexGrow: 1,
    flex: 0.5
  },
  textFieldStyle: {
    borderWidth: 1
  },
  scrollViewContent: {
    flexGrow: 1,
    flexDirection: "column",
    paddingVertical: SPACE._2xl
  },
  btn: { color: COLORS.theme?.secondaryBackground },
  nextField: { marginTop: SPACE.lg },
  onSubmitBtn: { marginTop: SPACE._3xl }
});
