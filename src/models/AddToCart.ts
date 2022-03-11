import { BarMenu } from "./BarMenu";
import DateTime from "./DateTime";
import { Venue } from "./Venue";

export type AddToCart = {
  id: number;
  user_id: number;
  establishment_id: number;
  order_id: null;
  created_at: DateTime;
  updated_at: DateTime;
  epos_type: string;
  cart_type: string;
  offer_type: null;
  redeem_type: null;
  establishment: Venue;
  menuItems: BarMenu[];
  total: number;
};
