export type CreateOrderRequestModel = {
  cart_id: string;
  type: string;
  address_id?: string;
  table_no?: string;
  contact_number?: string;
  order_tip?: string;
  save_delivery_contact?: string;
  comment?: string;
};
