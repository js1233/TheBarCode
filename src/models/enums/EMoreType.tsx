import React from "react";
import WalletIcon from "assets/images/ic_wallet.svg";
import QrCode from "assets/images/ic_qrcode.svg";
import UserCircle from "assets/images/ic_user_circle.svg";
import Location from "assets/images/ic_location.svg";
import CreditCard from "assets/images/ic_credit_card.svg";
import Fadders from "assets/images/ic_faders.svg";
import Preferences from "assets/images/ic_preferences.svg";
import Flag from "assets/images/ic_flag.svg";
import Questions from "assets/images/ic_questions.svg";
import Rules from "assets/images/ic_rules.svg";
import Lock from "assets/images/ic_lock.svg";
import Power from "assets/images/ic_power.svg";
import { SvgProp } from "utils/Util";
import Bell from "assets/images/ic_bell.svg";
import { Color, NumberProp } from "react-native-svg";

enum EMoreType {
  Wallet = "Wallet",
  SPLIT_SCANNER = "Split The Bill Scanner",
  Notifications = "Notifications",
  ACCOUNT_SETTINGS = "Account Settings",
  MY_ADDRESSES = "My Addresses",
  PAYMENT_METHODS = "My Payment Methods",
  NOTIFICATION_SETTINGS = "Notification Settings",
  PREFERENCES = "Preferences",
  RELOAD = "Reload",
  FREQUENT_QUESTIONS = "Frequently Asked Questions",
  REDEMPTION_RULES = "Redemption & Reload Rules",
  PRIVACY_POLICY = "Privacy Policy",
  SIGN_OUT = "Sign out"
}

export type MoreProperty = {
  icon: SvgProp;
  displayText: EMoreType;
  count?: number;
};

export const moreProperties: MoreProperty[] = [
  {
    icon: (color?: Color, width?: NumberProp, height?: NumberProp) => (
      <WalletIcon fill={color} width={width} height={height} />
    ),
    displayText: EMoreType.Wallet
  },
  {
    icon: (color?: Color, width?: NumberProp, height?: NumberProp) => (
      <QrCode color={color} width={width} height={height} />
    ),
    displayText: EMoreType.SPLIT_SCANNER
  },
  {
    icon: (color?: Color, width?: NumberProp, height?: NumberProp) => (
      <Bell color={color} width={width} height={height} />
    ),
    displayText: EMoreType.Notifications
  },
  {
    icon: (color?: Color, width?: NumberProp, height?: NumberProp) => (
      <UserCircle color={color} width={width} height={height} />
    ),
    displayText: EMoreType.ACCOUNT_SETTINGS
  },
  {
    icon: (color?: Color, width?: NumberProp, height?: NumberProp) => (
      <Location color={color} width={width} height={height} />
    ),
    displayText: EMoreType.MY_ADDRESSES
  },
  {
    icon: (color?: Color, width?: NumberProp, height?: NumberProp) => (
      <CreditCard color={color} width={width} height={height} />
    ),
    displayText: EMoreType.PAYMENT_METHODS
  },
  {
    icon: (color?: Color, width?: NumberProp, height?: NumberProp) => (
      <Fadders color={color} width={width} height={height} />
    ),
    displayText: EMoreType.NOTIFICATION_SETTINGS
  },
  {
    icon: (color?: Color, width?: NumberProp, height?: NumberProp) => (
      <Preferences color={color} width={width} height={height} />
    ),
    displayText: EMoreType.PREFERENCES
  },
  {
    icon: (color?: Color, width?: NumberProp, height?: NumberProp) => (
      <Flag color={color} width={width} height={height} />
    ),
    displayText: EMoreType.RELOAD
  },
  {
    icon: (color?: Color, width?: NumberProp, height?: NumberProp) => (
      <Questions color={color} width={width} height={height} />
    ),
    displayText: EMoreType.FREQUENT_QUESTIONS
  },
  {
    icon: (color?: Color, width?: NumberProp, height?: NumberProp) => (
      <Rules color={color} width={width} height={height} />
    ),
    displayText: EMoreType.REDEMPTION_RULES
  },
  {
    icon: (color?: Color, width?: NumberProp, height?: NumberProp) => (
      <Lock color={color} width={width} height={height} />
    ),
    displayText: EMoreType.PRIVACY_POLICY
  },
  {
    icon: (color?: Color, width?: NumberProp, height?: NumberProp) => (
      <Power color={color} width={width} height={height} />
    ),
    displayText: EMoreType.SIGN_OUT
  }
];

export default EMoreType;
