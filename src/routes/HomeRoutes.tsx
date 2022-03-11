import React, { FC, useCallback } from "react";
import { COLORS, STRINGS } from "config";
import HeaderTitle from "ui/components/headers/header_title/HeaderTitle";
import { HomeStack, HomeStackParamList } from "./HomeStack";
import ContactsController from "ui/screens/home/invite/contacts/ContactsController";
import HomeController from "ui/screens/home/HomeController";
import PreferencesController from "ui/screens/preferences/PreferencesController";
import EPreferencesScreenUseCase from "models/enums/EPreferencesScreenUseCase";
import StaticContentController from "ui/screens/home/more/static_content/StaticContentController";
import NotificationSettingsController from "ui/screens/home/more/notification-settings/NotificationSettingsController";
import { AppLog, shadowStyleProps, TAG } from "utils/Util";
import NotificationController from "ui/screens/home/more/notification/NotificationController";
import WalletController from "ui/screens/home/more/wallet/WalletController";
import VenueDetailsController from "ui/screens/home/venue_details/VenueDetailsController";
import FaqsController from "ui/screens/home/more/frequently-asked-questions/FaqsController";
import RedemptionRulesController from "ui/screens/home/more/redemption-rules/RedemptionController";
import MenuDetailController from "ui/screens/home/venue_details/menu_detail/MenuDetailController";
import ReloadController from "ui/screens/home/more/reload/ReloadController";
import FilterController from "ui/screens/home/explore/filter/FilterController";
import SearchController from "ui/screens/home/search/SearchController";
import EOfferRedemptionFilter from "models/enums/EOfferRedemptionFilter";
import MyAdressesController from "ui/screens/home/more/my-addresses/MyAddressesController";
import AddAndEditAddressController from "ui/screens/home/more/my-addresses/add-and-edit-addresses/AddAndEditAddressController";
import { PushNotification } from "utils/PushNotification";
import { usePushNotificationsContextToNavigate } from "hooks/usePushNotificationContextToNavigate";

import MyPaymentController from "ui/screens/home/more/my-payment-method/MyPaymentController";
import AddPaymentController from "ui/screens/home/more/my-payment-method/add-payment/AddPaymentController";
import InviteController from "ui/screens/home/invite/InviteController";
import { useAppDispatch, useAppSelector } from "hooks/redux";
import { setNotificationCount } from "stores/generalSlice";
import { RootState } from "stores/store";
import OrderDetailsController from "ui/screens/home/order/order_details/OrderDetailsController";
import SplitBillScannerController from "ui/screens/home/more/split-the-bill-scanner/SplitBillScannerController";
import OrderTypeController from "ui/screens/home/order/type/OrderTypeController";
import SignUpController from "ui/screens/auth/sign_up/SignUpController";
import MemberDiscountController from "ui/screens/home/more/member-discount/MemberDiscountController";

import SplitTheBillController from "ui/screens/home/more/split-the-bill/SplitTheBillController";
import SplitTypeController from "ui/screens/home/more/split-type/SplitTypeController";
import OrderReviewController from "ui/screens/home/order/review/OrderReviewController";
import PsNewCardController from "ui/screens/home/order/ps_new_card/PsNewCardController";
import MyCartController from "ui/screens/home/cart/mycart/MyCartController";
import PaymentAuthController from "ui/screens/home/order/payment_auth/PaymentAuthController";
import BundleBogoController from "ui/screens/home/venue_details/bundle_bogo/BundleBogoController";

type Props = {
  initialRouteName: keyof HomeStackParamList;
};

export const HomeRoutes: FC<Props> = ({ initialRouteName }) => {
  const { notificationCount } = useAppSelector(
    (state: RootState) => state.general
  );
  const dispatch = useAppDispatch();

  PushNotification.setForegroundHandler((event) => {
    AppLog.log(
      () => "OneSignal: setForegroundHandler: " + JSON.stringify(event),
      TAG.ONE_SIGNAL
    );
    dispatch(setNotificationCount(notificationCount! + 1));
  });

  // For handling redirection through push notification
  usePushNotificationsContextToNavigate(
    useCallback((value) => {
      // setCurrentItem(value.screenName);
      AppLog.log(
        () => "handlingRedirectionPushNotiifcation: " + value,
        TAG.VENUE
      );
    }, [])
  );

  return (
    <HomeStack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: COLORS.theme?.interface["50"],
          ...shadowStyleProps,
          shadowOpacity: 0.2
        }
      }}>
      <HomeStack.Screen
        name="Home"
        component={HomeController}
        options={{
          headerTitle: () => <HeaderTitle text={STRINGS.home.title} />,
          headerShown: false
        }}
      />
      <HomeStack.Screen
        name="Preferences"
        component={PreferencesController}
        initialParams={{
          useCase: EPreferencesScreenUseCase.SET_USER_PREFERENCES
        }}
      />
      <HomeStack.Screen
        name="VenueDetails"
        component={VenueDetailsController}
        options={{ headerStyle: { elevation: 0, shadowOpacity: 0 } }}
      />
      <HomeStack.Screen name="Contacts" component={ContactsController} />
      <HomeStack.Screen
        name="StaticContent"
        component={StaticContentController}
      />
      <HomeStack.Screen
        name="Notification"
        component={NotificationController}
      />
      <HomeStack.Screen name="Wallet" component={WalletController} />
      <HomeStack.Screen
        name="NotificationSettings"
        component={NotificationSettingsController}
      />
      <HomeStack.Screen
        name="FrequentlyAskedQuestions"
        component={FaqsController}
      />
      <HomeStack.Screen
        name="RedemptionAndReloadRules"
        component={RedemptionRulesController}
      />
      <HomeStack.Screen
        name="MenuDetail"
        component={MenuDetailController}
      />
      <HomeStack.Screen name="Filter" component={FilterController} />
      <HomeStack.Screen name="Reload" component={ReloadController} />
      <HomeStack.Screen
        name="Search"
        component={SearchController}
        options={{ headerShown: false }}
        initialParams={{
          searchParams: {
            keyword: "",
            preferenceIds: [],
            standardOfferIds: [],
            isDelivery: false,
            redemptionFilter: EOfferRedemptionFilter.ALL
          }
        }}
      />
      <HomeStack.Screen
        name="Addresses"
        component={MyAdressesController}
      />
      <HomeStack.Screen
        name="AddAndEditAddress"
        component={AddAndEditAddressController}
      />
      <HomeStack.Screen name="MyPayment" component={MyPaymentController} />
      <HomeStack.Screen
        name="AddPayment"
        component={AddPaymentController}
      />
      <HomeStack.Screen name="Invite" component={InviteController} />
      <HomeStack.Screen
        name="SplitBillScanner"
        component={SplitBillScannerController}
      />
      <HomeStack.Screen name="OrderType" component={OrderTypeController} />
      <HomeStack.Screen
        name="OrderDetails"
        component={OrderDetailsController}
      />
      <HomeStack.Screen
        name="MemberDiscount"
        component={MemberDiscountController}
      />
      <HomeStack.Screen
        name="SignUp"
        component={SignUpController}
        options={{
          headerTitle: () => (
            <HeaderTitle text={STRINGS.signUp.sign_up_email} />
          )
        }}
      />
      <HomeStack.Screen
        name="SplitTheBill"
        component={SplitTheBillController}
      />
      <HomeStack.Screen name="SplitType" component={SplitTypeController} />

      <HomeStack.Screen
        name="OrderReview"
        component={OrderReviewController}
      />

      <HomeStack.Screen name="PsNewCard" component={PsNewCardController} />

      <HomeStack.Screen
        name="WpVerification"
        component={PaymentAuthController}
      />

      <HomeStack.Screen name="MyCart" component={MyCartController} />
      <HomeStack.Screen
        name="BundleBogo"
        component={BundleBogoController}
      />
    </HomeStack.Navigator>
  );
};
