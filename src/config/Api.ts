import Env from "envs/env";

export default {
  BASE_URL: Env.BASE_URL,
  API_URL: "api/",
  CHECK_FOCRCE_UPDATE: "version?platform=android&version=",

  // Auth
  LOGIN_URL: "auth/login",
  LOGOUT_URL: "auth/logout",
  SIGN_UP: "auth/register",
  VERIFY_NUMBER: "auth/verify-number",
  POST_ACTIVATE: "user/customer-activate",
  POST_ACTIVATE_MOBILE: "auth/activate-number",
  POST_RESEND_EMAIL: "user/resend-activation-email",
  POST_RESEND_CODE: "user/resend-activation-code",
  PUT_UPDATE: "user/",
  PUT_REFERRAL_CODE: "user/update-referral-code",
  PUT_UPDATE_LOCATION: "user/update-location",
  POST_USER_PREFERENCES: "userinterest/update-user-interest",
  POST_SOCIAL_SIGN_IN: "social/login",
  POST_FORGOT_PASSWORD: "auth/password/email",
  POST_CHANGE_PASSWORD: "auth/password/reset",

  POST_VIEW_URL: "view",
  INVITE_URL: "send-invite",
  VENUE_URL: "establishment",
  CART_COUNT: "cart-count",
  UPDATE_FAV_ESTABLISHMENT_URL: "user-favorite-establishment/update",
  GET_BAR_SEGMENTS: "establishment-segment",
  MODIFIER_Group: "modifier-group",
  GET_BAR_MENUS: "establishment-menu",
  GET_BOGO_BUNDLE_ITEMS: "funnel",

  // User Info
  GET_RELOAD_DATA: "subscription/detail",
  POST_REDEEM_OFFER: "offer-redeem",
  GET_PREFERENCES: "interest",
  GET_ORDER_OFFERS: "offers/detail",
  CART_URL: "cart",
  ORDER_URL: "order",
  POST_REORDER: "re-order",
  CANCEL_ORDER: "cancel-order",
  SET_OFFER_BOOKMARKED: "user-favorite-offer/update",
  UPDATE_EVENT_BOOKMARKED: "user-bookmark-event/update",
  NOTIFICATION_URL: "user-notification",
  ADDRESSES_URL: "address/",
  EDITS_URL: "five-a-day",
  GET_FAVOURITE: "user-favorite-establishment",
  GET_SHARED_OFFERS: "share",
  GET_SHARED_EVENTS: "event-share",
  GET_FAV_EVENTS: "user-bookmark-event",
  GET_VENUE_EVENTS: "establishment-event",
  GET_FAV_OFFERS: "user-favorite-offer",
  PUT_SET_BAR_FAVOURITE: "user-favorite-establishment/update",
  VENUE_OFFER: "offer",
  POST_APP_LINK_SHARED: "app-shared",
  POST_SHARED_EVENT: "event-share",
  UPDATE_SHARED_OFFERS: "share",
  card: "card/",
  GET_UNREAD_NOTIFICATIONS_COUNT: "user-not-read-notification",
  POST_INFLUENCER_COUNT: "influencer-counter",
  ESTABLISHMENT_SUBSCRIPTION: "establishment-subscription",
  SUBSCRIPTION: "subscription",
  GET_SEARCH_ALL: "search/all",

  ADD_CARD_PAYMENT_SENSE: "payment-sense",

  POST_PAYMENT: "payment",
  POST_UPDATE_PAYMENT: "update-payment",

  // WorldPay
  WORLD_PAY_TERM_URL: "https://online.worldpay.com/3dsr/",
  WORLD_PAY_3D_RESPONSE_SCHEME: "worldpay-scheme",
  WORLD_PAY_BASE_URL: "https://api.worldpay.com/v1/",
  WORLD_PAY_TOKENS: "tokens"
};
