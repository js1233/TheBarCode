import { Order } from "models/Order";
import { ApiSuccessResponseModel } from "./ApiSuccessResponseModel";

export type CreateOrderResponseModel = ApiSuccessResponseModel<Order>;
