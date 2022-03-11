import { RegionData } from "models/api_responses/ForceUpdateResponseModel";
import {
  BaseItem,
  Section
} from "ui/components/organisms/sectioned_list/SectionedList";

export type HeaderModel = BaseItem & { question: string };
export type BodyModel = BaseItem & { answer: string };
export const faqsData = (
  regionData?: RegionData
): Section<HeaderModel, BodyModel>[] => [
  {
    header: {
      question: "How much discount do we receive?",
      key: function () {
        return this.question;
      }
    },
    data: [
      {
        answer:
          "The members discount ranges from a minimum of 10% up to 25% off your first round. Keep your eye out though, venues provide plenty of varied offers that are greater than the member discount at different times and for different events.",
        key: function () {
          return this.answer;
        }
      }
    ]
  },
  {
    header: {
      question: "What constitutes a round?",
      key: function () {
        return this.question;
      }
    },
    data: [
      {
        answer:
          "A Barcode round is " +
          regionData?.currency_symbol +
          regionData?.round +
          ".",
        key: function () {
          return this.answer;
        }
      }
    ]
  },
  {
    header: {
      question: "How do I claim my discount?",
      key: function () {
        return this.question;
      }
    },
    data: [
      {
        answer:
          "You simply order your drinks and tell the bartender that you are using The Barcode. " +
          'For offer redemption you must be in the vicinity of the venue and when it is time to pay, press "Redeem", ' +
          "the offer will be redeemed and the discount will be applied to your " +
          "bill, Simple!",
        key: function () {
          return this.answer;
        }
      }
    ]
  },
  {
    header: {
      question: "How often can I reload?",
      key: function () {
        return this.question;
      }
    },
    data: [
      {
        answer:
          "You can reload a maximum of once every 7 days but can reload anytime after 7 " +
          "days from the previous reload. The timer at the top of the screen will let you know how long " +
          "to wait until you can next Reload. Your 7 day timer starts after you first Redeem one of our many " +
          "great offers.",
        key: function () {
          return this.answer;
        }
      }
    ]
  },
  {
    header: {
      question: "Do I have to Reload?",
      key: function () {
        return this.question;
      }
    },
    data: [
      {
        answer:
          "No. The Barcode is not a subscription and you can choose to use it as often " +
          "or as little as you like. You can use The Barcode as a directory of great independent Venues " +
          "and take advantage of the offers that are on there from when you sign up. However, Reloading " +
          "is the best way to make the most of all of the features on 'The Barcode' app, and remember, " +
          "you only pay to save.",
        key: function () {
          return this.answer;
        }
      }
    ]
  },
  {
    header: {
      question: "How much does it cost to reload?",
      key: function () {
        return this.question;
      }
    },
    data: [
      {
        answer: regionData
          ? regionData?.currency_symbol + regionData?.reload
          : "",
        key: function () {
          return this.answer;
        }
      }
    ]
  },
  {
    header: {
      question: "Do the same rules apply to all venues?",
      key: function () {
        return this.question;
      }
    },
    data: [
      {
        answer:
          "Yes, all Venues have to honour a minimum discount of 10% off a round to the " +
          "value of " +
          regionData?.currency_symbol +
          regionData?.round +
          " at all times. However this can vary from 10%, 15% and 25% at " +
          "different Venues and at different times. You can see the value of the discount at " +
          "the banner at the bottom of each venue page.",
        key: function () {
          return this.answer;
        }
      }
    ]
  },
  {
    header: {
      question: "What is the minimum discount that any venue can offer?",
      key: function () {
        return this.question;
      }
    },
    data: [
      {
        answer:
          "10% off the first round up to a value of " +
          regionData?.currency_symbol +
          regionData?.round +
          ", on any day of the week and at any time.",
        key: function () {
          return this.answer;
        }
      }
    ]
  },
  {
    header: {
      question: "What is the maximum discount any venue can offer?",
      key: function () {
        return this.question;
      }
    },
    data: [
      {
        answer:
          "It is open ended and depends entirely on the individual venue and what they wish to do.",
        key: function () {
          return this.answer;
        }
      }
    ]
  },
  {
    header: {
      question: "Is there any time I can't claim my discount?",
      key: function () {
        return this.question;
      }
    },
    data: [
      {
        answer:
          "Only when you have already used your discounts and have not applied either " +
          "credits or reloaded.",
        key: function () {
          return this.answer;
        }
      }
    ]
  },
  {
    header: {
      question: "Can I claim my discount at any Venue that is on the app?",
      key: function () {
        return this.question;
      }
    },
    data: [
      {
        answer: "Yes.",
        key: function () {
          return this.answer;
        }
      }
    ]
  },
  {
    header: {
      question: "Are all offers exclusive to The Barcode?",
      key: function () {
        return this.question;
      }
    },
    data: [
      {
        answer:
          "Any offer that has a redemption button attached will be an exclusive Barcode offer, " +
          "so you don't need to worry about wasting money or credits on regular offers. Venues are also able to " +
          "promote regular deals on The Barcode but these are purely informational and can't be redeemed. " +
          "The 10%,15% and 25% off deal is a unique Barcode offer and is available at all of our partner Venues",
        key: function () {
          return this.answer;
        }
      }
    ]
  },
  {
    header: {
      question: "Does the discount apply to food as well as drinks?",
      key: function () {
        return this.question;
      }
    },
    data: [
      {
        answer:
          "Yes - Users can claim their minimum discounts off any order for any items up to the value of " +
          regionData?.currency_symbol +
          regionData?.round +
          ".",
        key: function () {
          return this.answer;
        }
      }
    ]
  },
  {
    header: {
      question: "What do I get for a referral?",
      key: function () {
        return this.question;
      }
    },
    data: [
      {
        answer:
          "For each referral you make to 'The Barcode' you receive 1 free credit on us. " +
          "Just go to the invite friends tab and invite as many friends as you want. " +
          "When they have downloaded the app and redeemed their first offer you will get a credit. ",
        key: function () {
          return this.answer;
        }
      }
    ]
  },
  {
    header: {
      question: "How much is a credit worth?",
      key: function () {
        return this.question;
      }
    },
    data: [
      {
        answer:
          "A credit can be used to activate any offer you like. This could be a members discount of 10%,15% and 25% " +
          "that you want to re-use or one of the many other offers on the app that you want to redeem again.",
        key: function () {
          return this.answer;
        }
      }
    ]
  },
  {
    header: {
      question: "How do I get more credits?",
      key: function () {
        return this.question;
      }
    },
    data: [
      {
        answer:
          "You can get credits by inviting friends to join the app or sharing offers with your friends. " +
          "The Credits will drop into your account as soon they have either downloaded the app using your code and " +
          "redeemed their first offer, or redeemed the offer you shared. ",
        key: function () {
          return this.answer;
        }
      }
    ]
  },
  {
    header: {
      question: "How often can I use credits?",
      key: function () {
        return this.question;
      }
    },
    data: [
      {
        answer:
          "You can use credits as often as you like. For them to be valid though you " +
          "need to have reloaded within the previous 7 days. If you haven't, no problem, just hit the Reload button " +
          "and reactivate all the offers that you have previously Redeemed.",
        key: function () {
          return this.answer;
        }
      }
    ]
  },
  {
    header: {
      question: "How many credits can I use in a night?",
      key: function () {
        return this.question;
      }
    },
    data: [
      {
        answer:
          "You can use as many credits in a night as you have available. You can Redeem 2 " +
          "offers per night per venue but how many venues you go and Redeem in is up to you.",
        key: function () {
          return this.answer;
        }
      }
    ]
  },
  {
    header: {
      question: "Can I save credits?",
      key: function () {
        return this.question;
      }
    },
    data: [
      {
        answer:
          "Yes. They have no expiry date so feel free to bank them for a rainy day.",
        key: function () {
          return this.answer;
        }
      }
    ]
  },
  {
    header: {
      question: "Can I use credits if I haven't reloaded?",
      key: function () {
        return this.question;
      }
    },
    data: [
      {
        answer:
          "From the moment you have downloaded the app you can use as many credits as " +
          "you earn in the next 7 days. After that, you can only apply credits when you have reloaded within " +
          "any 7 day period. You can however still earn credits by referring friends and sharing deals, " +
          "they are then saved in your account for the next time you decide to reload. ",
        key: function () {
          return this.answer;
        }
      }
    ]
  },
  {
    header: {
      question: "Am I able to claim offers if I haven't reloaded?",
      key: function () {
        return this.question;
      }
    },
    data: [
      {
        answer:
          "Yes, unless the offer that is sent out is conditional on you redeeming your " +
          "offer and you have already redeemed previously in that venue since your last reload period.",
        key: function () {
          return this.answer;
        }
      }
    ]
  },
  {
    header: {
      question: "What defines which offers I receive in my Trending feed?",
      key: function () {
        return this.question;
      }
    },
    data: [
      {
        answer:
          "Trending offers are designed to show you the most relevant offers and events on any given day. " +
          "Based on any available data on user history, preference settings and geographical location we " +
          "match you with the most relevant offers and events appearing in the app each day. You can " +
          "adjust which offers you receive by altering your user preferences, adding information to your " +
          "profile or by favouriting specific venues.",
        key: function () {
          return this.answer;
        }
      }
    ]
  },
  {
    header: {
      question:
        "Can I take advantage of offers that have not appeared in my 'Trending.'?",
      key: function () {
        return this.question;
      }
    },
    data: [
      {
        answer:
          "Yes. The Trending deals are just a neat way of you receiving the most relevant " +
          "offers whilst avoiding being spammed. There are of course though loads of other offers and " +
          "promotions for you to peruse and use at your leisure.",
        key: function () {
          return this.answer;
        }
      }
    ]
  }
];
