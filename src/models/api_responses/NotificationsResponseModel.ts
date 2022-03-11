import { ListApiSuccessResponseModel } from "models/api_responses/ListApiSuccessResponseModel";
import Notification from "models/Notification";

export type NotificationsResponseModel =
  ListApiSuccessResponseModel<Notification>;
