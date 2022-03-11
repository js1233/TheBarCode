export type VenueSearchApiRequestModel = {
  type?: string;
  is_delivering?: string;
  is_for_map?: string | undefined;
  keyword?: string;
  interest_ids?: number[];
  tier_ids?: number[];
  is_unlimited_redemption?: string;
  establishment_id?: string;
  supported_order_type?: string;
  search_all?: boolean;
};
