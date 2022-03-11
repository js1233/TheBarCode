import EOfferRedemptionFilter from "./enums/EOfferRedemptionFilter";

type SearchParams = {
  keyword?: string;
  preferenceIds?: number[];
  standardOfferIds?: number[];
  isDelivery?: boolean;
  redemptionFilter?: EOfferRedemptionFilter;
};

export default SearchParams;
