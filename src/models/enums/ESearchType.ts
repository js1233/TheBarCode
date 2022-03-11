enum ESearchType {
  VENUE,
  OAPA,
  OFFER,
  TAKE_AWAY_DELIVERY,
  EVENTS
}

export type SearchTab = {
  id: ESearchType | undefined;
  displayText: string;
};

export const searchTabs: SearchTab[] = [
  { id: ESearchType.VENUE, displayText: "Venues" },
  { id: ESearchType.OAPA, displayText: "OAPA" },
  { id: ESearchType.OFFER, displayText: "Offers" },
  {
    id: ESearchType.TAKE_AWAY_DELIVERY,
    displayText: "Takeaway / Delivery"
  },
  { id: ESearchType.EVENTS, displayText: "Events" }
];

export default ESearchType;
