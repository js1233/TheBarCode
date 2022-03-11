import { Address } from "models/Address";
import { ListApiSuccessResponseModel } from "models/api_responses/ListApiSuccessResponseModel";

export type GetAddressesResponseModel =
  ListApiSuccessResponseModel<Address>;
