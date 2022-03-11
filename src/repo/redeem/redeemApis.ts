import { API } from "config";
import { useApi } from "hooks/useApi";
import { RedeemDealRequestModel } from "models/api_requests/RedeemDealRequestModel";
import { ForceUpdateResponseModel } from "models/api_responses/ForceUpdateResponseModel";
import { apiClient } from "repo/Client";

function getSubscriptionDetails(requestModel: RedeemDealRequestModel) {
  return apiClient.get<ForceUpdateResponseModel>(API.GET_RELOAD_DATA, {
    requestModel
  });
}

export const useRedeemApi = () => {
  return {
    getSubscriptionDetails: useApi(getSubscriptionDetails)
  };
};
