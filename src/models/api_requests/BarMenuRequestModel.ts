import EPosType from "models/enums/EPosType";

export type BarMenuRequestModel = {
  source?: string;
  establishment_id?: number;
  menu_type?: EPosType;
};
