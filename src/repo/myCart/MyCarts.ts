import { API } from "config";
import { useApi } from "hooks/useApi";
import {
  PaginationParamsModel,
  usePaginatedApi
} from "hooks/usePaginatedApi";
import { AddToCartRequestModel } from "models/api_requests/AddToCartRequestModel";
import { AddToCartResponseModel } from "models/api_responses/AddToCartResponseModel";
import { MyCartResponseModel } from "models/api_responses/MyCartResponseModel";
import { Order } from "models/Order";
import { Dispatch, SetStateAction } from "react";
import { apiClient } from "repo/Client";

function myCarts(
  requestModel?: any,
  paginationParamsModel?: PaginationParamsModel
) {
  return apiClient.get<MyCartResponseModel>(API.CART_URL, {
    ...paginationParamsModel,
    ...requestModel
  });
}

function addToCart(requestModel: AddToCartRequestModel) {
  return apiClient.post<AddToCartResponseModel>(API.CART_URL, {
    ...requestModel
  });
}

export const useMyCartsApis = (
  setData?: Dispatch<SetStateAction<Order[] | undefined>>,
  requestModel: any = undefined
) => {
  function checkNotNull(obj: any) {
    if (!obj) {
      throw new Error("Object cannot be undefined");
    }
    return obj;
  }
  return {
    myCart: usePaginatedApi(myCarts, requestModel, checkNotNull(setData), {
      pagination: true
    })
  };
};

export const useAddCartApi = () => {
  return {
    addToCart: useApi(addToCart)
  };
};
