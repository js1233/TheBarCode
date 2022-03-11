import { Venue } from "models/Venue";
import venue from "../../assets/dummy_data/venue.json";

export const Preferences = [
  {
    id: 1,
    first_name: "Sile"
  },
  {
    id: 2,
    first_name: "Clementia"
  },
  {
    id: 3,
    first_name: "Brita"
  }
];

export const getVenue = () => venue as any as Venue;
