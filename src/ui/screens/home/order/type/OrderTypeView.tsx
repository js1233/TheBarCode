import React, { FC, useCallback, useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View
} from "react-native";
import Screen from "ui/components/atoms/Screen";
import { COLORS, FONT_SIZE, SPACE } from "config";
import {
  ScrollView,
  TouchableOpacity
} from "react-native-gesture-handler";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import Strings from "config/Strings";
import RadioButtonActive from "assets/images/radio-btn-active.svg";
import RadioButtonInActive from "assets/images/radio-btn-inactive.svg";
import Separator, { Type } from "ui/components/atoms/separator/Separator";
import { AppInputField } from "ui/components/molecules/appinputfield/AppInputField";
import { useAppDispatch, useAppSelector } from "hooks/redux";
import { RootState } from "stores/store";
import SimpleToast from "react-native-simple-toast";
import { AppButton } from "ui/components/molecules/app_button/AppButton";
import EScreen from "models/enums/EScreen";
import { AppLog, Price, TAG } from "utils/Util";
import { Address } from "models/Address";
import { CreateOrderRequestModel } from "models/api_requests/CreateOrderRequestModel";
import OrderSummary from "ui/components/organisms/order_summary/OrderSummary";
import {
  calculateDeliveryCharges,
  checkoutPrice,
  isOrderTypeSupported,
  Order
} from "models/Order";
import EOrderType from "models/enums/EOrderType";
import { usePreventDoubleTap } from "hooks";
import EPosType from "models/enums/EPosType";
import { setUser } from "stores/authSlice";

type Props = {
  openAddressesScreen: () => void;
  createOrder: (requestModel: CreateOrderRequestModel) => void;
  loading: boolean;
  order: Order | undefined;
};

export const OrderTypeView: FC<Props> = ({
  openAddressesScreen,
  createOrder,
  loading,
  order
}) => {
  const { refreshingEvent } = useAppSelector(
    (state: RootState) => state.general
  );
  const { user } = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();

  const { selectedCart } = useAppSelector(
    (state: RootState) => state.order
  );
  const [comments, setComments] = useState<string>();
  const [selectedType, setSelectedType] = useState<number>(-1);
  const [isAddressDefault, setAddressDefault] = useState<boolean>(true);
  const [deliveryAddress, setDeliveryAddress] = useState<
    Address | undefined
  >(user?.default_address ?? undefined);
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>(
    user?.delivery_contact
  );
  const [tableNumber, setTableNumber] = useState<number | undefined>(
    undefined
  );
  const [tip, setTip] = useState<string | undefined>("");

  const setSelectedOrderType = useCallback((index: number) => {
    setSelectedType(index);
  }, []);

  const getRadioButton = (index: number) => {
    return selectedType === index ? (
      <RadioButtonActive stroke={COLORS.theme?.borderColor} />
    ) : (
      <RadioButtonInActive stroke={COLORS.theme?.borderColor} />
    );
  };

  useEffect(() => {
    if (isOrderTypeSupported(EOrderType.DINE_IN, selectedCart!)) {
      setSelectedType(0);
    } else if (
      isOrderTypeSupported(EOrderType.COLLECTION, selectedCart!)
    ) {
      setSelectedType(1);
    } else if (isOrderTypeSupported(EOrderType.TAKE_AWAY, selectedCart!)) {
      setSelectedType(2);
    } else if (isOrderTypeSupported(EOrderType.DELIVERY, selectedCart!)) {
      setSelectedType(3);
    }
  }, [selectedCart]);

  //Handle event from refreshing api event
  useEffect(() => {
    if (
      refreshingEvent?.DELIVERY_ADDRESS_UPDATE &&
      refreshingEvent?.DELIVERY_ADDRESS_UPDATE?.address
    ) {
      AppLog.log(
        () =>
          "Refreshing Event => OrderTypeView " +
          JSON.stringify(
            refreshingEvent?.DELIVERY_ADDRESS_UPDATE?.address
          ),
        TAG.REFRESHING_EVENT
      );

      setDeliveryAddress(
        refreshingEvent?.DELIVERY_ADDRESS_UPDATE?.address
      );
      let updatedUser = { ...user };
      updatedUser!.default_address =
        refreshingEvent?.DELIVERY_ADDRESS_UPDATE?.address;
      dispatch(setUser(updatedUser));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshingEvent]);

  const shouldShowOrderType = (type: EOrderType): boolean => {
    return isOrderTypeSupported(type, selectedCart!);
  };

  const arePreRequisiteMet = usePreventDoubleTap(() => {
    let requestModel: CreateOrderRequestModel = {
      cart_id: selectedCart!.id!.toString(),
      type:
        selectedType === 0
          ? EOrderType.DINE_IN
          : selectedType === 1
          ? EOrderType.COLLECTION
          : selectedType === 2
          ? EOrderType.TAKE_AWAY
          : EOrderType.DELIVERY,
      comment: comments ?? ""
    };

    switch (selectedType) {
      case 0: //dine in
        if (!tableNumber || tableNumber <= 0) {
          SimpleToast.show("Table number field is required");
          break;
        } else if (Number(tip) === 0 && tip !== "") {
          SimpleToast.show("Tip should be greater than 0");
          break;
        } else if (tip && tip.split(".")[0].length > 5) {
          SimpleToast.show("Tip should not be greater than 5 digits");
          break;
        } else {
          requestModel.table_no = tableNumber?.toString();
          requestModel.order_tip = tip;
          createOrder(requestModel);
          break;
        }
      case 1: //counter collection
        if (Number(tip) === 0 && tip !== "") {
          SimpleToast.show("Tip should be greater than 0");
          break;
        } else if (tip && tip.split(".")[0].length > 5) {
          SimpleToast.show("Tip should not be greater than 5 digits");
          break;
        } else {
          requestModel.order_tip = tip;
          createOrder(requestModel);
          break;
        }
      case 2: //takeaway
        if (!phoneNumber) {
          SimpleToast.show("Phone number field is required");
          break;
        }
        requestModel.contact_number = phoneNumber;

        let _updatedUser = { ...user };
        _updatedUser!.delivery_contact = phoneNumber;
        dispatch(setUser(_updatedUser));

        createOrder(requestModel);
        break;
      case 3: //delivery
        if (!deliveryAddress) {
          SimpleToast.show("Delivery address is required");
          break;
        } else if (!phoneNumber) {
          SimpleToast.show("Phone number field is required");
          break;
        } else {
          requestModel.save_delivery_contact = isAddressDefault
            ? "true"
            : "false";
          requestModel.contact_number = phoneNumber;

          deliveryAddress &&
            (requestModel.address_id = deliveryAddress?.id?.toString());

          let _user = { ...user };
          _user!.delivery_contact = phoneNumber;
          dispatch(setUser(_user));

          createOrder(requestModel);
          break;
        }
      default:
        break;
    }
  });

  const validateDecimal = (digit: string) => {
    return digit.indexOf(".") > 0
      ? digit.split(".").length >= 2
        ? digit.split(".")[0] + "." + digit.split(".")[1].substring(-1, 2)
        : digit
      : digit;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={60}
      style={{ flex: 1 }}>
      <Screen
        style={styles.container}
        shouldAddBottomInset={true}
        bottomSafeAreaColor={COLORS.theme?.interface["50"]}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {selectedCart && (
            <View style={{ marginBottom: SPACE._2xl }}>
              <OrderSummary
                order={selectedCart}
                eScreen={EScreen.ORDER_TYPE}
                showMenuItem={true}
              />
            </View>
          )}

          <AppLabel
            text={Strings.orderType.order_type}
            style={styles.selectOrder}
            textType={TEXT_TYPE.BOLD}
          />

          {/* Table Service */}
          {shouldShowOrderType(EOrderType.DINE_IN) && (
            <View
              style={[
                styles.tableService,
                {
                  backgroundColor:
                    COLORS.theme?.interface[
                      selectedType !== 0 ? "200" : "100"
                    ]
                }
              ]}>
              <Pressable
                style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1.0 }]}
                onPress={() => {
                  setSelectedOrderType(0);
                }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between"
                  }}>
                  <AppLabel
                    text={Strings.orderType.table_Service}
                    style={styles.selectOrder}
                    textType={TEXT_TYPE.SEMI_BOLD}
                  />

                  {getRadioButton(0)}
                </View>
                {selectedType === 0 && (
                  <>
                    <View style={{ marginBottom: SPACE.md }} />
                    <Separator
                      type={Type.HORIZONTAL}
                      color={COLORS.white}
                      thickness={1}
                    />
                    <View style={[styles.textfieldsContainer]}>
                      <View
                        style={{
                          flex:
                            order?.epos_type !== EPosType.SQUARE_UP
                              ? 0.48
                              : 1
                        }}>
                        <AppLabel
                          text={Strings.orderType.table_number}
                          style={styles.selectOrder}
                          textType={TEXT_TYPE.SEMI_BOLD}
                        />

                        <AppInputField
                          viewStyle={[styles.inputFieldContainer]}
                          placeholder={
                            Strings.orderType.enter_table_number
                          }
                          style={{ marginLeft: -3 }}
                          placeholderTextColor={
                            COLORS.theme?.interface["500"]
                          }
                          onChangeText={(text) =>
                            setTableNumber(Number(text))
                          }
                          keyboardType="number-pad"
                        />
                      </View>
                      {order?.epos_type !== EPosType.SQUARE_UP && (
                        <View
                          style={{ flex: 0.48, marginTop: SPACE._2md }}>
                          <AppLabel
                            text={"Would you like to leave a tip?"}
                            style={styles.selectOrder}
                            textType={TEXT_TYPE.SEMI_BOLD}
                          />

                          <AppInputField
                            viewStyle={[styles.inputFieldContainer]}
                            placeholder={
                              selectedCart?.establishment.region
                                .currency_symbol
                            }
                            placeholderTextColor={
                              COLORS.theme?.interface["500"]
                            }
                            value={tip}
                            onChangeText={(text) =>
                              setTip(validateDecimal(text))
                            }
                            keyboardType="number-pad"
                          />
                        </View>
                      )}
                    </View>
                  </>
                )}
              </Pressable>
            </View>
          )}
          {/* Table Service */}

          {/* Counter Collection */}
          {shouldShowOrderType(EOrderType.COLLECTION) && (
            <View
              style={[
                styles.tableService,
                {
                  backgroundColor:
                    COLORS.theme?.interface[
                      selectedType !== 1 ? "200" : "100"
                    ]
                }
              ]}>
              <Pressable
                style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1.0 }]}
                onPress={() => {
                  setSelectedOrderType(1);
                }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between"
                  }}>
                  <AppLabel
                    text={Strings.orderType.counter_collection}
                    style={styles.selectOrder}
                    textType={TEXT_TYPE.SEMI_BOLD}
                  />
                  {getRadioButton(1)}
                </View>
              </Pressable>
              {selectedType === 1 &&
                order?.epos_type !== EPosType.SQUARE_UP && (
                  <View style={{ paddingTop: SPACE._2md }}>
                    <Separator
                      type={Type.HORIZONTAL}
                      color={COLORS.white}
                      thickness={1}
                    />
                    <View style={{ paddingTop: SPACE._2md }}>
                      <AppLabel
                        text={"Would you like to leave a tip?"}
                        style={styles.selectOrder}
                        textType={TEXT_TYPE.SEMI_BOLD}
                      />

                      <AppInputField
                        viewStyle={[styles.inputFieldContainer]}
                        placeholder={
                          selectedCart?.establishment.region
                            .currency_symbol
                        }
                        placeholderTextColor={
                          COLORS.theme?.interface["500"]
                        }
                        value={tip}
                        onChangeText={(text) =>
                          setTip(validateDecimal(text))
                        }
                        keyboardType="number-pad"
                      />
                    </View>
                    {selectedCart?.establishment.collection_note && (
                      <AppLabel
                        numberOfLines={0}
                        text={selectedCart?.establishment.collection_note}
                        textType={TEXT_TYPE.SEMI_BOLD}
                        style={{
                          color: COLORS.theme?.primaryColor,
                          marginTop: SPACE._2md
                        }}
                      />
                    )}
                  </View>
                )}
            </View>
          )}
          {/* Counter Collection */}

          {/* Takeaway */}
          {shouldShowOrderType(EOrderType.TAKE_AWAY) && (
            <View
              style={[
                styles.tableService,
                {
                  backgroundColor:
                    COLORS.theme?.interface[
                      selectedType !== 2 ? "200" : "100"
                    ]
                }
              ]}>
              <Pressable
                style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1.0 }]}
                onPress={() => {
                  setSelectedOrderType(2);
                }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between"
                  }}>
                  <AppLabel
                    text={Strings.orderType.takeaway}
                    style={styles.selectOrder}
                    textType={TEXT_TYPE.SEMI_BOLD}
                  />
                  {getRadioButton(2)}
                </View>
              </Pressable>
            </View>
          )}
          {/* Takeaway */}

          {/* Delivery */}
          {shouldShowOrderType(EOrderType.DELIVERY) && (
            <View
              style={[
                styles.tableService,
                {
                  backgroundColor:
                    COLORS.theme?.interface[
                      selectedType !== 3 ? "200" : "100"
                    ]
                }
              ]}>
              <Pressable
                style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1.0 }]}
                onPress={() => {
                  setSelectedOrderType(3);
                }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between"
                  }}>
                  <View style={{ flexDirection: "row" }}>
                    <AppLabel
                      text={`${Strings.orderType.delivery}`}
                      style={styles.selectOrder}
                      textType={TEXT_TYPE.SEMI_BOLD}
                    />
                    <AppLabel
                      text={` (Delivery charges ${Price.toString(
                        order?.establishment.currency_symbol,
                        calculateDeliveryCharges(order!)
                      )})`}
                      style={[
                        styles.selectOrder,
                        {
                          color: COLORS.theme?.primaryColor,
                          fontSize: FONT_SIZE._3xs
                        }
                      ]}
                      textType={TEXT_TYPE.BOLD}
                    />
                  </View>
                  {getRadioButton(3)}
                </View>
                {selectedType === 3 && (
                  <>
                    <View style={{ marginBottom: SPACE.md }} />
                    <Separator
                      type={Type.HORIZONTAL}
                      color={COLORS.white}
                      thickness={1}
                    />

                    {deliveryAddress ? (
                      <View
                        style={{
                          marginTop: SPACE._2md,
                          justifyContent: "center"
                        }}>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between"
                          }}>
                          <AppLabel
                            text={`${deliveryAddress?.title} Address`}
                            style={[
                              styles.selectOrder,
                              {
                                color: COLORS.theme?.primaryColor,
                                textTransform: "uppercase",
                                marginBottom: SPACE.sm
                              }
                            ]}
                            textType={TEXT_TYPE.SEMI_BOLD}
                          />

                          <TouchableOpacity onPress={openAddressesScreen}>
                            <AppLabel
                              text="Change Address"
                              style={{
                                fontSize: FONT_SIZE._3xs,
                                color: COLORS.blue
                              }}
                              textType={TEXT_TYPE.SEMI_BOLD}
                            />
                          </TouchableOpacity>
                        </View>
                        <AppLabel
                          text={deliveryAddress?.address}
                          style={[styles.selectOrder]}
                          numberOfLines={0}
                          textType={TEXT_TYPE.SEMI_BOLD}
                        />

                        {deliveryAddress?.optional_note && (
                          <AppLabel
                            text={`Notes: ${deliveryAddress?.optional_note}`}
                            style={[
                              styles.selectOrder,
                              { marginTop: SPACE.sm }
                            ]}
                            textType={TEXT_TYPE.SEMI_BOLD}
                          />
                        )}
                      </View>
                    ) : (
                      <TouchableOpacity onPress={openAddressesScreen}>
                        <View
                          style={{
                            marginTop: SPACE._2md,
                            height: 40,
                            justifyContent: "center"
                          }}>
                          <AppLabel
                            text="Select delivery address"
                            style={[
                              styles.selectOrder,
                              { color: COLORS.blue }
                            ]}
                            textType={TEXT_TYPE.SEMI_BOLD}
                          />
                        </View>
                      </TouchableOpacity>
                    )}

                    {selectedCart?.establishment.delivery_condition &&
                      selectedType === 3 && (
                        <View style={{ paddingTop: SPACE._2md }}>
                          <Separator
                            type={Type.HORIZONTAL}
                            color={COLORS.white}
                            thickness={1}
                          />
                          <AppLabel
                            numberOfLines={0}
                            text={
                              selectedCart?.establishment
                                .delivery_condition
                            }
                            textType={TEXT_TYPE.SEMI_BOLD}
                            style={{
                              color: COLORS.theme?.primaryColor,
                              marginTop: SPACE._2md
                            }}
                          />
                        </View>
                      )}
                  </>
                )}
              </Pressable>
            </View>
          )}
          {/* Delivery */}

          {/* Enter phone */}
          {(shouldShowOrderType(EOrderType.DELIVERY) ||
            shouldShowOrderType(EOrderType.TAKE_AWAY)) && (
            <>
              <View>
                <AppLabel
                  text={Strings.orderType.phone}
                  style={[styles.selectOrder, { marginTop: SPACE.md }]}
                  textType={TEXT_TYPE.SEMI_BOLD}
                />

                <AppInputField
                  keyboardType="number-pad"
                  valueToShowAtStart={phoneNumber}
                  onChangeText={(text) => {
                    setPhoneNumber(text);
                  }}
                  viewStyle={[
                    styles.inputFieldContainer,
                    {
                      borderWidth: 0.5,
                      borderColor: COLORS.theme?.borderColor
                    }
                  ]}
                  placeholder={Strings.orderType.enter_phone}
                  placeholderTextColor={COLORS.theme?.interface["500"]}
                />
                <AppLabel
                  text={Strings.orderType.phone_required}
                  style={{
                    fontSize: 12,
                    color: COLORS.theme?.interface["700"],
                    marginTop: SPACE.xs
                  }}
                />
              </View>
              {/* Enter phone */}

              {/* Make it default */}
              <View style={{ flexDirection: "row", marginTop: SPACE.md }}>
                <Pressable
                  onPress={() => setAddressDefault((prev) => !prev)}>
                  {isAddressDefault ? (
                    <RadioButtonActive
                      stroke={COLORS.theme?.borderColor}
                    />
                  ) : (
                    <RadioButtonInActive
                      stroke={COLORS.theme?.borderColor}
                    />
                  )}
                </Pressable>

                <View
                  style={{
                    flexDirection: "column",
                    paddingHorizontal: SPACE._2md
                  }}>
                  <AppLabel
                    text={Strings.orderType.make_default}
                    style={styles.selectOrder}
                    textType={TEXT_TYPE.SEMI_BOLD}
                  />
                  <AppLabel
                    text={Strings.orderType.by_making}
                    numberOfLines={0}
                    style={{
                      fontSize: 12,
                      color: COLORS.theme?.interface["700"]
                    }}
                  />
                </View>
              </View>
            </>
          )}
          {/* Make it default */}
        </ScrollView>

        <View style={[styles.bottomView]}>
          <AppLabel
            style={[styles.commentsLabel]}
            text={Strings.venue_details.menu.addComments}
            textType={TEXT_TYPE.BOLD}
          />
          <TextInput
            placeholder={Strings.venue_details.menu.commentsPlaceholder}
            style={[styles.textFieldStyle]}
            placeholderTextColor={COLORS.theme?.interface[500]}
            textAlignVertical={"top"}
            value={comments}
            multiline={true}
            numberOfLines={3}
            onChangeText={(value) => setComments(value)}
          />

          <AppButton
            shouldShowProgressBar={loading}
            textType={TEXT_TYPE.SEMI_BOLD}
            text={
              Strings.orderType.btn +
              Price.toString(
                selectedCart?.establishment.region.currency_symbol,
                checkoutPrice(selectedCart!)
              )
            }
            onPress={() => {
              arePreRequisiteMet();
            }}
          />
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  scrollViewContent: {
    flexDirection: "column",
    paddingVertical: SPACE._2xl,
    paddingHorizontal: SPACE.lg,
    flexGrow: 1
  },
  selectOrder: {
    color: COLORS.theme?.interface["900"],
    fontSize: FONT_SIZE._2xs
  },
  tableService: {
    marginTop: SPACE.lg,
    paddingHorizontal: SPACE.md,
    paddingVertical: SPACE._2md,
    backgroundColor: COLORS.theme?.interface["100"],
    borderRadius: 10
  },
  inputFieldContainer: {
    marginTop: SPACE.xs,
    height: 44,
    backgroundColor: COLORS.theme?.primaryBackground,
    borderColor: COLORS.theme?.borderColor
  },
  bottomView: {
    backgroundColor: COLORS.theme?.interface[50],
    paddingHorizontal: SPACE.lg,
    // paddingBottom: SPACE.lg,
    borderTopColor: COLORS.theme?.borderColor,
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderWidth: 1
  },
  commentsLabel: {
    color: COLORS.black,
    marginTop: SPACE._2md,
    fontSize: FONT_SIZE._3xs
  },
  textFieldStyle: {
    marginTop: SPACE._2md,
    marginBottom: SPACE.md,
    paddingHorizontal: SPACE.md,
    paddingTop: SPACE.md,
    backgroundColor: COLORS.theme?.interface[200],
    borderRadius: SPACE._2md,
    height: 90,
    color: COLORS.black
  },
  textfieldsContainer: {
    flex: 1,
    marginTop: SPACE._2md,
    justifyContent: "space-between"
  }
});
