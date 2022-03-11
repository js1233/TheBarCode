import { useNavigation, useRoute } from "@react-navigation/native";
import {
  StackNavigationProp,
  StackScreenProps
} from "@react-navigation/stack";
import Strings from "config/Strings";
import React, { useLayoutEffect, useState } from "react";
import { HomeStackParamList } from "routes/HomeStack";
import HeaderLeftTextWithIcon from "ui/components/headers/header_left_text_with_icon/HeaderLeftTextWithIcon";
import HeaderTitle from "ui/components/headers/header_title/HeaderTitle";
import { AddAndAddressAddressView } from "./AddAndEditAddressView";
import LeftArrow from "assets/images/left.svg";
import { SPACE } from "config";
import { FormikValues } from "formik";
import SimpleToast from "react-native-simple-toast";
import { useAddressApi } from "repo/addresses/AddressesApis";
import { AddAddressRequestModel } from "models/api_requests/AddAddressRequestModel";
import { usePreventDoubleTap } from "hooks";

export type AddAndEditAddressNavigationProp = StackNavigationProp<
  HomeStackParamList,
  "AddAndEditAddress"
>;
type AddAndEditAddressProp = StackScreenProps<
  HomeStackParamList,
  "AddAndEditAddress"
>;

const AddAndEditAddressController = () => {
  const { request: addAddressRequest } = useAddressApi().addAddress;
  const { request: editAddressRequest } = useAddressApi().editAddress;

  const navigation = useNavigation<AddAndEditAddressNavigationProp>();

  const [showPb, setShowPb] = useState<boolean>(false);

  const { address, onAddressUpdate } = useRoute<
    AddAndEditAddressProp["route"]
  >().params ?? {
    address: undefined,
    onAddressUpdate: undefined
  };

  const onBackButtonPressed = usePreventDoubleTap(() => {
    navigation.pop();
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <HeaderTitle
          text={
            address ? Strings.EditAddress.title : Strings.AddAddress.title
          }
          shouldTruncate={false}
        />
      ),
      headerLeft: () => (
        <HeaderLeftTextWithIcon
          icon={() => <LeftArrow />}
          onPress={onBackButtonPressed}
          containerStyle={{ marginLeft: SPACE.lg }}
        />
      )
    });
  }, [address, navigation, onBackButtonPressed]);

  const onSubmit = async (_value: FormikValues) => {
    if (showPb) {
      return;
    }

    const request: AddAddressRequestModel = {
      title: _value.title,
      address: _value.address,
      city: _value.city,
      longitude: _value.longitude,
      latitude: _value.latitude,
      post_code: _value.post_code,
      optional_note: _value.optional_note
    };
    setShowPb(true);
    const { hasError, dataBody, errorBody } = await addAddressRequest(
      request
    );
    if (!hasError && dataBody !== undefined) {
      SimpleToast.show(dataBody.message);
      onAddressUpdate?.(dataBody.data);
      navigation.pop();
    } else {
      SimpleToast.show(errorBody!);
    }

    setShowPb(false);
  };

  const onUpdate = async (_value: FormikValues) => {
    if (showPb) {
      return;
    }
    const request: AddAddressRequestModel = {
      id: address?.id,
      title: _value.title,
      address: _value.address,
      city: _value.city,
      longitude: _value.longitude,
      latitude: _value.latitude,
      post_code: _value.post_code,
      optional_note: _value.optional_note
    };

    setShowPb(true);

    const { hasError, dataBody, errorBody } = await editAddressRequest(
      request
    );
    if (!hasError && dataBody !== undefined) {
      SimpleToast.show(dataBody.message);
      onAddressUpdate?.(dataBody.data);
      navigation.pop();
    } else {
      SimpleToast.show(
        errorBody ?? Strings.common.some_thing_bad_happened
      );
    }

    setShowPb(false);
  };

  const onButtonClick = (values: FormikValues) => {
    address ? onUpdate(values) : onSubmit(values);
  };

  return (
    <AddAndAddressAddressView
      shouldShowProgressBar={showPb}
      onSubmit={onButtonClick}
      addressData={address}
      preFilledRequestModel={address}
    />
  );
};

export default AddAndEditAddressController;
