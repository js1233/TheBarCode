import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Address } from "models/Address";
import { VenueSearchApiRequestModel } from "models/api_requests/VenueSearchApiRequestModel";
import { RegionData } from "models/api_responses/ForceUpdateResponseModel";
import { BarMenu } from "models/BarMenu";
import ESearchType from "models/enums/ESearchType";
import ESupportedOrderType from "models/enums/ESupportedOrderType";
import EScreen from "models/enums/EScreen";
import { Order } from "models/Order";
import SearchParams from "models/SearchParams";
import AuthStorage from "repo/auth/AuthStorage";
import { AppLog, TAG } from "utils/Util";
import EOfferRedemptionFilter from "models/enums/EOfferRedemptionFilter";
import { Venue } from "models/Venue";
import { AddToCartRequestModel } from "models/api_requests/AddToCartRequestModel";

export type EventDeliveryAddress = {
  address: Address;
};

export type EventSuccessFullRedemption = {
  venueId: number;
  offerId: number;
  isVoucher: boolean;
};

export type SuccessfullInAppPurchase = {
  bar_id?: string;
};

export type SuccessfulItemAddedToCart = {
  barId: string;
  product: BarMenu;
  cartType: ESupportedOrderType;
  cart_item_id?: number;
  quantity: number;
  isUpdating?: boolean;
  previousQuantity?: number;
};

export type UpdateCartFromRedeemRequestModel = {
  offer_type: string;
  exclusive_offer_id: string;
  redeem_type: string;
  quantity: string;
  establishment_id: string;
  id: string;
  cart_type: ESupportedOrderType;
};

export type EventName = {
  SUCCESSFULL_REDEMPTION: EventSuccessFullRedemption;
  DELIVERY_ADDRESS_UPDATE: EventDeliveryAddress;
  SUCCESSFULL_PURCHASE: SuccessfullInAppPurchase;
  SUCCESSFULL_ITEM_ADDED: SuccessfulItemAddedToCart;
  REFRESH_APIS_EXPLORE_SCREEN: EScreen[];
  PAYMENT_SENSE_CARD_SUCCESS: EScreen;
  ORDER_CREATED_EVENT: { createdOrder?: Order };
  MOVE_TO_SCREEN: EScreen;
  POP_UP_OPEN: Boolean;
  SUCCESSFULL_REORDER: boolean;
  WORLD_PAY_VERIFICATION_RESPONSE: {
    authenticatedCard: any;
    status: string;
  };
  BOGO_BUNDLE_MODIFIERS_SELECTED: {
    data: AddToCartRequestModel;
    selectedModifierIndex: number;
  };
  FETCH_CART_COUNT: boolean;
};

type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> &
  U[keyof U];

export type RefreshingEventType = AtLeastOne<EventName>;

// sample testing type for refreshing every
// const data: RefreshingEventType = [
//   {
//     SUCCESSFULL_REDEMPTION: { venueId: 0, offerId: 0, isVoucher: false },
//     ORDER_CREATED_EVENT: {}
//   }
// ];

export interface GeneralState {
  regionData: RegionData | undefined;
  notificationCount: number | undefined;
  refreshingEvent: RefreshingEventType | undefined;
  dynamicLink: string | undefined;
  shouldSkipLocationCheck: boolean | undefined;
  selectedSearchTab: ESearchType;
  searchRequestParams: SearchParams | undefined;
  refreshingEventArray: RefreshingEventType[] | undefined;
  cartCount: number | undefined;
  updateCartFromRedeem: UpdateCartFromRedeemRequestModel | undefined;
  standardOfferIds: number[];
  redeemType: EOfferRedemptionFilter;
  preferenceIds: number[];
  barDetails: Venue | undefined;
}

const initialState: GeneralState = {
  regionData: undefined,
  notificationCount: undefined,
  refreshingEvent: undefined,
  dynamicLink: undefined,
  shouldSkipLocationCheck: undefined,
  selectedSearchTab: ESearchType.VENUE,
  searchRequestParams: undefined,
  refreshingEventArray: undefined,
  cartCount: undefined,
  updateCartFromRedeem: undefined,
  standardOfferIds: [],
  redeemType: EOfferRedemptionFilter.ALL,
  preferenceIds: [],
  barDetails: undefined
};

export const generalSlice = createSlice({
  name: "general",
  initialState,
  reducers: {
    updateRegionData: (state, { payload }: PayloadAction<RegionData>) => {
      state.regionData = payload;
      AuthStorage.storeRegionData(payload);
    },
    setNotificationCount: (state, { payload }: PayloadAction<number>) => {
      state.notificationCount = payload;
    },
    setCartCount: (
      state,
      {
        payload
      }: PayloadAction<{
        type: "inc" | "dec" | "count" | "reset";
        value?: number;
      }>
    ) => {
      AppLog.log(
        () => "setCartCount: " + JSON.stringify(payload.value),
        TAG.API
      );

      if (payload.type === "inc") {
        return (state.cartCount ?? 0) + 1;
      } else if (payload.type === "dec") {
        return (state.cartCount ?? 0) - 1;
      } else if (payload.type === "reset") {
        state.cartCount = 0;
      } else {
        state.cartCount = payload?.value ?? 0;
      }
    },
    setRefreshingEvent: (
      state,
      { payload }: PayloadAction<RefreshingEventType>
    ) => {
      state.refreshingEvent = payload;
    },
    consumeRefreshCount: (state) => {
      state.refreshingEvent = undefined;
    },
    setRefreshingEventArray: (
      state,
      { payload }: PayloadAction<RefreshingEventType[]>
    ) => {
      state.refreshingEventArray = payload;
    },
    consumeRefreshEventArray: (state) => {
      state.refreshingEventArray = undefined;
    },
    setDynamicLink: (
      state,
      { payload }: PayloadAction<string | undefined>
    ) => {
      state.dynamicLink = payload;
    },
    setSelectedSearchTab: (
      state,
      { payload }: PayloadAction<ESearchType>
    ) => {
      state.selectedSearchTab = payload;
    },
    setSearchRequestParams: (
      state,
      { payload }: PayloadAction<VenueSearchApiRequestModel>
    ) => {
      state.searchRequestParams = payload;
    },
    setUpdateCartFromRedeem: (
      state,
      { payload }: PayloadAction<UpdateCartFromRedeemRequestModel>
    ) => {
      state.updateCartFromRedeem = payload;
    },
    setStandardOfferIds: (state, { payload }: PayloadAction<number[]>) => {
      state.standardOfferIds = payload;
    },
    setRedeemType: (
      state,
      { payload }: PayloadAction<EOfferRedemptionFilter>
    ) => {
      state.redeemType = payload;
    },
    setPreferenceIds: (state, { payload }: PayloadAction<number[]>) => {
      state.preferenceIds = payload;
    },
    setBarDetails: (state, { payload }: PayloadAction<Venue>) => {
      state.barDetails = payload;
    }
  }
});

// Action creators are generated for each case reducer function
export const {
  updateRegionData,
  setRefreshingEvent,
  consumeRefreshCount,
  setDynamicLink,
  setNotificationCount,
  setCartCount,
  setSelectedSearchTab,
  setSearchRequestParams,
  setRefreshingEventArray,
  consumeRefreshEventArray,
  setUpdateCartFromRedeem,
  setStandardOfferIds,
  setRedeemType,
  setPreferenceIds,
  setBarDetails
} = generalSlice.actions;

export default generalSlice.reducer;
