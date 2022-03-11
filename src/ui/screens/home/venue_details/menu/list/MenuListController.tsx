/* eslint-disable @typescript-eslint/no-unused-vars */
import { MaterialTopTabNavigationProp } from "@react-navigation/material-top-tabs";
import {
  RouteProp,
  useNavigation,
  useRoute
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { usePreventDoubleTap } from "hooks";
import _ from "lodash";
import { MenuSegment } from "models/api_responses/GetSegmentResponseModel";
import ESupportedOrderType from "models/enums/ESupportedOrderType";
import React, {
  FC,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import { useVenueApis } from "repo/venues/Venues";
import { HomeStackParamList } from "routes/HomeStack";
import { MenuTabParamsList } from "routes/MenuTabBar";
import { VenueDetailsTopTabsParamList } from "routes/VenueDetailsTopTabs";
import MenuListView from "./MenuListView";
import CustomAppDialog from "ui/components/organisms/app_dialogs/CustomAppDialog";
import Strings from "config/Strings";
import {
  ImageSourcePropType,
  Linking,
  TouchableWithoutFeedback,
  View
} from "react-native";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import Phone from "assets/images/ic_phone.svg";
import { COLORS, SPACE } from "config";
import { useAppDispatch, useAppSelector } from "hooks/redux";
import { RootState } from "stores/store";
import EScreen from "models/enums/EScreen";
import { BarMenu, supportedOrderTypes } from "models/BarMenu";

import {
  setRefreshingEvent,
  consumeRefreshCount
} from "stores/generalSlice";
import AllergensDialog from "ui/components/organisms/app_dialogs/AllergensDialog";
import { AddToCartRequestModel } from "models/api_requests/AddToCartRequestModel";
import SimpleToast from "react-native-simple-toast";
import { useAddCartApi } from "repo/myCart/MyCarts";
import { AddToCart } from "models/AddToCart";
import { AddToCartResponseModel } from "models/api_responses/AddToCartResponseModel";

type MenuScreenProps = RouteProp<MenuTabParamsList, "dine_in_collection">;

type MenuNavigationProp = MaterialTopTabNavigationProp<
  VenueDetailsTopTabsParamList,
  "Menu"
>;

type HomeNavigationProps = StackNavigationProp<
  HomeStackParamList,
  "VenueDetails"
>;

type Props = {
  menuType: ESupportedOrderType;
};

const MenuListController: FC<Props> = ({ menuType }) => {
  const navigation = useNavigation<MenuNavigationProp>();
  const homeNavigation = useNavigation<HomeNavigationProps>();
  const route = useRoute<MenuScreenProps>();
  const [shouldShowAllergensDialog, setShouldShowAllergensDialog] =
    useState(false);
  const { refreshingEvent, barDetails } = useAppSelector(
    (state: RootState) => state.general
  );
  const [menuSegments, setMenuSegments] = useState<
    MenuSegment[] | undefined
  >(undefined);

  const _menuType =
    route.params?.menuType ?? menuType ?? ESupportedOrderType.ALL;

  const dispatch = useAppDispatch();

  const {
    request: menuSegmentsRequest,
    loading,
    error
  } = useVenueApis().getBarMenuSegments;

  const handleLoadMenuSegments = useCallback(
    async (onComplete?: () => void) => {
      let requestModel = {
        establishment_id: barDetails?.id.toString() ?? "",
        supported_order_type:
          _menuType !== ESupportedOrderType.ALL ? _menuType : undefined
      };

      if (_menuType === ESupportedOrderType.ALL) {
        _.omit(requestModel, "supported_order_type");
      }

      const { hasError, dataBody } = await menuSegmentsRequest(
        requestModel
      );
      if (hasError || dataBody === undefined) {
        onComplete?.();
        return;
      } else {
        //set user nad open main screen

        let data: MenuSegment[] = _.reject(
          dataBody.data,
          (item: MenuSegment) => item.items.length === 0
        );

        setMenuSegments(data);
        onComplete?.();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [route.params?.menuType, menuType]
  );

  const returnMessage = () => {
    if (_menuType === ESupportedOrderType.DINE_IN_COLLECTION) {
      return `${
        barDetails?.is_allergen
          ? barDetails.allergen_description + `\n\n`
          : ""
      }${Strings.dialogs.allergensDialog.msg_question_allergies_dine_in}`;
    } else if (_menuType === ESupportedOrderType.TAKEAWAY_DELIVERY) {
      return `${
        barDetails?.is_allergen
          ? barDetails?.allergen_description + `\n\n`
          : ""
      }${
        Strings.dialogs.allergensDialog
          .msg_question_allergies_takeaway_delivery
      }`;
    } else {
      return barDetails?.is_allergen
        ? barDetails?.allergen_description +
            `\n\n` +
            Strings.dialogs.allergensDialog.msg_question_allergies
        : Strings.dialogs.allergensDialog.msg_question_allergies;
    }
  };

  useEffect(() => {
    if (refreshingEvent?.SUCCESSFULL_ITEM_ADDED) {
      let event = refreshingEvent?.SUCCESSFULL_ITEM_ADDED;

      updateMenuList(
        event.product,
        event.quantity,
        event.cart_item_id!,
        event.cartType
      );
    }

    if (
      refreshingEvent?.REFRESH_APIS_EXPLORE_SCREEN?.includes(
        EScreen.VENUE_DETAIL_SEGMENT
      )
    ) {
      refreshCallback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshingEvent]);

  const updateMenuList = (
    menu: BarMenu,
    quantity: number,
    cart_item_id: number | null,
    cart_type: ESupportedOrderType
  ) => {
    menuSegments &&
      menuSegments!.length > 0 &&
      menuSegments?.filter((segment) => {
        segment.items.length > 0 &&
          segment.items.filter((item) => {
            if (
              item.id === menu.id &&
              (_menuType === ESupportedOrderType.ALL ||
                cart_type === _menuType)
            ) {
              if (quantity > 0) {
                item.quantity = quantity;
                item.cart_item_id = cart_item_id;
                // Number(menu?.quantity ?? "0") + Number(quantity);
                setMenuSegments(_.cloneDeep(menuSegments));
              } else if (quantity === 0) {
                item.quantity = 0;
                item.cart_item_id = null;
                setMenuSegments(_.cloneDeep(menuSegments));
              }
            }
          });
      });
  };

  useEffect(() => {
    barDetails !== undefined && handleLoadMenuSegments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params?.menuType, menuType]);

  const refreshCallback = (onComplete?: () => void) => {
    if (onComplete === undefined) {
      setMenuSegments(undefined);
    }
    handleLoadMenuSegments(onComplete);
  };

  const openAllergensDialog = usePreventDoubleTap(() => {
    dispatch(
      setRefreshingEvent({
        POP_UP_OPEN: true
      })
    );

    setShouldShowAllergensDialog(true);
  });

  const onRefresh = useCallback(
    (onComplete?: () => void) => {
      dispatch(
        setRefreshingEvent({
          REFRESH_APIS_EXPLORE_SCREEN: [
            EScreen.VENUE_DETAIL_ABOUT,
            EScreen.VENUE_DETAIL_MENU,
            EScreen.VENUE_DETAIL_WHATSON
          ]
        })
      );

      setTimeout(() => {
        dispatch(consumeRefreshCount());
      }, 500);

      handleLoadMenuSegments(onComplete);

      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [dispatch, handleLoadMenuSegments]
  );

  //////////////////////////////////Handle Basic Bogo/////////////////////////////
  const onSuccessItemAdded = useCallback(
    (
      cart_item_id: number,
      _quantity: number,
      previousQuantity: number,
      menu: BarMenu | undefined
    ) => {
      dispatch(
        setRefreshingEvent({
          SUCCESSFULL_ITEM_ADDED: {
            barId: `${menu?.establishment_id}`,
            cartType: route.params?.menuType,
            product: _.omit(menu, "key"),
            cart_item_id: cart_item_id,
            quantity: _quantity,
            previousQuantity: previousQuantity
          }
        })
      );

      setTimeout(() => dispatch(consumeRefreshCount()), 200);
    },
    [dispatch, route.params]
  );

  const onBasicBogoClick = usePreventDoubleTap(
    (bogo: BarMenu, dataBody: AddToCartResponseModel) => {
      let updatedQuantity: number = 0;
      dataBody.data.menuItems.map((item) => {
        if (bogo.id === item.id) {
          updatedQuantity += item.quantity;
        }
      });

      onSuccessItemAdded(Number(undefined), updatedQuantity, 1, bogo);

      navigation.navigate("MyCart", {
        isFrom: EScreen.VENUE_DETAIL,
        establishment_id: bogo.establishment_id
      });
    }
  );

  return (
    <>
      <MenuListView
        onRefresh={onRefresh}
        menuSegments={menuSegments}
        updateMenuList={updateMenuList}
        isLoading={loading}
        onBasicBogoClick={onBasicBogoClick}
        refreshCallback={refreshCallback}
        error={error}
        openAllergensDialog={openAllergensDialog}
        menuType={_menuType}
        _venue={barDetails}
      />
      <AllergensDialog
        image={require("assets/images/img_reload.webp")}
        isVisible={shouldShowAllergensDialog}
        buttonsText={["OK"]}
        allergensIcons={
          barDetails?.is_allergen && barDetails.allergen_icons!.length > 0
            ? barDetails?.allergen_icons
            : []
        }
        textOnImage={
          Strings.dialogs.allergensDialog.questions_about_allergens
        }
        message={returnMessage()}
        hideSelf={() => {
          setShouldShowAllergensDialog(false);

          dispatch(
            setRefreshingEvent({
              POP_UP_OPEN: false
            })
          );
          dispatch(consumeRefreshCount());
        }}
        appButtonsProps={[
          {
            onPress: () => {
              setShouldShowAllergensDialog(false);

              dispatch(
                setRefreshingEvent({
                  POP_UP_OPEN: false
                })
              );
              dispatch(consumeRefreshCount());
            }
          }
        ]}
        customView={
          _menuType === ESupportedOrderType.TAKEAWAY_DELIVERY &&
          barDetails?.contact_number ? (
            <TouchableWithoutFeedback
              onPress={() =>
                Linking.openURL(`tel:${barDetails?.contact_number}`)
              }>
              <View
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                  paddingTop: SPACE.sm
                }}>
                <Phone
                  width={20}
                  height={20}
                  fill={COLORS.theme?.primaryShade["700"]}
                />
                <AppLabel
                  text={barDetails?.contact_number}
                  textType={TEXT_TYPE.SEMI_BOLD}
                  style={{
                    marginLeft: SPACE.sm,
                    color: COLORS.theme?.primaryShade["700"]
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          ) : null
        }
      />
    </>
  );
};

export default MenuListController;
