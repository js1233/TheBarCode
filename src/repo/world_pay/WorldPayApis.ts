import { API } from "config";
import { useApi } from "hooks/useApi";
import { WorldPayTokenRequest } from "models/api_requests/WorldPayTokenRequest";
import { worldPayApiClient } from "repo/Client";

function getToken(request: WorldPayTokenRequest) {
  return worldPayApiClient.post<any>(
    API.WORLD_PAY_TOKENS,
    JSON.stringify(request)
  );
}

export const useWorldPayApi = () => {
  return {
    getToken: useApi(getToken)
  };
};
