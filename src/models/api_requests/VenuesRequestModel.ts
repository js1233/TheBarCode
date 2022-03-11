export type VenuesRequestModel = {
  type: VenueContentType;
  is_for_map?: string;
  keyword?: string;
  interest_ids?: string[];
  tierIds?: string[];
  is_unlimited_redemption?: string;
  is_delivering?: boolean;
};

export enum VenueContentType {
  BARS = "bars",
  DEAL_BAR = "deals"
}
