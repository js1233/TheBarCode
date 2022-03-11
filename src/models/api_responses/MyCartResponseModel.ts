import { ListApiSuccessResponseModel } from "models/api_responses/ListApiSuccessResponseModel";
import { Order } from "models/Order";

export type MyCartResponseModel = ListApiSuccessResponseModel<Order>;
