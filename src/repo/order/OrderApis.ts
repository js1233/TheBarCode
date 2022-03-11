import {
  PaginationParamsModel,
  usePaginatedApi
} from "hooks/usePaginatedApi";
import { apiClient } from "repo/Client";
import { API } from "config";
import { Dispatch, SetStateAction } from "react";
import { Order } from "models/Order";
import { MyCartResponseModel } from "models/api_responses/MyCartResponseModel";
import { OrderResponseModel } from "models/api_responses/OrderResponseModel";
import { CreateOrderRequestModel } from "models/api_requests/CreateOrderRequestModel";
import { CreateOrderResponseModel } from "models/api_responses/CreateOrderResponseModel";
import { useApi } from "hooks/useApi";
import { ReOrderRequestModel } from "models/api_requests/ReOrderRequestModel";
import { PostPaymentRequestModel } from "models/api_requests/PostPaymentRequestModel";
import { CancelOrderRequestModel } from "models/api_requests/CancelOrderRequestModel";
import { CancelOrderResponseModel } from "models/api_responses/CancelOrderResponseModel";

function orders(
  requestModel: any,
  paginationParamsModel?: PaginationParamsModel
) {
  return apiClient.get<MyCartResponseModel>(API.ORDER_URL, {
    ...paginationParamsModel
  });
}

function getOrderById(data: { orderId: number; is_splitting?: boolean }) {
  return apiClient.get<OrderResponseModel>(
    API.ORDER_URL + "/" + data.orderId,
    { ...data }
  );
}

function createOrder(requestModel: CreateOrderRequestModel) {
  return apiClient.post<CreateOrderResponseModel>(API.ORDER_URL, {
    ...requestModel
  });
}

function reOrder(requestModel: ReOrderRequestModel) {
  return apiClient.post<any>(API.POST_REORDER, {
    ...requestModel
  });
}

function cancelOrder(requestModel: CancelOrderRequestModel) {
  return apiClient.post<CancelOrderResponseModel>(API.CANCEL_ORDER, {
    ...requestModel
  });
}

function postPayment(requestModel: PostPaymentRequestModel) {
  return apiClient.post<OrderResponseModel>(API.POST_PAYMENT, {
    ...requestModel
  });
}

function updatePayment(requestModel: PostPaymentRequestModel) {
  return apiClient.post<OrderResponseModel>(API.POST_UPDATE_PAYMENT, {
    ...requestModel
  });
}

export const useOrderPaginatedApis = (
  setData?: Dispatch<SetStateAction<Order[] | undefined>>,
  preProccessor?: (data: Order[]) => Order[]
) => {
  function checkNotNull(obj: any) {
    if (!obj) {
      throw new Error("Object cannot be undefined");
    }
    return obj;
  }
  return {
    orders: usePaginatedApi(
      orders,
      undefined,
      checkNotNull(setData),
      undefined,
      preProccessor
    )
  };
};

export const useOrderApis = () => {
  return {
    createOrder: useApi(createOrder),
    getOrderById: useApi(getOrderById),
    reOrder: useApi(reOrder),
    postPayment: useApi(postPayment),
    updatePayment: useApi(updatePayment),
    cancelOrder: useApi(cancelOrder)
  };
};
