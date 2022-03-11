import { ApiSuccessResponseModel } from "./ApiSuccessResponseModel";

type ModifierDetailsResponseModel = ApiSuccessResponseModel<
  ModifierDetails[]
>;

export interface ModifierDetails {
  id: number;
  name: string;
  isSelected: boolean;
  price: number;
  modifier_groups: ModifierGroup[];
}

export interface ModifierGroup {
  id: number;
  max?: number;
  min?: number;
  plu: string;
  name: string;
  type: string;
  price?: number;
  account?: null;
  location?: null;
  multiply: null;
  modifiers?: ModifierGroup[];
  multi_max?: number;
  created_at: created_at;
  deleted_at: created_at;
  product_id: number;
  updated_at: created_at;
  delivery_tax: null;
  display_name?: string;
  product_type: number;
  establishment_id: number;
  modifier_group_id: string;
  description?: string;
  modifier_id?: string;
  isSelected?: boolean;
  quantity?: number;
  selectedModifiersCount?: number;
  selectedModifiersQuantity?: number;
  isLeftButtonDisabled?: boolean;
  isRightButtonDisabled?: boolean;
}

export interface created_at {
  date: Date;
  timezone: string;
  timezone_type: number;
}

export default ModifierDetailsResponseModel;
