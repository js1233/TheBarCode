import { Dispatch, SetStateAction } from "react";
import { apiClient } from "repo/Client";
import { API } from "config";
import {
  PaginationParamsModel,
  usePaginatedApi
} from "hooks/usePaginatedApi";
import { GetAddressesResponseModel } from "models/api_responses/GetAddressessResponseModel";
import { useApi } from "hooks/useApi";
import { AddAddressRequestModel } from "models/api_requests/AddAddressRequestModel";
import { AddressResponseModel } from "models/api_responses/AddressResponseModel";
import { Address } from "models/Address";

function getAddresses(
  requestModel?: any,
  paginationParamsModel?: PaginationParamsModel
) {
  return apiClient.get<GetAddressesResponseModel>(API.ADDRESSES_URL, {
    ...paginationParamsModel,
    ...requestModel
  });
}

function editAddress(requestModel: AddAddressRequestModel) {
  return apiClient.put<any>(
    API.ADDRESSES_URL + `${requestModel.id}`,
    JSON.stringify(requestModel)
  );
}

function deleteAddress(addressId: number) {
  return apiClient.delete<AddressResponseModel>(
    API.ADDRESSES_URL + addressId
  );
}

function addAddress(requestModel: AddAddressRequestModel) {
  return apiClient.post<AddressResponseModel>(
    API.ADDRESSES_URL,
    JSON.stringify(requestModel)
  );
}

export const useAddressPaginatedApis = (
  setData?: Dispatch<SetStateAction<Address[] | undefined>>
) => {
  function checkNotNull(obj: any) {
    if (!obj) {
      throw new Error("Object cannot be undefined");
    }
    return obj;
  }
  return {
    addresses: usePaginatedApi(
      getAddresses,
      undefined,
      checkNotNull(setData)
    )
  };
};

export const useAddressApi = () => {
  return {
    addAddress: useApi(addAddress),
    editAddress: useApi(editAddress),
    deleteAddress: useApi(deleteAddress)
  };
};
