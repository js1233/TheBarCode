import { API } from "config";
import { useApi } from "hooks/useApi";
import { PostInfluenceCountApiRequestModel } from "models/api_requests/PostInfluenceCountApiRequestModel";
import { PostInviteLinkApiRequestModel } from "models/api_requests/PostInviteLinkApiRequestModel";
import { SendInviteApiRequestModel } from "models/api_requests/SendInviteApiRequestModel";
import { UpdateSharedOfferEventApiRequestModel } from "models/api_requests/UpdateSharedOfferEventApiRequestModel";
import { SendAnalyticsApiResponseModel } from "models/api_responses/SendAnalyticsApiResponseModel";
import { apiClient } from "repo/Client";

function sendInvite(requestModel: SendInviteApiRequestModel) {
  return apiClient.post<SendAnalyticsApiResponseModel>(
    API.INVITE_URL,
    JSON.stringify(requestModel)
  );
}

function postAppLinkShared(requestModel: PostInviteLinkApiRequestModel) {
  return apiClient.post<SendAnalyticsApiResponseModel>(
    API.POST_APP_LINK_SHARED,
    JSON.stringify(requestModel)
  );
}

function updateSharedOffersOnServer(
  requestModel: UpdateSharedOfferEventApiRequestModel
) {
  return apiClient.post<SendAnalyticsApiResponseModel>(
    API.UPDATE_SHARED_OFFERS,
    JSON.stringify(requestModel)
  );
}

function postSharedEvent(
  requestModel: UpdateSharedOfferEventApiRequestModel
) {
  return apiClient.post<SendAnalyticsApiResponseModel>(
    API.POST_SHARED_EVENT,
    JSON.stringify(requestModel)
  );
}

function postInfluencerCount(
  requestModel: PostInfluenceCountApiRequestModel
) {
  return apiClient.post<SendAnalyticsApiResponseModel>(
    API.POST_INFLUENCER_COUNT,
    JSON.stringify(requestModel)
  );
}

export const useInviteApis = () => {
  return {
    sendInvite: useApi(sendInvite),
    postAppLinkShared: useApi(postAppLinkShared),
    postSharedEvent: useApi(postSharedEvent),
    updateSharedOffersOnServer: useApi(updateSharedOffersOnServer),
    updateInfluenceCount: useApi(postInfluencerCount)
  };
};
