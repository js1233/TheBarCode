import { API } from "config";
import {
  PaginationParamsModel,
  usePaginatedApi
} from "hooks/usePaginatedApi";
import { Dispatch, SetStateAction } from "react";
import { apiClient } from "repo/Client";
import Notification from "models/Notification";
import { NotificationsResponseModel } from "models/api_responses/NotificationsResponseModel";
import { useApi } from "hooks/useApi";

function Notifications(
  requestModel?: any,
  paginationParamsModel?: PaginationParamsModel
) {
  return apiClient.get<NotificationsResponseModel>(API.NOTIFICATION_URL, {
    ...paginationParamsModel,
    ...requestModel
  });
}

function getNotificationCount(requestModel?: any) {
  return apiClient.get<any>(API.GET_UNREAD_NOTIFICATIONS_COUNT, {
    ...requestModel
  });
}

export const useNotificationPaginatedApis = (
  setData?: Dispatch<SetStateAction<Notification[] | undefined>>
) => {
  function checkNotNull(obj: any) {
    if (!obj) {
      throw new Error("Object cannot be undefined");
    }
    return obj;
  }
  return {
    notification: usePaginatedApi(
      Notifications,
      undefined,
      checkNotNull(setData)
    )
  };
};

export const useNotificationApi = () => {
  return { getNotificationCount: useApi(getNotificationCount) };
};
