import EMoreType from "models/enums/EMoreType";

export type MoreData = {
  id: number;
  text: EMoreType;
};

export const Data = [
  {
    id: 1,
    text: EMoreType.Wallet
  },
  {
    id: 2,
    text: EMoreType.SPLIT_SCANNER
  },
  {
    id: 3,
    text: EMoreType.Notifications
  },
  {
    id: 4,
    text: EMoreType.ACCOUNT_SETTINGS
  },
  {
    id: 5,
    text: EMoreType.MY_ADDRESSES
  },
  {
    id: 6,
    text: EMoreType.PAYMENT_METHODS
  },
  {
    id: 7,
    text: EMoreType.NOTIFICATION_SETTINGS
  },
  {
    id: 8,
    text: EMoreType.PREFERENCES
  },
  {
    id: 9,
    text: EMoreType.RELOAD
  },
  {
    id: 10,
    text: EMoreType.FREQUENT_QUESTIONS
  },
  {
    id: 11,
    text: EMoreType.REDEMPTION_RULES
  },
  {
    id: 12,
    text: EMoreType.PRIVACY_POLICY
  },
  {
    id: 13,
    text: EMoreType.SIGN_OUT
  }
];

export default Data;
