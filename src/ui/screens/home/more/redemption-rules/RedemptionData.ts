import { RegionData } from "models/api_responses/ForceUpdateResponseModel";

export type RedemptionRules = {
  rule: string;
};

export const data = (regionData?: RegionData): RedemptionRules[] => [
  {
    rule: "You sign up to The Barcode you are entitled to a 'Members Discount' in all our partner venues. This is a percentage off your first round. These 'members discount' are either 10%, 15% or 25% and are signposted by the colour of the pins on our map view. Check out who's offering what and where."
  },
  {
    rule: "When you sign up to The Barcode you can receive a Barcode Members Discount in all our featured venues."
  },
  {
    rule: "The members discount can be used on any day, at any time and on any order you wish as long as you have not already used it during your current access period."
  },
  {
    rule:
      "The members discount applies to any order up to a value of " +
      regionData?.currency_symbol +
      regionData?.round +
      ". If the value of the round comes to greater than " +
      regionData?.currency_symbol +
      regionData?.round +
      ", then the discount is capped at " +
      regionData?.currency_symbol +
      "5.00 thereafter."
  },
  {
    rule:
      "You can redeem any offer once (either a Trending, Exclusive or The Members Discount) in each venue, every 7 days. When the clock hits 0:00:00:00 at the end of 7 days, you can 'Reload' and regain access to all offers, at any previously visited venues, for just " +
      regionData?.currency_symbol +
      regionData?.reload +
      "."
  },
  {
    rule: "You can redeem more offers during your access period by applying credits against either unique venue offers or the members discount offer."
  },
  {
    rule: "You can redeem a maximum of 2 offers per venue per night."
  },
  {
    rule: "When you download the app you have full access to all offers at all our featured venues. When you redeem your first offer, the countdown timer starts and your 7 day access period begins."
  },
  {
    rule:
      "When the countdown timer reaches zero you can pay " +
      regionData?.currency_symbol +
      regionData?.reload +
      " to 'Reload'. This will give you full access to all the offers at venues you have previously visited and allow you to regain access to your credits."
  },
  {
    rule: "When the timer hits zero you do not have to 'Reload, you can still use offers at venues where you have not previously redeemed. Until you Reload though, you will not be able to access your credits or redeem offers where you have previously redeemed."
  },
  {
    rule: "If you share a Trending offer with friends you will receive credits when they redeem those offers. 1 shared offer redeemed = 1 credit."
  }
];
