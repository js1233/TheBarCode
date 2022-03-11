import { createStackNavigator } from "@react-navigation/stack";
import EPreferencesScreenUseCase from "models/enums/EPreferencesScreenUseCase";
import EMoreType from "models/enums/EMoreType";
import { Venue } from "models/Venue";
import { BarMenu } from "models/BarMenu";
import SearchParams from "models/SearchParams";
import { WalletRoutes } from "ui/screens/home/more/wallet/WalletController";
import EScreen from "models/enums/EScreen";
import { HomeBottomBarParamsList } from "routes/HomeBottomBar";
import { VenueDetailsTopTabsParamList } from "routes/VenueDetailsTopTabs";
import Notification from "models/Notification";
import ESupportedOrderType from "models/enums/ESupportedOrderType";
import { Order } from "models/Order";
import { SignUpRequestModel } from "models/api_requests/SignUpRequestModel";
import { Address } from "models/Address";
import ECardType from "models/enums/ECardType";
import { SplitPayment } from "models/SplitPayment";
import EPosType from "models/enums/EPosType";
import EProductGroupType from "models/enums/EProductGroupType";
import { Modifier } from "models/Modifier";

export type HomeStackParamList = {
  Home: { isFrom?: EScreen; initialRoute?: keyof HomeBottomBarParamsList };
  Preferences: {
    useCase: EPreferencesScreenUseCase;
    onPreferencesSelected?: (preferenceIds: number[]) => void;
    selectedIds?: number[];
  };
  Contacts: undefined;
  StaticContent: { contentType?: EMoreType };
  Notification: undefined;
  NotificationSettings: undefined;
  Wallet: { initialRouteName: WalletRoutes; initialSegmentIndex: number };
  VenueMap: undefined;
  VenueDetails: {
    venue?: Venue;
    isFrom?: EScreen;
    initialRoute?: keyof VenueDetailsTopTabsParamList;
    notification?: Notification;
    id?: number;
    initialSegmentForWhatsOnIndex?: number;
    initialSegmentForMenuIndex?: number;
  };
  FrequentlyAskedQuestions: undefined;
  RedemptionAndReloadRules: undefined;
  MenuDetail: {
    menu?: BarMenu;
    menu_id?: number;
    menuType: ESupportedOrderType;
    productType: EProductGroupType;
    isUpdating: boolean;
    quantity?: number;
    establishment_id: number;
    redeemType?: string;
    exclusive_offer_id?: string;
    supportedType: EPosType;
    isOpenFrom?: EScreen;
    selectedModifiers?: Modifier[];
    selectedModifierIndex?: number;
    shouldShowPriceInButton?: boolean;
  };
  BundleBogo: {
    menu?: BarMenu;
    menu_id?: number;
    menuType: ESupportedOrderType;
    productType: EProductGroupType;
    quantity?: number;
    establishment_id: number;
    isChalkboardOffer?: boolean;
    redeemType?: string;
    exclusive_offer_id?: string;
    supportedType: EPosType;
    selectedBundleIds?: number[];
    force_refresh_apis?: boolean;
  };
  Filter: {
    offersId: number[];
    redeemFilter: string[];
    onFiltersSelected: (
      selectedOfferFilterIds: number[],
      selectedRedeemFilter: string[]
    ) => void;
  };
  Reload: undefined;
  Search: { searchParams: SearchParams };
  Addresses: { isOpenFromOrderType?: boolean };
  AddAndEditAddress: {
    address?: Address;
    onAddressUpdate?: (address: Address) => void;
  };
  MyPayment: {
    order?: Order;
    cardType?: ECardType;
    splitPayment?: SplitPayment;
  };
  AddPayment: {
    onAddPaymentMethod: (paymentMethod: any) => void;
    isOPenForSquareUp?: boolean;
    preFilledCard?: object;
    venue?: Venue;
  };
  Invite: undefined;
  OrderDetails: {
    order_id?: number;
    order?: Order;
    isFrom?: EScreen;
  };
  SplitBillScanner: undefined;
  OrderType: { order?: Order };
  SignUp: {
    isOpenFromAccountSettings?: boolean;
    requestModel?: SignUpRequestModel;
    isFromMobileSignUp?: boolean;
    contactNumber?: string;
  };
  MemberDiscount: { order: Order; splitPayment?: SplitPayment };
  SplitTheBill: { order: Order };
  SplitType: {
    order: Order;
  };
  OrderReview: {
    orderId: number;
  };
  PsNewCard: {
    order?: Order;
    splitPayment?: SplitPayment;
  };
  MyCart: {
    isFrom?: EScreen;
    establishment_id?: number;
    exclusive_id?: string;
  };
  WpVerification: { data: JSON };
};

export const HomeStack = createStackNavigator<HomeStackParamList>();
