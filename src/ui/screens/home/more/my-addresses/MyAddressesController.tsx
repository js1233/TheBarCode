import { MyAddressesView } from "./MyAddressesView";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState
} from "react";
import {
  RouteProp,
  useNavigation,
  useRoute
} from "@react-navigation/native";
import HeaderTitle from "ui/components/headers/header_title/HeaderTitle";
import HeaderLeftTextWithIcon from "ui/components/headers/header_left_text_with_icon/HeaderLeftTextWithIcon";
import Strings from "config/Strings";
import Cross from "assets/images/ic_cross.svg";
import { StackNavigationProp } from "@react-navigation/stack";
import { HomeStackParamList } from "routes/HomeStack";
import { LinkButton } from "ui/components/atoms/link_button/LinkButton";
import { TEXT_TYPE } from "ui/components/atoms/app_label/AppLabel";
import {
  useAddressApi,
  useAddressPaginatedApis
} from "repo/addresses/AddressesApis";
import { FONT_SIZE, SPACE } from "config/Dimens";
import _ from "lodash";
import { Address } from "models/Address";
import { useAppDispatch } from "hooks/redux";
import {
  consumeRefreshCount,
  setRefreshingEvent
} from "stores/generalSlice";

type AddressesNavigationProp = StackNavigationProp<
  HomeStackParamList,
  "Addresses"
>;
type MyPaymentScreenProp = RouteProp<HomeStackParamList, "Addresses">;

const MyAdressesController = () => {
  const navigation = useNavigation<AddressesNavigationProp>();
  const [addresses, setAddresses] = useState<Address[] | undefined>(
    undefined
  );
  const route = useRoute<MyPaymentScreenProp>();
  const { request: deleteAddress, loading } =
    useAddressApi().deleteAddress;
  const [addressItemIndex, setAddressItemIndex] = useState<number>(-1);
  const dispatch = useAppDispatch();

  const {
    isLoading,
    request: fetchAddresses,
    isAllDataLoaded,
    onEndReached,
    onPullToRefresh
  } = useAddressPaginatedApis(setAddresses).addresses;

  const onDeleteAddress = async (id: number, index: number) => {
    setAddressItemIndex(index ?? -1);
    const { hasError, dataBody } = await deleteAddress(id);
    if (!hasError && dataBody !== undefined) {
      const filteredArray = addresses?.filter((item) => item.id !== id);
      setAddresses(filteredArray);
      fetchAddresses();
    }
  };

  const onAddressUpdate = useCallback(
    (newAddress: Address) => {
      const findItem = addresses?.find(
        (item) => item.id === newAddress.id
      );
      if (findItem) {
        setAddresses((prev) => {
          let copiedData = _.cloneDeep(prev);
          if (copiedData) {
            let findIndex = copiedData.findIndex(
              (item) => item.id === newAddress.id
            );
            copiedData.splice(findIndex, 1, newAddress);
            return copiedData;
          }
          return prev;
        });
      } else {
        setAddresses((prev) => {
          if (prev) {
            return [newAddress, ...prev];
          } else {
            return [newAddress];
          }
        });
      }
    },
    [addresses]
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <HeaderTitle
          text={Strings.Addresses.title}
          shouldTruncate={false}
        />
      ),
      headerLeft: () => (
        <HeaderLeftTextWithIcon
          onPress={() => navigation.pop()}
          icon={() => <Cross width={20} height={20} fill={"#737373"} />}
        />
      ),
      headerRight: () => {
        return (
          <LinkButton
            textType={TEXT_TYPE.SEMI_BOLD}
            numberOfLines={0}
            text={Strings.Addresses.rightButton}
            textStyle={{ fontSize: FONT_SIZE.sm }}
            viewStyle={{ marginRight: SPACE.xs }}
            onPress={() =>
              navigation.navigate("AddAndEditAddress", {
                onAddressUpdate: onAddressUpdate
              })
            }
          />
        );
      }
    });
  }, [navigation, onAddressUpdate]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const openEditAddress = (address: Address) => {
    navigation.navigate("AddAndEditAddress", {
      address: address,
      onAddressUpdate: onAddressUpdate
    });
  };

  const selectAddress = (address: Address) => {
    dispatch(
      setRefreshingEvent({
        DELIVERY_ADDRESS_UPDATE: {
          address: address
        }
      })
    );

    navigation.pop();

    setTimeout(() => {
      dispatch(consumeRefreshCount());
    }, 500);
  };

  return (
    <MyAddressesView
      shouldShowProgressBar={isLoading}
      isAllDataLoaded={isAllDataLoaded}
      onEndReached={onEndReached}
      onPullToRefresh={onPullToRefresh}
      data={addresses!}
      onDeleteAddress={onDeleteAddress}
      addressItemIndex={addressItemIndex}
      openEditAddress={openEditAddress}
      selectAddress={selectAddress}
      shouldShowProgressBarOnDelete={loading}
      showSelectAddressBtn={route?.params?.isOpenFromOrderType === true}
    />
  );
};

export default MyAdressesController;
