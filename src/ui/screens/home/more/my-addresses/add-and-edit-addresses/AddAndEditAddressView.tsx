import { COLORS, SPACE } from "config";
import Strings from "config/Strings";
import { FormikValues } from "formik";
import { usePreferredTheme, usePreventDoubleTap } from "hooks";
import React, { FC, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Location } from "react-native-get-location";
import MapView, { LatLng, PROVIDER_GOOGLE } from "react-native-maps";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import Screen from "ui/components/atoms/Screen";
import { BUTTON_TYPES } from "ui/components/molecules/app_button/AppButton";
import AppForm from "ui/components/molecules/app_form/AppForm";
import AppFormField from "ui/components/molecules/app_form/AppFormField";
import { AppFormSubmit } from "ui/components/molecules/app_form/AppFormSubmit";
import usePermission from "ui/screens/auth/location_permission/usePermission";
import * as Yup from "yup";
import ICLocation from "assets/images/ic_location.svg";
import { useAppSelector } from "hooks/redux";
import { RootState } from "stores/store";
import { Address } from "models/Address";
import SimpleToast from "react-native-simple-toast";
import { useNavigation } from "@react-navigation/native";
import { AddAndEditAddressNavigationProp } from "./AddAndEditAddressController";
import { Keyboard } from "react-native";

type Props = {
  shouldShowProgressBar: boolean;
  onSubmit: (_value: FormikValues) => void;
  addressData: Address | undefined;
  preFilledRequestModel: Address | undefined;
};
export const AddAndAddressAddressView: FC<Props> = ({
  shouldShowProgressBar,
  onSubmit,
  addressData,
  preFilledRequestModel
}) => {
  const navigation = useNavigation<AddAndEditAddressNavigationProp>();

  let addressInitialValues = {
    address: preFilledRequestModel?.address ?? "",
    post_code: preFilledRequestModel?.post_code ?? "",
    city: preFilledRequestModel?.city ?? "",
    optional_note: preFilledRequestModel?.optional_note ?? ""
  };

  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: addressData?.latitude ?? 52.705674,
    longitude: addressData?.longitude ?? -2.480438
  });
  const [address, setAddress] = useState(addressData?.address);
  const [postalCode, setPostalCode] = useState(addressData?.post_code);
  const [city, setCity] = useState(addressData?.city);
  const [title, setTitle] = useState(
    addressData ? addressData.title : "Home"
  );

  const [enableRegion, setEnableRegion] = useState<boolean>(
    addressData === undefined
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { regionData } = useAppSelector(
    (state: RootState) => state.general
  );

  const mapRef = useRef<any>(null);
  const { themedColors } = usePreferredTheme();

  let schema = {
    address: Yup.string().required(Strings.AddAddress.address_validation),
    city: Yup.string().required(Strings.AddAddress.city_validation),
    post_code: Yup.string()
      .required(Strings.AddAddress.postcode_validation)
      .test(
        "post_code",
        Strings.signUp.postcode_validation,
        (): boolean => {
          return true;
        }
      )
  };

  const validationSchema = Yup.object().shape(schema);

  const onLocationDenied = () => {
    SimpleToast.show("Permisson Denied");
    navigation.goBack();
  };

  const onLocationGranted = (_location?: Location) => {
    if (_location) {
      setLocation({
        latitude: _location.latitude,
        longitude: _location.longitude
      });

      getAddress({
        latitude: _location.latitude,
        longitude: _location.longitude
      })
        .then()
        .catch();

      setEnableRegion(false);
    }
  };

  const { askPermission } = usePermission(
    onLocationGranted,
    onLocationDenied
  );

  const getAddress = async (_region?: any) => {
    const completeAddress = await mapRef.current?.addressForCoordinate({
      latitude: _region.latitude,
      longitude: _region.longitude
    } as LatLng);

    const name = completeAddress.name !== null ? completeAddress.name : "";
    const subLocality =
      completeAddress.subLocality !== null
        ? completeAddress.subLocality + ", "
        : "";
    const locality =
      completeAddress.locality !== null
        ? completeAddress.locality + ", "
        : "";
    const administrativeArea =
      completeAddress.administrativeArea !== null
        ? completeAddress.administrativeArea + ","
        : "";
    const country =
      completeAddress.country !== null ? completeAddress.country : "";
    setAddress(
      name +
        " " +
        subLocality +
        "" +
        locality +
        "" +
        administrativeArea +
        "" +
        country
    );
    setPostalCode(completeAddress.postalCode);
    setCity(completeAddress.locality);
    setLocation({
      latitude: _region.latitude,
      longitude: _region.longitude
    });
  };

  const _onSubmit = usePreventDoubleTap((_values: FormikValues) => {
    onSubmit({
      ..._values,
      title: title,
      latitude: location.latitude,
      longitude: location.longitude
    });
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={60}
      style={{ flexGrow: 1 }}>
      <Screen
        style={styles.container}
        requiresExplicitPadding={false}
        bottomSafeAreaColor={COLORS.theme?.secondaryBackground}>
        <ScrollView
          style={styles.scrollView}
          keyboardShouldPersistTaps={"handled"}
          contentContainerStyle={styles.scrollViewContent}>
          <View style={{ flex: 1 }}>
            <MapView
              provider={Platform.OS === "android" ? PROVIDER_GOOGLE : null}
              ref={(ref) => {
                mapRef.current = ref;
              }}
              style={styles.map}
              initialRegion={{
                latitude: location?.latitude,
                longitude: location?.longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121
              }}
              region={
                !addressData && enableRegion
                  ? {
                      latitude: location?.latitude,
                      longitude: location?.longitude,
                      latitudeDelta: 0.015,
                      longitudeDelta: 0.0121
                    }
                  : undefined
              }
              showsUserLocation={true}
              showsCompass={true}
              toolbarEnabled={false}
              showsMyLocationButton={true}
              userLocationCalloutEnabled={true}
              onMapReady={async () => {
                if (!addressData) {
                  askPermission();
                }
              }}
              onPress={() => Keyboard.dismiss()}
              onRegionChangeComplete={(region) => {
                if (
                  region.latitude.toFixed(5) !==
                    location.latitude.toFixed(5) &&
                  region.longitude.toFixed(5) !==
                    location.longitude.toFixed(5)
                ) {
                  getAddress(region);
                }
              }}
            />

            <View
              style={{
                position: "absolute",
                height: 25,
                width: 25,
                alignSelf: "center",
                alignContent: "center",
                zIndex: 1,
                top: 180
              }}>
              <ICLocation width={25} />
            </View>
          </View>
          <View style={[styles.formContainer]}>
            <AppForm
              initialValues={addressInitialValues}
              onSubmit={_onSubmit}
              validationSchema={validationSchema}>
              <AppFormField
                fieldTestID="address"
                validationLabelTestID={"addressValidationLabel"}
                name="address"
                labelProps={{
                  text: Strings.AddAddress.address_label
                }}
                fieldInputProps={{
                  value: address,
                  returnKeyType: "next",
                  autoCapitalize: "none",
                  placeholder: Strings.AddAddress.address_placeholder_text,
                  placeholderTextColor: themedColors.placeholderColor,
                  style: {
                    color: themedColors.interface["900"]
                  },
                  viewStyle: [styles.textFieldStyle]
                }}
                customTextChanged={setAddress}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  flex: 1
                }}>
                <View
                  style={{
                    flexDirection: "column",
                    flexWrap: "nowrap",
                    flexGrow: 1,
                    flex: 0.5
                  }}>
                  <AppFormField
                    fieldTestID="post_code"
                    validationLabelTestID={"post_codeValidationLabel"}
                    name="post_code"
                    labelProps={{
                      text: Strings.AddAddress.postal_label,
                      style: styles.nextField
                    }}
                    fieldInputProps={{
                      value: postalCode,
                      returnKeyType: "next",
                      autoCapitalize: "characters",
                      placeholder:
                        Strings.AddAddress.post_code_placeholder_text,
                      placeholderTextColor: themedColors.placeholderColor,
                      style: {
                        color: themedColors.interface["900"]
                      },
                      viewStyle: [styles.textFieldStyle, { height: 44 }]
                    }}
                    customTextChanged={setPostalCode}
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
                      text: Strings.AddAddress.city_label,
                      style: styles.nextField
                    }}
                    fieldInputProps={{
                      value: city,
                      autoCapitalize: "none",
                      returnKeyType: "next",
                      placeholder:
                        Strings.AddAddress.city_placeholder_text,
                      placeholderTextColor: themedColors.placeholderColor,
                      style: {
                        color: themedColors.interface["900"]
                      },
                      viewStyle: [styles.textFieldStyle]
                    }}
                    customTextChanged={setCity}
                    isFieldInHorizontalContainer={true}
                  />
                </View>
              </View>
              <AppFormField
                fieldTestID="note"
                validationLabelTestID={"noteValidationLabel"}
                name="optional_note"
                labelProps={{
                  text: Strings.AddAddress.note_label,
                  style: styles.nextField
                }}
                fieldInputProps={{
                  returnKeyType: "next",
                  placeholder: Strings.AddAddress.note_placeholder_text,
                  autoCapitalize: "none",
                  placeholderTextColor: themedColors.placeholderColor,
                  style: {
                    color: themedColors.interface["900"]
                  },
                  viewStyle: [styles.textFieldStyle]
                }}
              />

              <View style={styles.titlebutton}>
                <TouchableOpacity
                  onPress={() => {
                    setTitle("Home");
                  }}
                  style={
                    title === "Home"
                      ? styles.selectedButton
                      : styles.unselectable
                  }>
                  <AppLabel
                    text={"Home"}
                    style={
                      title === "Home"
                        ? styles.appLabel
                        : styles.selectedAppLabel
                    }
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setTitle("Work");
                  }}
                  style={
                    title === "Work"
                      ? styles.selectedButton
                      : styles.unselectable
                  }>
                  <AppLabel
                    text={"Work"}
                    style={
                      title === "Work"
                        ? styles.appLabel
                        : styles.selectedAppLabel
                    }
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setTitle("Other");
                  }}
                  style={
                    title === "Other"
                      ? styles.selectedButton
                      : styles.unselectable
                  }>
                  <AppLabel
                    text={"Other"}
                    style={
                      title === "Other"
                        ? styles.appLabel
                        : styles.selectedAppLabel
                    }
                  />
                </TouchableOpacity>
              </View>

              <AppFormSubmit
                text={
                  addressData
                    ? Strings.EditAddress.edit_button
                    : Strings.AddAddress.add_button
                }
                buttonType={BUTTON_TYPES.NORMAL}
                textType={TEXT_TYPE.BOLD}
                isDisable={shouldShowProgressBar}
                shouldShowProgressBar={shouldShowProgressBar}
                textStyle={[styles.btn]}
                buttonStyle={styles.addAddress}
              />
            </AppForm>
          </View>
        </ScrollView>
      </Screen>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1
  },
  appLabel: {
    textAlign: "center",
    color: "white"
  },
  selectedAppLabel: {
    textAlign: "center",
    color: COLORS.theme?.primaryShade[700]
  },
  titlebutton: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  unselectable: {
    borderRadius: 20,
    borderColor: "#D4D4D4",
    borderWidth: 1,
    padding: SPACE.xs,
    marginTop: SPACE.lg,
    width: 90,
    backgroundColor: "white"
  },
  selectedButton: {
    borderRadius: 20,
    borderColor: "#D4D4D4",
    borderWidth: 1,
    padding: SPACE.xs,
    marginTop: SPACE.lg,
    width: 90,
    backgroundColor: COLORS.theme?.primaryShade[700]
  },
  left: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  list: { height: "auto", marginTop: SPACE.sm },
  itemContainerStyle: {
    width: "100%"
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.theme?.interface["100"]
  },
  map: {
    height: 400
  },
  formContainer: {
    marginHorizontal: SPACE.lg,
    marginTop: SPACE.lg
  },
  textFieldStyle: {
    borderWidth: 1
  },
  scrollViewContent: {
    flexGrow: 1
  },
  btn: { color: COLORS.theme?.secondaryBackground },
  nextField: { marginTop: SPACE.lg },
  addAddress: { marginTop: SPACE._3xl, marginBottom: SPACE.lg },
  flexContainer: { flex: 1, marginEnd: SPACE.lg }
});
