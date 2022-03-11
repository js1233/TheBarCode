import DateTime from "./DateTime";

export type Modifier = {
  id: number;
  establishment_id: number;
  product_id: number;
  product_type: number;
  modifier_group_id: string;
  modifier_id: string;
  plu: string;
  name: string;
  price: number;
  total: number;
  delivery_tax: null;
  min: null;
  max: null;
  multiply: null;
  description: null | string;
  type: string;
  created_at: DateTime;
  updated_at: DateTime;
  deleted_at: null;
  quantity: number;
};

export const modifierTotalPrice = (modifier: Modifier) => {
  return modifier.quantity * (modifier.price ?? 0.0);
};
