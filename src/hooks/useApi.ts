import { ApiResponse } from "apisauce";
import { useAppDispatch } from "hooks/redux";
import { PaginationParamsModel } from "hooks/usePaginatedApi/PaginationParamsModel";
import { ApiErrorResponseModel } from "models/api_responses/ApiErrorResponseModel";
import { useRef, useState } from "react";
import { logOut } from "stores/authSlice";
import { AppLog, TAG } from "utils/Util";
// import crashlytics from "@react-native-firebase/crashlytics";

export type ApiMethodType<T, U, V> =
  | ((
      args: T,
      params?: PaginationParamsModel
    ) => Promise<ApiResponse<U, V>>)
  | ((params?: PaginationParamsModel) => Promise<ApiResponse<U, V>>);

export const useApi = <
  T,
  U,
  V extends ApiErrorResponseModel = ApiErrorResponseModel
>(
  apiFunc: ApiMethodType<T, U, V>,
  shouldChangeLoadingStatusUponSuccessfullCompletion: boolean = true
) => {
  const [data, setData] = useState<U | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();

  type RequestReturnType =
    | {
        hasError: false;
        errorBody?: undefined;
        dataBody: U;
        statusCode?: number;
      }
    | {
        hasError: true;
        errorBody: string;
        dataBody?: undefined;
        statusCode?: number;
      };

  const request = async (
    args: T,
    params?: PaginationParamsModel,
    shouldUpdateStates: boolean = true
  ): Promise<RequestReturnType> => {
    if (shouldUpdateStates) {
      setLoading(true);
      setError(undefined);
    }

    AppLog.log(() => "Request Body:", TAG.API);
    AppLog.log(() => JSON.stringify({ ...args, ...params }), TAG.API);

    let response: any;
    try {
      response = await apiFunc(args, params);
    } catch (e) {
      AppLog.bug("Error while calling apiFunc(...args): ");
      AppLog.bug(e);
    }

    AppLog.log(() => "Response Body:", TAG.API);
    AppLog.log(
      () => response?.config?.url + ": " + JSON.stringify(response),
      TAG.API
    );

    if (!response?.ok) {
      // move user to login screen if the token has expired
      let errorBody: string;
      if (response?.status === 401) {
        errorBody = "Token expired";
        dispatch(logOut());
      } else {
        errorBody = getErrorMessage(response?.data);
      }
      if (shouldUpdateStates) {
        setError(errorBody);
        setLoading(false);
      }
      // crashlytics().recordError({
      //   name: errorBody,
      //   message: errorBody,
      //   stack: `${response?.status}`
      // });
      return { hasError: true, errorBody, statusCode: response?.status };
    } else {
      let dataBody = response.data.response ?? response.data;
      if (shouldUpdateStates) {
        setData(dataBody);
        if (shouldChangeLoadingStatusUponSuccessfullCompletion) {
          setLoading(false);
        }
      }
      return { hasError: false, dataBody, statusCode: response?.status };
    }
  };

  const result = useRef({ data, error, loading, request });
  Object.assign(result.current, { data, error, loading, request });
  return result.current;
};

const getErrorMessage = (response: any) => {
  //this line response?.response?.data
  //returns response for world pay on response code 428

  let message =
    response?.response?.message ??
    response?.message ??
    response?.response?.data ??
    "An unexpected error occurred.";
  if (response?.errors !== undefined) {
    message = "";
    Object.values(response.errors).map((value) => {
      message += (value as string[]).join(" ");
    });
  }
  return message;
};
