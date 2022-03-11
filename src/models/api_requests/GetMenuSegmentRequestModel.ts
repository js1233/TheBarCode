import ESupportedOrderType from "models/enums/ESupportedOrderType";

export type GetMenuSegmentRequestModel = {
  establishment_id: string;
  supported_order_type?: ESupportedOrderType;
};
