import { API } from "config";
import { useApi } from "hooks/useApi";
import {
  PaginationParamsModel,
  usePaginatedApi
} from "hooks/usePaginatedApi";
import { GetMenuSegmentRequestModel } from "models/api_requests/GetMenuSegmentRequestModel";
import { GetModifierDetailsRequestModel } from "models/api_requests/GetModifierDetailsRequestModel";
import { UpdateEstablishmentFavStatusModel } from "models/api_requests/UpdateEstablishmentFavStatusModel";
import { VenuesRequestModel } from "models/api_requests/VenuesRequestModel";
import { WhatsOnEventsApiRequestModel } from "models/api_requests/WhatsOnEventsApiRequestModel";
import { EditsApiResponseModel } from "models/api_responses/EditsApiResponseModel";
import GetSegmentResponseModel from "models/api_responses/GetSegmentResponseModel";
import ModifierDetailsResponseModel from "models/api_responses/ModifierDetailsResponseModel";
import { VenueApiResponseModel } from "models/api_responses/VenueApiReponseModel";
import { Dispatch, SetStateAction } from "react";
import { apiClient } from "repo/Client";
import { BarMenuRequestModel } from "models/api_requests/BarMenuRequestModel";
import { VenueOfferApiRequestModel } from "models/api_requests/VenueOfferApiRequestModel";
import { SearchAllResponseModel } from "models/api_responses/SearchAllResponseModel";
import { VenueSearchApiRequestModel } from "models/api_requests/VenueSearchApiRequestModel";
import { FetchSingleProductRequestModel } from "models/api_requests/FetchSingleProductRequestModel";
import { CartCountRequestModel } from "models/api_requests/CartCountRequestModel";

function venues(
  requestModel?: VenuesRequestModel,
  paginationParamsModel?: PaginationParamsModel
) {
  return apiClient.get<VenueApiResponseModel>(API.VENUE_URL, {
    ...paginationParamsModel,
    ...requestModel
  });
}

function getBarMenus(requestModel?: BarMenuRequestModel) {
  return apiClient.get<any>(API.GET_BAR_MENUS, {
    ...requestModel
  });
}

function getBarMenuSegments(requestModel?: GetMenuSegmentRequestModel) {
  return apiClient.get<GetSegmentResponseModel>(API.GET_BAR_SEGMENTS, {
    ...requestModel
  });
}

function getProductModifiers(
  requestModel: GetModifierDetailsRequestModel
) {
  return apiClient.get<ModifierDetailsResponseModel>(API.MODIFIER_Group, {
    ...requestModel
  });
}

function getBogoBundleData(requestModel: GetModifierDetailsRequestModel) {
  return apiClient.get<GetSegmentResponseModel>(
    API.GET_BOGO_BUNDLE_ITEMS,
    {
      ...requestModel,
      pagination: false
    }
  );
}

function updateEstablishmentFavStatus(
  requestModel: UpdateEstablishmentFavStatusModel
) {
  return apiClient.put<any>(
    API.UPDATE_FAV_ESTABLISHMENT_URL + `${requestModel.establishment_id}`
  );
}

function getBarDetailsById(requestModel: BarMenuRequestModel) {
  return apiClient.get<any>(
    API.VENUE_URL + "/" + requestModel.establishment_id
  );
}

function getSingleProduct(requestModel?: FetchSingleProductRequestModel) {
  return apiClient.get<any>(
    API.GET_BAR_MENUS + "/" + requestModel?.product_id,
    {
      ...requestModel
    }
  );
}

function events(
  requestModel?: WhatsOnEventsApiRequestModel,
  paginationParamsModel?: PaginationParamsModel
) {
  return apiClient.get<EditsApiResponseModel>(API.GET_VENUE_EVENTS, {
    ...paginationParamsModel,
    ...requestModel
  });
}

function offers(requestModel?: VenueOfferApiRequestModel) {
  return apiClient.get<EditsApiResponseModel>(API.VENUE_OFFER, {
    ...requestModel
  });
}

function searchAll(requestModel: VenueSearchApiRequestModel) {
  return apiClient.get<SearchAllResponseModel>(API.GET_SEARCH_ALL, {
    ...requestModel
  });
}

function getVenueCartCount(requestModel: CartCountRequestModel) {
  return apiClient.get<any>(API.CART_COUNT, {
    ...requestModel
  });
}

function menuSearch(
  requestModel?: VenueSearchApiRequestModel,
  paginationParamsModel?: PaginationParamsModel
) {
  return apiClient.get<VenueApiResponseModel>(API.GET_BAR_MENUS, {
    ...paginationParamsModel,
    ...requestModel
  });
}

export const useVenuePaginatedApis = (
  setData?: Dispatch<SetStateAction<any>>,
  requestModel: any = undefined,
  needPagination: boolean = true
) => {
  function checkNotNull(obj: any) {
    if (!obj) {
      throw new Error("Object cannot be undefined");
    }
    return obj;
  }
  return {
    venue: usePaginatedApi(venues, requestModel, checkNotNull(setData), {
      pagination: needPagination
    }),
    menu: usePaginatedApi(
      menuSearch,
      requestModel,
      checkNotNull(setData),
      {
        pagination: needPagination
      }
    ),
    searchAll: usePaginatedApi(
      searchAll,
      requestModel,
      checkNotNull(setData),
      {
        pagination: needPagination
      }
    ),
    updateEstablismentFavStatus: useApi(updateEstablishmentFavStatus),
    events: usePaginatedApi(events, requestModel, checkNotNull(setData), {
      pagination: needPagination
    })
  };
};

export const useVenueApis = () => {
  return {
    getBarMenuSegments: useApi(getBarMenuSegments),
    getProductModifiers: useApi(getProductModifiers),
    getBarMenus: useApi(getBarMenus),
    getBarDetailsById: useApi(getBarDetailsById),
    offers: useApi(offers),
    getSingleProduct: useApi(getSingleProduct),
    venueCartCount: useApi(getVenueCartCount),
    getBogoBundleData: useApi(getBogoBundleData)
    // searchAll: useApi(searchAll)
  };
};
