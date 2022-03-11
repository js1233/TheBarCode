import { COLORS } from "config";
import Constant from "config/Constant";
import { BarMenu } from "./BarMenu";
import DateTime, { toTimeString } from "./DateTime";
import EIntBoolean from "./enums/EIntBoolean";
import EOfferType from "./enums/EOfferType";
import EPaymentGateway from "./enums/EPaymentGateway";
import EPosType from "./enums/EPosType";
import EVenueType from "./enums/EVenueType";
import { Offer } from "./Offer";

export type Venue = {
  id: number;
  user_id: number;
  title: string;
  description: string;
  manager_name: string;
  contact_number: string;
  contact_email: string;
  address: string;
  website?: string;
  latitude: number;
  longitude: number;
  images: StoredFile[];
  video_name: null;
  status: string;
  code: null;
  business_timing: null;
  close_time: null;
  opening_time: null;
  instagram_profile_url?: string;
  twitter_profile_url?: string;
  google_page_url: null;
  facebook_page_url?: string;
  created_at: DateTime;
  updated_at: DateTime;
  deleted_at: null;
  is_unlimited_redemption: boolean;
  is_voucher_on: number;
  type: EVenueType;
  menus: BarMenu[];
  send_notification: number;
  is_payment_app: boolean;
  delivery_distance: number | null;
  is_full_day_delivery: boolean;
  is_delivery_disable: boolean;
  custom_delivery_amount: null;
  min_delivery_charges: null;
  max_delivery_charges: null;
  global_delivery_charges: number | null;
  is_global_delivery: boolean;
  delivery_condition?: string;
  is_reservation: boolean;
  reservation_url?: string;
  is_epos: number;
  client_id?: string;
  client_secret?: string;
  location_id?: string;
  token?: string;
  epos_name: EPosType;
  channel_link_id?: string;
  is_epos_verify: number;
  account_id?: string;
  expire_token: Date | null;
  deliver_by: string;
  post_code?: string;
  city?: string;
  worldpay_merchant_id?: string;
  worldpay_service_key: string | null;
  worldpay_client_key: string | null;
  worldpay_environment: string | null;
  is_worldpay_verify: number;
  square_app_id?: string;
  logo?: string;
  colour: string;
  venue_cover_image?: string;
  is_in_app_payment_service_verified: number;
  payment_sense_jwt_token?: string;
  payment_gateway_type: EPaymentGateway;
  payment_gateway_username?: string;
  payment_gateway_password?: string;
  country: string;
  currency_code: string;
  currency_symbol: string;
  orkestro_type?: string;
  orkestro_api_key?: string;
  dine_in: boolean;
  collection: boolean;
  take_away: boolean;
  delivery: boolean;
  collection_note?: string;
  is_allergen: boolean;
  allergen_description?: string;
  allergen_icons?: string[];
  unread_notification_count: number;
  encodedId: string;
  formatted_updated_at: string;
  video_url?: string;
  video: StoredFile;
  distance: number;
  can_redeem_offer: boolean;
  last_reload_time: null;
  deals: number;
  deals_exclusive: number;
  deals_banner_ads: number;
  live_offers: number;
  is_user_favourite: boolean;
  delivery_timings: DeliveryTiming[];
  region: Region;
  can_unlimited_redeem: boolean;
  credit: number;
  standard_offer: StandardOffer;
  today_delivery_timings: TodayDeliveryTimings;
  establishment_timings: EstablishmentTimings;
  week_establishment_timings: EstablishmentTimings[];
  logo_url?: string;
  venue_cover_image_url?: string;
  is_apple_pay_enabled?: boolean;
  external_url?: string;
  external_url_td?: string;
  is_external_url?: boolean;
  is_oapa: boolean;
};

export type DeliveryTiming = {
  id: number;
  day: string;
  from: string;
  to: string;
  status: DeliveryStatus;
  from_modify: DateTime;
  to_modify: DateTime;
};

export type EstablishmentTimings = {
  is_bar_open?: boolean;
  opening_time: string;
  closed_time: string;
  status: string;
  day: string;
  opening_time_modify: DateTime;
  closed_time_modify: DateTime;
  is_unlimited_redemption: boolean;
};

export type StoredFile = {
  name: string;
  url: string;
};

export type Region = {
  country: string;
  currency_code: string;
  currency_symbol: string;
};

export type StandardOffer = {
  id: number;
  establishment_id: number;
  tier_id: number;
  day: string;
  value: number;
  title: string;
  expires_at: null;
  created_at: Date;
  updated_at: Date;
};

export const toOffer = (standardOffer: StandardOffer) => {
  const offer: Offer = {
    id: standardOffer?.id!,
    establishment_id: standardOffer?.establishment_id!,
    offer_type_id: EOfferType.STANDARD,
    title: `Get ${standardOffer?.value}% off your first order`,
    status: EIntBoolean.TRUE,
    is_notified: EIntBoolean.FALSE,
    distance: 0.0,
    created_at: {
      date: standardOffer?.created_at,
      timezone: Constant.SERVER_TIME_ZONE,
      timezone_type: 3
    },
    updated_at: {
      date: standardOffer?.updated_at,
      timezone: Constant.SERVER_TIME_ZONE,
      timezone_type: 3
    },
    is_date_show: false,
    is_scheduler: EIntBoolean.FALSE,
    is_monday: EIntBoolean.FALSE,
    is_tuesday: EIntBoolean.FALSE,
    is_wednesday: EIntBoolean.FALSE,
    is_thursday: EIntBoolean.FALSE,
    is_friday: EIntBoolean.FALSE,
    is_saturday: EIntBoolean.FALSE,
    is_sunday: EIntBoolean.FALSE,
    is_voucher: false
  };
  return offer;
};

export type TodayDeliveryTimings = {
  day: string;
  from: string;
  to: string;
  status: string;
};

export const isBarOpen = (
  establishmentTiming: EstablishmentTimings
): boolean => {
  return (
    establishmentTiming?.is_bar_open ??
    (false && establishmentTiming.status === "open")
  );
};

export const isBarUnlimitedRedemptionToday = (bar: Venue) => {
  return (
    bar?.is_unlimited_redemption &&
    bar.establishment_timings?.status === "open" &&
    (bar?.establishment_timings?.is_unlimited_redemption ?? false)
  );
};

const BRONZE = { title: "10%", value: 10 };
const SILVER = { title: "15%", value: 15 };
const GOLD = { title: "25%", value: 25 };
const PLATINUM = { title: "50%", value: 50 };

export const getVenuePin = (bar: Venue) => {
  if (!isBarOpen(bar.establishment_timings) && !bar.is_oapa) {
    return "gray_pin";
  } else if (isBarUnlimitedRedemptionToday(bar) && !bar.is_oapa) {
    return "platinum_pin";
  } else if (bar.standard_offer.value === BRONZE.value && !bar.is_oapa) {
    return "bronze_pin";
  } else if (bar.standard_offer.value === SILVER.value && !bar.is_oapa) {
    return "silver_pin";
  } else if (bar.standard_offer.value === GOLD.value && !bar.is_oapa) {
    return "gold_pin";
  } else if (bar.is_oapa) {
    return "oapa_pin";
  } else {
    return "bronze_pin";
  }
};

export const getStandardOfferColor = (bar: Venue) => {
  const _offer = {
    title: bar?.standard_offer?.title,
    value: bar?.standard_offer?.value
  };
  if (_offer.value === BRONZE.value) {
    return COLORS.theme?.primaryColor;
  } else if (_offer.value === SILVER.value) {
    return COLORS.purple;
  } else if (_offer.value === GOLD.value) {
    return COLORS.blue;
  } else if (_offer.value === PLATINUM.value) {
    return COLORS.orange;
  } else {
    return COLORS.blue;
  }
};

export const getDisplayTiming = (venueTimings: EstablishmentTimings) => {
  if (venueTimings?.status === "open") {
    return `${toTimeString(
      venueTimings.opening_time_modify
    )} - ${toTimeString(venueTimings.closed_time_modify)}`;
  } else {
    return "Closed";
  }
};

export const getDeliveryTimingText = (deliveryTiming: DeliveryTiming) => {
  switch (deliveryTiming.status) {
    case DeliveryStatus.ON:
      return `${toTimeString(deliveryTiming.from_modify)} - ${toTimeString(
        deliveryTiming.to_modify
      )}`;
    case DeliveryStatus.OFF:
      return "Closed";
    case DeliveryStatus.ALL_DAY:
      return "24 Hours";
  }
};

enum DeliveryStatus {
  ON = "on",
  OFF = "off",
  ALL_DAY = "24_hours"
}

export const isBarCode = (ePosName: EPosType) =>
  ePosName === EPosType.BARCODE;

export const isDeliverToday = (venue: Venue) => {
  return venue.delivery && venue.today_delivery_timings?.status === "on";
};

export const isBarOperatesToday = (venue: Venue) => {
  return venue.establishment_timings?.status === "open" &&
    venue.establishment_timings?.is_bar_open
    ? true
    : false;
};

export const showbothTabs = (venue: Venue) => {
  if (
    (venue.dine_in || venue.collection) &&
    (venue.take_away || venue.delivery)
  ) {
    return "both";
  } else if (venue.dine_in || venue.collection) {
    return "Dine-In";
  } else if (venue.take_away || venue.delivery) {
    return "Takeaway/Delivery";
  }
};
