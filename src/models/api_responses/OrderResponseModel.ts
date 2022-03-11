import { Order } from "models/Order";
import { ApiSuccessResponseModel } from "models/api_responses/ApiSuccessResponseModel";

export type OrderResponseModel = ApiSuccessResponseModel<Order>;
