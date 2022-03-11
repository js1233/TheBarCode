import { API } from "config";
import { useApi } from "hooks/useApi";
import { apiClient } from "repo/Client";
import GetPreferencesRequestModel from "models/api_requests/GetPreferencesRequestModel";
import GetPreferencesResponseModel from "models/api_responses/GetPreferencesResponseModel";
import GetReloadDataResponseModel from "models/api_responses/GetReloadDataResponseModel";
import GetReloadDataRequestModel from "models/api_requests/GetReloadDataRequestModel";
import {
  PaginationParamsModel,
  usePaginatedApi
} from "hooks/usePaginatedApi";
import { Dispatch, SetStateAction } from "react";
import { Venue } from "models/Venue";
import { VenueApiResponseModel } from "models/api_responses/VenueApiReponseModel";
import { Offer } from "models/Offer";
import { SetFavoriteRequestModel } from "models/api_requests/SetFavoriteRequestModel";
import PaymentMethodRequestModel from "models/api_requests/PaymentMethodRequestModel";
import { PaymentMethodResponseModel } from "models/api_responses/PaymentMethodResponseModel";
import { RedeemDealRequestModel } from "models/api_requests/RedeemDealRequestModel";
import { SignUpRequestModel } from "models/api_requests/SignUpRequestModel";
import OfferDetailsRequestModel from "models/api_requests/OfferDetailsRequestModel";
import { InAppPurchaseRequestModel } from "models/api_requests/InAppPurchaseRequestModel";
import { InAppPurchaseResponseModel } from "models/api_responses/InAppPurchaseResponseModel";
import { OfferDetailsResponseModel } from "models/api_responses/OfferDetailsResponseModel";
import { updateUserResponseModel } from "models/api_responses/UpdateUserResponseModel";

function getPreferences(requestModel: GetPreferencesRequestModel) {
  return apiClient.get<GetPreferencesResponseModel>(
    API.GET_PREFERENCES,
    JSON.stringify(requestModel)
  );
}

function getFavourites(
  requestModel: any,
  paginationParamsModel?: PaginationParamsModel
) {
  return apiClient.get<VenueApiResponseModel>(API.GET_FAVOURITE, {
    ...paginationParamsModel,
    ...requestModel
  });
}

function setFavorite(requestModel: SetFavoriteRequestModel) {
  return apiClient.put<VenueApiResponseModel>(
    API.PUT_SET_BAR_FAVOURITE,
    JSON.stringify(requestModel)
  );
}

function updateUser(requestModel: SignUpRequestModel) {
  return apiClient.put<updateUserResponseModel>(
    API.PUT_UPDATE + `${requestModel.id}`,
    JSON.stringify(requestModel)
  );
}

function getSharedOffers(requestModel: any) {
  return apiClient.get<any>(
    API.GET_SHARED_OFFERS,
    JSON.stringify(requestModel)
  );
}

function getSharedEvents(requestModel: any) {
  return apiClient.get<any>(
    API.GET_SHARED_EVENTS,
    JSON.stringify(requestModel)
  );
}

function addPaymentMethod(requestModel: PaymentMethodRequestModel) {
  return apiClient.post<PaymentMethodResponseModel>(
    API.card,
    JSON.stringify(requestModel)
  );
}

function getPaymentMethod(requestModel: PaymentMethodRequestModel) {
  return apiClient.get<PaymentMethodResponseModel>(API.card, {
    ...requestModel
  });
}

function deletePaymentMethod(requestModel: PaymentMethodRequestModel) {
  return apiClient.delete<PaymentMethodResponseModel>(
    API.card + `${requestModel.id}`
  );
}

function getBookMarkedOffers(requestModel: any) {
  return apiClient.get<any>(
    API.GET_FAV_OFFERS,
    JSON.stringify(requestModel)
  );
}

function getBookMarkedEvents(requestModel: any) {
  return apiClient.get<any>(
    API.GET_FAV_EVENTS,
    JSON.stringify(requestModel)
  );
}

function getReloadData(request: GetReloadDataRequestModel) {
  return apiClient.get<GetReloadDataResponseModel>(API.GET_RELOAD_DATA, {
    ...request
  });
}

function getOrderOffers(request: OfferDetailsRequestModel) {
  return apiClient.get<OfferDetailsResponseModel>(API.GET_ORDER_OFFERS, {
    ...request
  });
}

function redeemBarOffer(request: RedeemDealRequestModel) {
  return apiClient.post<GetReloadDataResponseModel>(
    API.POST_REDEEM_OFFER,
    JSON.stringify(request)
  );
}

function makeInAppPurchase(requestModel: InAppPurchaseRequestModel) {
  return apiClient.post<InAppPurchaseResponseModel>(
    API.ESTABLISHMENT_SUBSCRIPTION,
    {
      ...requestModel
    }
  );
}

function subscription(requestModel: InAppPurchaseRequestModel) {
  return apiClient.post<InAppPurchaseResponseModel>(API.SUBSCRIPTION, {
    ...requestModel
  });
}

export const useGeneralApis = () => {
  return {
    getPreferences: useApi(getPreferences),
    getReloadData: useApi(getReloadData),
    redeemBarOffer: useApi(redeemBarOffer),
    favourites: (
      _usePaginatedApi: typeof usePaginatedApi,
      setData: Dispatch<SetStateAction<Venue[] | undefined>>
    ) => {
      return _usePaginatedApi(getFavourites, {}, setData);
    },
    sharedOffers: (
      _usePaginatedApi: typeof usePaginatedApi,
      setData: Dispatch<SetStateAction<Offer[] | undefined>>
    ) => {
      return _usePaginatedApi(getSharedOffers, {}, setData);
    },
    sharedEvents: (
      _usePaginatedApi: typeof usePaginatedApi,
      setData: Dispatch<SetStateAction<Offer[] | undefined>>
    ) => {
      return _usePaginatedApi(getSharedEvents, {}, setData);
    },
    bookMarkedEvents: (
      _usePaginatedApi: typeof usePaginatedApi,
      setData: Dispatch<SetStateAction<Offer[] | undefined>>
    ) => {
      return _usePaginatedApi(getBookMarkedEvents, {}, setData);
    },
    bookMarkedOffers: (
      _usePaginatedApi: typeof usePaginatedApi,
      setData: Dispatch<SetStateAction<Offer[] | undefined>>
    ) => {
      return _usePaginatedApi(getBookMarkedOffers, {}, setData);
    },
    setFavorite: useApi(setFavorite),
    getPaymentMethod: useApi(getPaymentMethod),
    deletePaymentMethod: useApi(deletePaymentMethod),
    addPaymentMethod: useApi(addPaymentMethod),
    updateUser: useApi(updateUser),
    getOrderOffers: useApi(getOrderOffers),
    makeInAppPurchase: useApi(makeInAppPurchase),
    subscription: useApi(subscription)
  };
};
