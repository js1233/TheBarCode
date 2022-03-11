import { BarMenu } from "models/BarMenu";
import DateTime from "models/DateTime";
import EFunnelType from "models/enums/EFunnelType";
import EPosType from "models/enums/EPosType";
import EProductGroupType from "models/enums/EProductGroupType";
import { EstablishmentTimings } from "models/Venue";
import { ApiSuccessResponseModel } from "./ApiSuccessResponseModel";

type GetSegmentResponseModel = ApiSuccessResponseModel<MenuSegment[]>;

export interface MenuSegment {
  id: number;
  menu_id?: number;
  quantity?: number;
  free_item_quantity?: number;
  establishment_id: number;
  name: string;
  status: number;
  sequence: number;
  created_at: DateTime;
  updated_at: DateTime;
  deleted_at: null;
  menu_type: EPosType;
  epos_category_id: null;
  is_time: number;
  start_time: null | string;
  end_time: null | string;
  items: BarMenu[];
  establishment_timings?: EstablishmentTimings;
  description?: string;
  type?: EProductGroupType;
  bundle_discount?: number;
  bundle_offer_type?: EFunnelType;
  already_selected_quantity?: number; //used for client side validation in bundle bogo
  key: () => string;
}

export default GetSegmentResponseModel;
