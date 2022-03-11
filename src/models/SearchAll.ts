import { Offer } from "./Offer";
import { Venue } from "./Venue";

export type SearchAll = {
  title: string;
  type: number;
  results: Venue[] | Offer[];
  is_results_complete: boolean;
};
