import { ApiSuccessResponseModel } from "./ApiSuccessResponseModel";

export type SendAnalyticsApiResponseModel =
  ApiSuccessResponseModel<SendAnalyticsResponse>;

export interface SendAnalyticsResponse {
  response: Response;
}

export interface Response {
  data: Analytics;
  message: string;
}

export interface Analytics {
  id: number;
  user_id: number;
  value: number;
  type: string;
}
