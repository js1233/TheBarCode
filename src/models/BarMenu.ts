import { AppLog } from "utils/Util";
import { ModifierDetails } from "./api_responses/ModifierDetailsResponseModel";
import { BarMenuCategory } from "./BarMenuCategory";
import DateTime from "./DateTime";
import EFunnelType from "./enums/EFunnelType";
import EPosType from "./enums/EPosType";
import EProductGroupType from "./enums/EProductGroupType";
import ESupportedOrderType from "./enums/ESupportedOrderType";
import { Modifier, modifierTotalPrice } from "./Modifier";
import { Venue } from "./Venue";

export interface BarMenu {
  id: number;
  establishment_id: number;
  category_id: number;
  name: string;
  image?: string;
  unit: null;
  price: number;
  description: null | string;
  status: number;
  created_at: DateTime;
  updated_at: DateTime;
  deleted_at: null;
  segment_id: number;
  sequence: number;
  menu_type: EPosType;
  plu: null;
  takeaway_delivery: boolean;
  ref_id: number;
  is_push: number;
  dine_in_collection: boolean;
  related_menus_ids: number[] | null;
  group_type: EProductGroupType;
  sub_menu_ids: null | string;
  start_date: Date | null;
  end_date: Date | null;
  start_time: null | string;
  end_time: null | string;
  combo_discount: number | null;
  details: string;
  is_allergen: boolean;
  allergen_description?: string;
  allergen_icons?: string[];
  have_modifiers: boolean;
  category: BarMenuCategory;
  establishment: Venue;
  image_name: null | string;
  related_menus?: BarMenu[];
  quantity: number;
  total: number;
  cart_item_id?: number | null;
  comment: null;
  sub_menus?: BarMenu[];
  modifiers?: Modifier[];
  key?: () => string;
  exclusive_offer_id: number;
  deal_price?: number;
  bundle_offer_type?: EFunnelType;
  bundle_discount?: number;
  free_funnel_id?: number;
  currency_symbol?: string;
  modifiers_acc_quan?: [[Modifier]] | [[]];
  basic_bogo?: boolean;
  items?: [BarMenu]; //value come in case of bundle
  funnel_details?:
    | [
        {
          id: string;
          menus: {
            id: string;
            quantity: number;
            modifier_details?: [ModifierDetails];
          };
        }
      ]
    | [];
  modifier_details?: Modifier[][]; //comes in case of bundle bogo in order summary
  offer_type?: string;
}

export const barMenuTotalPrice = (menu: BarMenu): number => {
  return barMenuUnitPrice(menu) * menu.quantity;
};

export const calculateBundlePrice = (menu: BarMenu): number => {
  let priceContainer: number[] = [];
  menu.sub_menus?.map((subMenu) => {
    let total: number = 0;
    total = subMenu.price;
    subMenu.modifiers?.map((modifier) => {
      total += modifier.price * modifier.quantity;
    });
    priceContainer.push(total);
  });
  let largest =
    priceContainer.length > 0 ? Math.max.apply(0, priceContainer) : 0;
  return largest;
};

export const barMenuUnitPrice = (menu: BarMenu): number => {
  // menu.total is used in case of bundle
  let total = isBundleBogo(menu) ? menu.total ?? 0.0 : menu.price;
  menu.modifiers?.forEach((_item) => {
    total += modifierTotalPrice(_item);
  });

  menu.sub_menus?.forEach((item) => {
    total += barMenuUnitPrice(item);
  });

  if (isBundleBogo(menu)) {
    total = total / menu.quantity;
  }
  return total;
};

export const isMenuOffersMultiCategories = (menu: BarMenu) => {
  return (
    menu.menu_type === EPosType.BARCODE &&
    menu.dine_in_collection &&
    menu.takeaway_delivery
  );
};

export const supportedOrderTypes = (menu: BarMenu) => {
  if (menu.dine_in_collection && menu.takeaway_delivery) {
    return ESupportedOrderType.ALL;
  } else if (menu.dine_in_collection) {
    return ESupportedOrderType.DINE_IN_COLLECTION;
  } else if (menu.takeaway_delivery) {
    return ESupportedOrderType.TAKEAWAY_DELIVERY;
  } else {
    return ESupportedOrderType.ALL;
  }
};

export const getAlergensIcon = (item: string) => {
  switch (item) {
    case "milk":
      return require("assets/images/milk.png");
    case "brazil-nut":
      return require("assets/images/brazil-nut.png");
    case "celery":
      return require("assets/images/cellery.png");
    case "crustacens":
      return require("assets/images/crustacea.png");
    case "eggs":
      return require("assets/images/egg.png");
    case "fish":
      return require("assets/images/fish.png");
    case "lupin":
      return require("assets/images/lupine.png");
    case "mustard":
      return require("assets/images/mustard.png");
    case "peanut":
      return require("assets/images/peanut.png");
    case "sesame":
      return require("assets/images/sesame-seed.png");
    case "soya":
      return require("assets/images/soya.png");
    case "sulphurdioxide":
      return require("assets/images/sulphurdioxide.png");
    case "molluscs":
      return require("assets/images/molluscs.png");
    case "wheat":
      return require("assets/images/wheat.png");
    default:
      AppLog.log(() => "Image doesn't exist " + item);
      break;
  }
};

export const isBundleBogo = (menu: BarMenu) =>
  menu.group_type === EProductGroupType.BUNDLE ||
  menu.group_type === EProductGroupType.BOGO;

export const isBasicBogo = (menu: BarMenu) =>
  menu?.group_type === EProductGroupType.BOGO && menu.basic_bogo;
