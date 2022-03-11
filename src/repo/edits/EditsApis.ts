import { API } from "config";
import { useApi } from "hooks/useApi";
import { ViewApiRequestModel } from "models/api_requests/ViewApiRequestModel";
import { SetOfferBookMarkedApiRequestModel } from "models/api_requests/SetOfferBookMarkedApiRequestModel";
import { EditsApiResponseModel } from "models/api_responses/EditsApiResponseModel";
import { SendAnalyticsApiResponseModel } from "models/api_responses/SendAnalyticsApiResponseModel";
import { apiClient } from "repo/Client";

function edits() {
  return apiClient.get<EditsApiResponseModel>(API.EDITS_URL, {
    pagination: false
  });
}

function sendAnalytics(requestModel: ViewApiRequestModel) {
  return apiClient.post<SendAnalyticsApiResponseModel>(
    API.POST_VIEW_URL,
    JSON.stringify(requestModel)
  );
}

function setOfferBookmarked(
  requestModel: SetOfferBookMarkedApiRequestModel
) {
  return apiClient.put<SendAnalyticsApiResponseModel>(
    API.SET_OFFER_BOOKMARKED,
    JSON.stringify(requestModel)
  );
}

function setEventBookmarked(
  requestModel: SetOfferBookMarkedApiRequestModel
) {
  return apiClient.put<SendAnalyticsApiResponseModel>(
    API.UPDATE_EVENT_BOOKMARKED,
    JSON.stringify(requestModel)
  );
}

export const useEditsApis = () => {
  return {
    edits: useApi(edits),
    sendAnalytics: useApi(sendAnalytics),
    setOfferBookmarked: useApi(setOfferBookmarked),
    setEventBookmarked: useApi(setEventBookmarked)
  };
};
